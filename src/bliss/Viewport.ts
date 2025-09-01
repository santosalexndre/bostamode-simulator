import { Canvas, draw, getColor, getHeight, getWidth, Image, newCanvas, pop, push, Quad, scale, setCanvas, setColor, setScissor, translate, clear } from 'love.graphics';
import { Color } from './util/Color';

export enum ViewportMode {
    CanvasItem, // Renders to a canvas, which is then drawn to the screen
    Viewport, // Cuts to a specific area of the screen
    PixelPerfect, // Renders to a canvas with pixel-perfect scaling
    Disabled, // Renders directly to the screen
}

export interface ViewportOptions {
    mode?: ViewportMode;
    bgColor?: Color;
    bgImage?: Image;
    bgQuad?: Quad;
}

export class Viewport {
    private canvas: Canvas;
    private mode: ViewportMode;
    private bgColor: Color;
    private bgImage?: Image;
    private bgQuad?: Quad;
    private width: number = 0;
    private height: number = 0;
    private windowWidth: number = getWidth();
    private windowHeight: number = getHeight();

    constructor(width: number, height: number, viewportOptions: ViewportOptions = {}) {
        this.width = width;
        this.height = height;
        this.mode = viewportOptions.mode || ViewportMode.CanvasItem;
        this.bgColor = viewportOptions.bgColor || new Color('#111111ff');
        this.bgImage = viewportOptions.bgImage;
        this.bgQuad = viewportOptions.bgQuad;
        this.canvas = newCanvas(width, height);
    }

    public getDimensions(): LuaMultiReturn<[number, number]> {
        return $multi(this.width, this.height);
    }

    public getWidth(): number {
        return this.width;
    }
    public getHeight(): number {
        return this.height;
    }

    public attach() {
        const ratio = this.getScreenScale();
        const [offx, offy] = this.getScreenOffset();

        if (this.mode === ViewportMode.Viewport) {
            translate(offx, offy);
            setScissor(offx, offy, this.width * ratio, this.height * ratio);
            push();
            scale(ratio, ratio);
            clear(this.bgColor);
        } else {
            push();
            setCanvas(this.canvas);
            clear(this.bgColor);
        }
    }

    public detach() {
        setCanvas();
        setScissor();
        pop();
    }

    public renderViewport() {
        const ratio = this.getScreenScale();
        const [offx, offy] = this.getScreenOffset();
        draw(this.canvas, offx, offy, 0, ratio, ratio);
    }

    renderTo(fn: () => void) {
        const ratio = this.getScreenScale();
        const [offx, offy] = this.getScreenOffset();

        if (this.mode === ViewportMode.CanvasItem || this.mode === ViewportMode.PixelPerfect) {
            setCanvas(this.canvas);
            const [r, g, b, a] = getColor();
            clear(this.bgColor);
            fn();
            setColor(r, g, b, a);
            setCanvas();

            if (this.bgImage) {
                draw(this.bgImage, this.bgQuad!, 0, 0, 0, ratio, ratio, 0, 0, 0, 0);
            }
            draw(this.canvas, offx, offy, 0, ratio, ratio);
        } else {
            translate(offx, offy);
            setScissor(offx, offy, this.width * ratio, this.height * ratio);
            push();
            scale(ratio, ratio);
            clear(this.bgColor);
            fn();
            setScissor();
            setColor(1, 1, 1);
            pop();
        }
    }

    setBackgroundImage() {}

    getMousePosition(x: number, y: number): LuaMultiReturn<[number, number]> {
        const ratio = this.getScreenScale();
        const [offx, offy] = this.getScreenOffset();

        return $multi((x - offx) / ratio, (y - offy) / ratio);
    }

    setBackgroundColor(color: Color) {}

    getScreenScale(): number {
        let sx = this.windowWidth / this.width;
        let sy = this.windowHeight / this.height;
        if (this.mode === ViewportMode.PixelPerfect) {
            sx = Math.floor(sx);
            sy = Math.floor(sy);
        }
        return Math.min(sx, sy);
    }

    getScreenOffset(): LuaMultiReturn<[number, number]> {
        const ratio = this.getScreenScale();
        const offx = Math.max(0, (this.windowWidth - this.width * ratio) / 2);
        const offy = Math.max(0, (this.windowHeight - this.height * ratio) / 2);
        return $multi(offx, offy);
    }

    getViewportRect() {}

    onResize(w: number, h: number) {
        this.windowWidth = w;
        this.windowHeight = h;
    }
}
