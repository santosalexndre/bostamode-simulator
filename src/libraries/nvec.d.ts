/**
 * hump.vector compatible FFI-accelerated 2D vector library
 * Translated TypeScript annotations
 */

export interface Point {
    x: number;
    y: number;

    /** Clone this vector */
    clone(): Point;

    /** Unpack components as tuple */
    unpack(): [number, number];

    /** String representation */
    toString(): string;

    /** Unary minus */
    neg(): Point;

    /** Vector addition */
    add: LuaAdditionMethod<Point, Point>;

    /** Vector subtraction */
    sub: LuaSubtractionMethod<Point, Point>;

    /** Multiply by scalar */
    mul: LuaMultiplicationMethod<Point, number>;

    /** Less than comparison */
    lt: LuaLessThanMethod<Point, boolean>;

    gt: LuaGreaterThanMethod<Point, boolean>;

    /** Component wise division */
    div(b: Point): Point;

    /** Dot product */
    dot(b: Point): number;

    /** Per-component multiplication */
    permul(b: Point): Point;

    /** Convert to polar coordinates (angle, length) */
    toPolar(): Point;

    /** Squared length */
    len2(): number;

    /** Length */
    len(): number;

    /** Squared distance to another vector */
    dist2(b: Point): number;

    /** Distance to another vector */
    dist(b: Point): number;

    /** Normalize this vector in place */
    normalizeInplace(): Point;

    /** Return normalized copy */
    normalized(): Point;

    /** Alias for normalized */
    normalize(): Point;

    /** Rotate this vector in place */
    rotateInplace(angle: number): Point;

    /** Rotate copy */
    rotate(angle: number): Point;

    /** Alias for rotate */
    rotated(angle: number): Point;

    /** Perpendicular vector (-y, x) */
    perpendicular(): Point;

    /** Projection of this vector on v */
    projectOn(v: Point): Point;

    /** Reflection of this vector on v */
    mirrorOn(v: Point): Point;

    /** Cross product (2D scalar version) */
    cross(v: Point): number;

    /** Trim this vector’s length in place */
    trimInplace(maxLen: number): Point;

    /** Return trimmed copy */
    trim(maxLen: number): Point;

    /** Alias for trim */
    trimmed(maxLen: number): Point;

    /** Angle relative to another vector, or absolute if none given */
    angleTo(other?: Point): number;

    /** The angle of this vector in radians  */
    angle(): number;
}

interface PointConstructor {
    /** Construct a new vector */
    (this: void, x?: number, y?: number): Point;

    /** Zero vector */
    zero: Point;

    /** Create from polar coordinates */
    fromPolar(this: void, angle: number, radius?: number): Point;

    /** Create random direction vector with length between min and max */
    randomDirection(this: void, min?: number, max?: number): Point;

    /** Is object an NVec */
    isvector(obj: unknown): obj is Point;
    is(obj: unknown): obj is Point;
}

/** The NVec module */
declare const vec: PointConstructor;
export default vec;
// export Point;
