// hump-timer.d.ts

/** Represents a scheduled timer handle */
declare interface TimerHandle {
    time: number;
    limit: number;
    count: number;
    during: (dt: number, remaining: number) => void;
    after: (self?: any) => void | boolean;
}

/** Available easing modes */
declare type EaseMode =
    | 'linear'
    | 'quad'
    | 'cubic'
    | 'quart'
    | 'quint'
    | 'sine'
    | 'expo'
    | 'circ'
    | 'back'
    | 'bounce'
    | 'elastic'
    | 'in-linear'
    | 'in-quad'
    | 'in-cubic'
    | 'in-quart'
    | 'in-quint'
    | 'in-sine'
    | 'in-expo'
    | 'in-circ'
    | 'in-back'
    | 'in-bounce'
    | 'in-elastic'
    | 'out-linear'
    | 'out-quad'
    | 'out-cubic'
    | 'out-quart'
    | 'out-quint'
    | 'out-sine'
    | 'out-expo'
    | 'out-circ'
    | 'out-back'
    | 'out-bounce'
    | 'out-elastic'
    | 'in-out-linear'
    | 'in-out-quad'
    | 'in-out-cubic'
    | 'in-out-quart'
    | 'in-out-quint'
    | 'in-out-sine'
    | 'in-out-expo'
    | 'in-out-circ'
    | 'in-out-back'
    | 'in-out-bounce'
    | 'in-out-elastic'
    | 'out-in-linear'
    | 'out-in-quad'
    | 'out-in-cubic'
    | 'out-in-quart'
    | 'out-in-quint'
    | 'out-in-sine'
    | 'out-in-expo'
    | 'out-in-circ'
    | 'out-in-back'
    | 'out-in-bounce'
    | 'out-in-elastic';

// type TargetProperties<T> = {
//     [K in keyof T as T[K] extends number ? K : never]?: T[K];
// };
type TargetProperties<T> = {
    [K in keyof T]?: T[K] extends number ? T[K] : never;
} & Record<string, number>;
// type TargetProperties<T> = Partial<Pick<T, NumericKeys<T>>>;
// type TargetProperties<T> = {
//     [K in keyof T]?:
//     T[K] extends number
//     ? T[K] // numbers can be directly tweened
//     : T[K] extends object
//     ? TargetProperties<T[K]> // recurse into sub-objects
//     : never; // disallow non-numeric scalars
// };
/** A Timer instance (like hump.timer.new()) */
declare interface Timer {
    /**
     * Update all running timers.
     * Should be called once per frame with delta time.
     */
    update(dt: number): void;

    /**
     * Run `during(dt)` every frame for `delay` seconds.
     * Call `after()` once at the end.
     */
    during(delay: number, during: (dt: number, remaining: number) => void, after?: (self?: any) => void | boolean): TimerHandle;

    /**
     * Run a function once after `delay` seconds.
     */
    after(delay: number, action: (self?: any) => void | boolean): TimerHandle;

    /**
     * Run a function every `delay` seconds, optionally a fixed number of times.
     */
    every(delay: number, action: (self?: any) => void | boolean, count?: number): TimerHandle;

    /**
     * Cancel a timer handle so it won’t run again.
     */
    cancel(handle: TimerHandle): void;

    /**
     * Cancel all timers in this instance.
     */
    clear(): void;

    /**
     * Run a coroutine-like script with a `wait()` function.
     */
    script(action: (this: void, wait: (this: void, seconds: number) => void) => void): void;

    /**
     * Tween numeric properties on an object.
     */
    tween<T>(duration: number, subject: T, target: Record<string, number>, method?: EaseMode, after?: () => void, ...args: any[]): TimerHandle;
}

interface TimerConstructor {
    (): Timer;
}
// /**
//  * Default global timer instance (like requiring hump.timer).
//  * All methods are forwarded to this instance.
//  */
declare const Timer: TimerConstructor;
export = Timer;
