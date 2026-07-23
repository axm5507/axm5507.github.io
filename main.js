import init, { WasmEmulator } from './pkg/emulator_core.js';
const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;
const ROM_PATH = 'roms/newgame.gb';
// Keyboard -> Game Boy button codes, matching button_from_code() in src/web.rs.
// Select (Shift) is deliberately absent here: it's intercepted at the page
// level to toggle the debug overlay and never reaches the emulator's joypad.
const KEY_CODES = {
    ArrowRight: 0,
    ArrowLeft: 1,
    ArrowUp: 2,
    ArrowDown: 3,
    KeyZ: 4,
    KeyX: 5,
    Enter: 6,
};
function getEl(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`missing #${id}`);
    return el;
}
const canvas = getEl('screen');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
const overlay = getEl('overlay');
const overlayToggle = getEl('overlay-toggle');
const romStatus = getEl('rom-status');
const themeToggle = getEl('theme-toggle');
const overlayFields = {
    af: getEl('ov-af'),
    bc: getEl('ov-bc'),
    de: getEl('ov-de'),
    hl: getEl('ov-hl'),
    sp: getEl('ov-sp'),
    pc: getEl('ov-pc'),
    flags: getEl('ov-flags'),
    ime: getEl('ov-ime'),
    halted: getEl('ov-halted'),
    fps: getEl('ov-fps'),
    cycles: getEl('ov-cycles'),
};
let emu;
let overlayVisible = false;
let fps = 0;
let lastFrameTime = performance.now();
function hex(value, width) {
    return value.toString(16).toUpperCase().padStart(width, '0');
}
function toggleOverlay() {
    overlayVisible = !overlayVisible;
    overlay.classList.toggle('visible', overlayVisible);
}
// Light/dark theme toggle. Runs independently of emulator startup (no reason
// to gate it behind wasm/ROM loading) and persists the choice across visits.
// The class lives on <html> so :root.light can redefine the same custom
// properties every existing rule already reads (--bg, --px-white, etc.),
// rather than needing a parallel set of light-mode selectors.
const THEME_KEY = 'theme';
const SUN = '☀'; // click while dark -> switches to light
const MOON = '☾'; // click while light -> switches to dark
function applyThemeIcon() {
    const isLight = document.documentElement.classList.contains('light');
    themeToggle.textContent = isLight ? MOON : SUN;
}
// Sweeps the new theme in as a circle expanding from wherever the toggle was
// clicked, covering the whole page - not just the sidebar. Browsers without
// the View Transitions API (Safari, older Firefox) just get an instant swap;
// startViewTransition is a progressive enhancement by design.
function toggleTheme(event) {
    const goingLight = !document.documentElement.classList.contains('light');
    const applyState = () => {
        document.documentElement.classList.toggle('light', goingLight);
        localStorage.setItem(THEME_KEY, goingLight ? 'light' : 'dark');
        applyThemeIcon();
    };
    const startViewTransition = document.startViewTransition?.bind(document);
    if (!startViewTransition) {
        applyState();
        return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = startViewTransition(applyState);
    transition.ready.then(() => {
        document.documentElement.animate({
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        }, {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
        });
    });
}
applyThemeIcon();
themeToggle.addEventListener('click', toggleTheme);
function onKeyDown(event) {
    if (event.code === 'ShiftRight' || event.code === 'ShiftLeft') {
        event.preventDefault();
        if (!event.repeat)
            toggleOverlay();
        return;
    }
    const code = KEY_CODES[event.code];
    if (code !== undefined) {
        event.preventDefault();
        emu.press_button(code);
    }
}
function onKeyUp(event) {
    const code = KEY_CODES[event.code];
    if (code !== undefined) {
        event.preventDefault();
        emu.release_button(code);
    }
}
// Wires the drawn D-pad/A/B/Start buttons on the console shell to the same
// press_button/release_button calls the keyboard path uses, so the on-screen
// console is actually playable (and doubles as touch controls on mobile).
// Pointer capture keeps press/release paired to the same button even if a
// touch drags off it mid-press.
function bindConsoleButton(el, code) {
    const press = (event) => {
        event.preventDefault();
        el.setPointerCapture(event.pointerId);
        emu.press_button(code);
    };
    const release = (event) => {
        event.preventDefault();
        emu.release_button(code);
    };
    el.addEventListener('pointerdown', press);
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
}
function bindConsoleControls() {
    document.querySelectorAll('.console [data-code]').forEach((el) => {
        const code = Number(el.dataset.code);
        bindConsoleButton(el, code);
    });
    getEl('btn-select').addEventListener('click', toggleOverlay);
}
function updateOverlay() {
    overlayFields.af.textContent = hex(emu.af(), 4);
    overlayFields.bc.textContent = hex(emu.bc(), 4);
    overlayFields.de.textContent = hex(emu.de(), 4);
    overlayFields.hl.textContent = hex(emu.hl(), 4);
    overlayFields.sp.textContent = hex(emu.sp(), 4);
    overlayFields.pc.textContent = hex(emu.pc(), 4);
    overlayFields.flags.textContent =
        (emu.flag_zero() ? 'Z' : '-') +
            (emu.flag_subtract() ? 'N' : '-') +
            (emu.flag_half_carry() ? 'H' : '-') +
            (emu.flag_carry() ? 'C' : '-');
    overlayFields.ime.textContent = emu.ime() ? 'on' : 'off';
    overlayFields.halted.textContent = emu.is_halted() ? 'yes' : 'no';
    overlayFields.fps.textContent = fps.toFixed(1);
    overlayFields.cycles.textContent = Math.round(emu.total_cycles()).toLocaleString();
}
function loop(now) {
    const delta = now - lastFrameTime;
    lastFrameTime = now;
    if (delta > 0) {
        const instantFps = 1000 / delta;
        fps = fps === 0 ? instantFps : fps * 0.9 + instantFps * 0.1;
    }
    emu.step_frame();
    imageData.data.set(emu.framebuffer_rgba());
    ctx.putImageData(imageData, 0, 0);
    if (overlayVisible) {
        updateOverlay();
    }
    requestAnimationFrame(loop);
}
async function loadRom() {
    const response = await fetch(ROM_PATH);
    if (!response.ok) {
        romStatus.textContent = 'No newgame.gb found yet — showing the built-in demo pattern.';
        emu.load_demo();
        return;
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    emu.load_rom(bytes);
    romStatus.textContent = '';
}
async function main() {
    await init();
    emu = new WasmEmulator();
    await loadRom();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    overlayToggle.addEventListener('click', toggleOverlay);
    bindConsoleControls();
    requestAnimationFrame(loop);
}
main().catch((error) => {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    romStatus.textContent = `Failed to start emulator: ${message}`;
});
