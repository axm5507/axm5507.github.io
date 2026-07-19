/* @ts-self-types="./emulator_core.d.ts" */

export class WasmEmulator {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmEmulatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmemulator_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    af() {
        const ret = wasm.wasmemulator_af(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Uint8Array}
     */
    battery_ram() {
        const ret = wasm.wasmemulator_battery_ram(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @returns {number}
     */
    bc() {
        const ret = wasm.wasmemulator_bc(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    de() {
        const ret = wasm.wasmemulator_de(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    flag_carry() {
        const ret = wasm.wasmemulator_flag_carry(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    flag_half_carry() {
        const ret = wasm.wasmemulator_flag_half_carry(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    flag_subtract() {
        const ret = wasm.wasmemulator_flag_subtract(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    flag_zero() {
        const ret = wasm.wasmemulator_flag_zero(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Uint8Array}
     */
    framebuffer_rgba() {
        const ret = wasm.wasmemulator_framebuffer_rgba(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @returns {number}
     */
    hl() {
        const ret = wasm.wasmemulator_hl(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    ime() {
        const ret = wasm.wasmemulator_ime(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_halted() {
        const ret = wasm.wasmemulator_is_halted(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {Uint8Array} save
     */
    load_battery_ram(save) {
        const ptr0 = passArray8ToWasm0(save, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.wasmemulator_load_battery_ram(this.__wbg_ptr, ptr0, len0);
    }
    load_demo() {
        wasm.wasmemulator_load_demo(this.__wbg_ptr);
    }
    /**
     * @param {Uint8Array} rom
     */
    load_rom(rom) {
        const ptr0 = passArray8ToWasm0(rom, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.wasmemulator_load_rom(this.__wbg_ptr, ptr0, len0);
    }
    constructor() {
        const ret = wasm.wasmemulator_new();
        this.__wbg_ptr = ret;
        WasmEmulatorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    pc() {
        const ret = wasm.wasmemulator_pc(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} code
     */
    press_button(code) {
        wasm.wasmemulator_press_button(this.__wbg_ptr, code);
    }
    /**
     * @param {number} address
     * @returns {number}
     */
    read_byte(address) {
        const ret = wasm.wasmemulator_read_byte(this.__wbg_ptr, address);
        return ret;
    }
    /**
     * @returns {number}
     */
    reg_a() {
        const ret = wasm.wasmemulator_reg_a(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    reg_b() {
        const ret = wasm.wasmemulator_reg_b(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    reg_c() {
        const ret = wasm.wasmemulator_reg_c(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    reg_d() {
        const ret = wasm.wasmemulator_reg_d(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    reg_e() {
        const ret = wasm.wasmemulator_reg_e(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    reg_f() {
        const ret = wasm.wasmemulator_reg_f(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    reg_h() {
        const ret = wasm.wasmemulator_reg_h(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    reg_l() {
        const ret = wasm.wasmemulator_reg_l(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} code
     */
    release_button(code) {
        wasm.wasmemulator_release_button(this.__wbg_ptr, code);
    }
    /**
     * @returns {number}
     */
    sp() {
        const ret = wasm.wasmemulator_sp(this.__wbg_ptr);
        return ret;
    }
    step_frame() {
        wasm.wasmemulator_step_frame(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    total_cycles() {
        const ret = wasm.wasmemulator_total_cycles(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) WasmEmulator.prototype[Symbol.dispose] = WasmEmulator.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_344f42d3211c4765: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./emulator_core_bg.js": import0,
    };
}

const WasmEmulatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmemulator_free(ptr, 1));

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('emulator_core_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
