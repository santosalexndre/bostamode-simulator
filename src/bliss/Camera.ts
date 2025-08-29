// The MIT License
//
// Copyright (c) 2017 SSYGEN
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
import { pop, push, scale, translate, rotate } from 'love.graphics';
import { Viewport, ViewportMode } from './Viewport';
import { Basic } from './Basic';
import { Entity } from './Entity';
import { clamp } from '../libraries/mathx';

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}
function csnap(v: number, x: number): number {
    return Math.ceil(v / x) * x - x / 2;
}

class Shake {
    private amplitude: number;
    private duration: number;
    private frequency: number;
    private samples: number[];
    private startTime: number;
    private t: number;
    public shaking: boolean;
    constructor(amplitude: number, duration: number, frequency: number) {
        this.amplitude = amplitude;
        this.duration = duration;
        this.frequency = frequency;
        this.samples = [];
        this.startTime = 0;
        this.t = 0;
        this.shaking = false;
    }

    update(dt: number) {
        this.t = love.timer.getTime() * 1000 - this.startTime;
        if (this.t > this.duration) this.shaking = false;
    }

    shakeNoise(s: number): number {
        if (s >= this.samples.length) return 0;
        return this.samples[s] || 0;
    }
    shakeDecay(t: number): number {
        if (t > this.duration) return 0;
        return (this.duration - t) / this.duration;
    }
    getShakeAmplitude(t?: number): number {
        if (!t) {
            if (!this.shaking) return 0;
            t = this.t;
        }

        const s = (t / 1000) * this.frequency;
        const s0 = Math.floor(s);
        const s1 = s0 + 1;
        const k = this.shakeDecay(t);
        return this.amplitude * (this.shakeNoise(s0) + (s - s0) * (this.shakeNoise(s1) - this.shakeNoise(s0))) * k;
    }
}

export class Camera extends Basic {
    public viewport: Viewport;
    public x: number = 0;
    public y: number = 0;
    public width: number;
    public height: number;
    private scale: number = 1;
    public rotation: number = 0;
    private target: Entity;
    public lerpAmount: number = 0.6;
    private targetX: number = 0;
    private targetY: number = 0;
    private scrollFactorX: number = 1;
    private scrollFactorY: number = 1;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private horizontalShakes: Shake[] = [];
    private verticalShakes: Shake[] = [];
    private lastHorizontalShakeAmount: number = 0;
    private lastVerticalShakeAmount: number = 0;

    private deadzone = false;
    private deadzoneX: number = 0;
    private deadzoneY: number = 0;
    private deadzoneW: number = 0;
    private deadzoneH: number = 0;

    public drawDeadzone: boolean = false;

    public constructor(width: number, height: number, viewportMode?: ViewportMode) {
        super();
        print('ola cmaera');
        this.width = width;
        this.height = height;
        this.viewport = new Viewport(width, height, { mode: viewportMode || ViewportMode.CanvasItem });
        this.x = this.width / 2;
        this.y = this.height / 2;
        // this.rotation = 0.1;
    }

    public onResize(x: number, y: number) {
        // this.width = x;
        // this.height = y;
        this.viewport.onResize(x, y);
    }
    public override update(dt: number) {
        let horizontalShakeAmount = 0;
        let verticalShakeAmount = 0;
        for (let i = this.horizontalShakes.length - 1; i >= 0; i--) {
            this.horizontalShakes[i].update(dt);
            horizontalShakeAmount += this.horizontalShakes[i].getShakeAmplitude();
            if (!this.horizontalShakes[i].shaking) this.horizontalShakes.splice(i, 1);
        }
        for (let i = this.verticalShakes.length - 1; i >= 0; i--) {
            this.verticalShakes[i].update(dt);
            verticalShakeAmount += this.verticalShakes[i].getShakeAmplitude();
            if (!this.verticalShakes[i].shaking) this.verticalShakes.splice(i, 1);
        }

        this.offsetX -= this.lastHorizontalShakeAmount;
        this.offsetY -= this.lastVerticalShakeAmount;
        this.offsetX += horizontalShakeAmount;
        this.offsetY += verticalShakeAmount;
        this.lastHorizontalShakeAmount = horizontalShakeAmount;
        this.lastVerticalShakeAmount = verticalShakeAmount;

        if (this.target !== undefined) {
            this.targetX = this.target.position.x;
            this.targetY = this.target.position.y;
            this.x = this.targetX;
            this.y = this.targetY;
        }

        // this.x = math.lerp(this.x, this.targetX, dt * 10);
        // this.y = math.lerp(this.y, this.targetY, dt * 10);

        // if (!this.target) return;
        // if (!this.deadzone)
        // {
        //     this.x = this.targetX;
        //     this.y = this.targetY;
        // }
        // if (horizontalShakeAmount !== this.lastHorizontalShakeAmount)
        // {
        //     this.move(horizontalShakeAmount, 0);
        //     this.lastHorizontalShakeAmount = horizontalShakeAmount;
        // }
        // if (verticalShakeAmount !== this.lastVerticalShakeAmount)
        // {
        //     this.move(0, verticalShakeAmount);
        //     this.lastVerticalShakeAmount = verticalShakeAmount;
        // }

        // this.x = Math.round(this.x);
        // this.y = Math.round(this.y);

        if (!this.deadzone) return;
        this.x = clamp(this.x, this.deadzoneX + this.width / 2, this.deadzoneW - this.width / 2);
        this.y = clamp(this.y, this.deadzoneY + this.height / 2, this.deadzoneH - this.height / 2);
    }

    public follow(x: number, y: number): void {
        // TODO: remove this hack
        this.target = new Entity();
        this.targetX = x;
        this.targetY = y;
    }

    public setDeadzone(x: number, y: number, w: number, h: number): void {
        this.deadzone = true;
        this.deadzoneX = x;
        this.deadzoneY = y;
        this.deadzoneW = w;
        this.deadzoneH = h;
    }

    public move(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }

    public setTarget(target: Entity): void {
        this.target = target;
    }

    public attach(): void {
        push();
        translate(this.width / 2, this.height / 2);
        scale(this.scale);
        rotate(this.rotation);
        translate((-this.x + this.offsetX) * this.scrollFactorX, (-this.y + this.offsetY) * this.scrollFactorY);
    }

    public detach(): void {
        pop();
    }

    public checkVisibility(obj: Entity) {
        // const dx = this.x - obj.x;
        // const dy = this.y - obj.y;
        // const dist = dx * dx + dy * dy;
        // return !(dist > (this.width / 2 + obj.width / 2) * (this.width / 2 + obj.width / 2));
        const left = this.x - this.width / 2;
        const right = this.x + this.width / 2;
        const top = this.y - this.height / 2;
        const bottom = this.y + this.height / 2;
        const visible = obj.position.x + obj.width > left && obj.position.x < right && obj.position.y + obj.height > top && obj.position.y < bottom;
        return visible;
    }

    public toWorldCoords(x: number, y: number): LuaMultiReturn<[number, number]> {
        const c = Math.cos(this.rotation);
        const s = Math.sin(this.rotation);
        const dx = (x - this.width / 2) / this.scale;
        const dy = (y - this.height / 2) / this.scale;
        const rx = c * dx + s * dy;
        const ry = -s * dx + c * dy;

        return $multi(rx + this.x, ry + this.y);
    }

    public toCameraCoords(x: number, y: number): LuaMultiReturn<[number, number]> {
        const c = Math.cos(this.rotation);
        const s = Math.sin(this.rotation);

        let dx = x - this.x;
        let dy = y - this.y;

        const rx = c * dx - s * dy;
        const ry = s * dx + c * dy;

        return $multi(rx * this.scale + this.width / 2, ry * this.scale + this.height / 2);
    }

    public getMousePosition(): [number, number] {
        const [x, y] = love.mouse.getPosition();
        const [mx, my] = this.viewport.getMousePosition(x, y);

        return this.toWorldCoords(mx, my);
    }

    public shake(intensity: number, duration: number, frequency: number, axes: string = 'XY'): void {
        if (!axes) axes = 'XY';
        axes = axes.toUpperCase();

        if (axes.includes('X')) {
            table.insert(this.horizontalShakes, new Shake(intensity, duration * 1000, frequency));
        }
        if (axes.includes('Y')) {
            table.insert(this.verticalShakes, new Shake(intensity, duration * 1000, frequency));
        }
    }
}
