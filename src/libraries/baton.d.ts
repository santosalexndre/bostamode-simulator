// baton.d.ts

import { Joystick } from 'love.joystick';

declare namespace baton
{
    export interface Config
    {
        controls: Record<string, string[]>;
        pairs?: Record<string, [string, string, string, string]>;
        deadzone?: number;
        squareDeadzone?: boolean;
        joystick?: Joystick; // LOVE2D joystick reference
    }

    export interface Control
    {
        sources: string[];
        rawValue: number;
        value: number;
        down: boolean;
        downPrevious: boolean;
        pressed: boolean;
        released: boolean;
    }

    export interface Pair
    {
        controls: [string, string, string, string];
        rawX: number;
        rawY: number;
        x: number;
        y: number;
        down: boolean;
        downPrevious: boolean;
        pressed: boolean;
        released: boolean;
    }

    export class Player
    {
        constructor(config: Config);

        /** Call every update loop */
        update(): void;

        /** Get raw control or pair values (ignores deadzone) */
        getRaw(name: string): number | [number, number];

        /** Get control or pair values (with deadzone) */
        get(name: string): number | [number, number];

        /** Whether a control or pair is currently held down */
        down(name: string): boolean;

        /** Whether a control or pair was pressed this frame */
        pressed(name: string): boolean;

        /** Whether a control or pair was released this frame */
        released(name: string): boolean;

        /** Get the current active device ("kbm", "joy", or "none") */
        getActiveDevice(): "kbm" | "joy" | "none";
    }

    export function init(this: void, config: Config): Player;

    export const _VERSION: string;
    export const _DESCRIPTION: string;
    export const _URL: string;
    export const _LICENSE: string;
}

export = baton;
export as namespace baton;
