/* tslint:disable */
/* eslint-disable */

export class WasmEmulator {
    free(): void;
    [Symbol.dispose](): void;
    af(): number;
    battery_ram(): Uint8Array;
    bc(): number;
    de(): number;
    flag_carry(): boolean;
    flag_half_carry(): boolean;
    flag_subtract(): boolean;
    flag_zero(): boolean;
    framebuffer_rgba(): Uint8Array;
    hl(): number;
    ime(): boolean;
    is_halted(): boolean;
    load_battery_ram(save: Uint8Array): void;
    load_demo(): void;
    load_rom(rom: Uint8Array): void;
    constructor();
    pc(): number;
    press_button(code: number): void;
    read_byte(address: number): number;
    reg_a(): number;
    reg_b(): number;
    reg_c(): number;
    reg_d(): number;
    reg_e(): number;
    reg_f(): number;
    reg_h(): number;
    reg_l(): number;
    release_button(code: number): void;
    sp(): number;
    step_frame(): void;
    total_cycles(): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_wasmemulator_free: (a: number, b: number) => void;
    readonly wasmemulator_af: (a: number) => number;
    readonly wasmemulator_battery_ram: (a: number) => [number, number];
    readonly wasmemulator_bc: (a: number) => number;
    readonly wasmemulator_de: (a: number) => number;
    readonly wasmemulator_flag_carry: (a: number) => number;
    readonly wasmemulator_flag_half_carry: (a: number) => number;
    readonly wasmemulator_flag_subtract: (a: number) => number;
    readonly wasmemulator_flag_zero: (a: number) => number;
    readonly wasmemulator_framebuffer_rgba: (a: number) => [number, number];
    readonly wasmemulator_hl: (a: number) => number;
    readonly wasmemulator_ime: (a: number) => number;
    readonly wasmemulator_is_halted: (a: number) => number;
    readonly wasmemulator_load_battery_ram: (a: number, b: number, c: number) => void;
    readonly wasmemulator_load_demo: (a: number) => void;
    readonly wasmemulator_load_rom: (a: number, b: number, c: number) => void;
    readonly wasmemulator_new: () => number;
    readonly wasmemulator_pc: (a: number) => number;
    readonly wasmemulator_press_button: (a: number, b: number) => void;
    readonly wasmemulator_read_byte: (a: number, b: number) => number;
    readonly wasmemulator_reg_a: (a: number) => number;
    readonly wasmemulator_reg_b: (a: number) => number;
    readonly wasmemulator_reg_c: (a: number) => number;
    readonly wasmemulator_reg_d: (a: number) => number;
    readonly wasmemulator_reg_e: (a: number) => number;
    readonly wasmemulator_reg_f: (a: number) => number;
    readonly wasmemulator_reg_h: (a: number) => number;
    readonly wasmemulator_reg_l: (a: number) => number;
    readonly wasmemulator_release_button: (a: number, b: number) => void;
    readonly wasmemulator_sp: (a: number) => number;
    readonly wasmemulator_step_frame: (a: number) => void;
    readonly wasmemulator_total_cycles: (a: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
