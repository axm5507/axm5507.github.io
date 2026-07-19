import init, { WasmEmulator } from './pkg/emulator_core.js';

const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;
const ROM_PATH = 'roms/portfolio.gb';

// Keyboard -> Game Boy button codes, matching button_from_code() in src/web.rs.
// Select (Right Shift) is deliberately absent here: it's intercepted at the page
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

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);

const overlay = document.getElementById('overlay');
const overlayToggle = document.getElementById('overlay-toggle');
const romStatus = document.getElementById('rom-status');

const overlayFields = {
  af: document.getElementById('ov-af'),
  bc: document.getElementById('ov-bc'),
  de: document.getElementById('ov-de'),
  hl: document.getElementById('ov-hl'),
  sp: document.getElementById('ov-sp'),
  pc: document.getElementById('ov-pc'),
  flags: document.getElementById('ov-flags'),
  ime: document.getElementById('ov-ime'),
  halted: document.getElementById('ov-halted'),
  fps: document.getElementById('ov-fps'),
  cycles: document.getElementById('ov-cycles'),
};

let emu = null;
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

function onKeyDown(event) {
  if (event.code === 'ShiftRight') {
    event.preventDefault();
    if (!event.repeat) toggleOverlay();
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
    romStatus.textContent = 'No portfolio.gb found yet — showing the built-in demo pattern.';
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

  requestAnimationFrame(loop);
}

main().catch((error) => {
  console.error(error);
  romStatus.textContent = `Failed to start emulator: ${error.message}`;
});
