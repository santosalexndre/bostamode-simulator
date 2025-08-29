/** Extra mathematical functions wrapper */
/** @noSelfInFile */
/** Wrap value around range [lo, hi) */
/** @customName wrap */
export function wrap(v: number, lo: number, hi: number): number;

/** Wrap index around table t */
/** @customName wrap_index */
export function wrapIndex(i: number, t: unknown[]): number;

/** Clamp value to range [lo, hi] */
export function clamp(v: number, lo: number, hi: number): number;

/** Clamp value to range [0,1] */
export function clamp01(v: number): number;

/** Round to nearest whole, away from zero */
export function round(v: number): number;

/** Round value to increments of 1/x */
/** @customName to_one_in */
export function toOneIn(v: number, x: number): number;

/** Round to a given decimal precision */
/** @customName to_precision */
export function toPrecision(v: number, decimalPoints: number): number;

/** Get sign of a scalar (-1, 0, 1) */
export function sign(v: number): number;

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number;

/** Linear interpolation with minimum step */
/** @customName lerp_eps */
export function lerpEps(a: number, b: number, t: number, eps: number): number;

/** Bilinear interpolation between 4 samples */
export function bilerp(a: number, b: number, c: number, d: number, u: number, v: number): number;

/** Get lerp factor on a range */
export function inverseLerp(v: number, min: number, max: number): number;

/** Remap value from one range to another */
/** @customName remap_range */
export function remapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number): number;

/** Remap value staying within target range */
/** @customName remap_range_clamped */
export function remapRangeClamped(v: number, inMin: number, inMax: number, outMin: number, outMax: number): number;

/** Easing functions (0-1) */
export function identity(f: number): number;
export function smoothstep(f: number): number;
export function smootherstep(f: number): number;
export function pingpong(f: number): number;
/** @customName ease_in*/
export function easeIn(f: number): number;

/** @customName ease_out */
export function easeOut(f: number): number;

/** @customName ease_inout */
export function easeInOut(f: number): number;
/** @customName ease_inout_branchless */
export function easeInOutBranchless(f: number): number;

/** Random functions */
/** @customName random_sign */
export function randomSign(rng?: { random(): number }): number;
/** @customName random_lepr */
export function randomLerp(min: number, max: number, rng?: { random(): number }): number;

/** NaN checking */
export function isNaN(v: number): boolean;

/** Angle constants */
export const tau: number;

/** Normalize angle onto [-pi, pi) */
/** @customName normalise_angle */
export function normalizeAngle(a: number): number;

/** Get normalised difference between two angles */
/** @customName angle_difference */
export function angleDifference(a: number, b: number): number;

/** Lerp for angles */
/** @customName lerp_angle */
export function lerp_angle(a: number, b: number, t: number): number;

/** Lerp for angles with epsilon */
/** @customName lerp_angle_eps */
export function lerpAngleEps(a: number, b: number, t: number, eps: number): number;

/** Geometric functions (multi-return where applicable) */
export function rotate(x: number, y: number, r: number): LuaMultiReturn<[number, number]>;
export function length(x: number, y: number): number;
export function distance(x1: number, y1: number, x2: number, y2: number): number;

export const deg2rad: number;
export const rad2deg: number;
