import { Image, Quad, newQuad, draw } from 'love.graphics';

export type ThreeSliceOrientation = 'horizontal' | 'vertical';

export class ThreeSlice {
    private image: Image;
    private start: number;
    private end: number;
    private orientation: ThreeSliceOrientation;
    private quads: Quad[];

    private imgWidth: number;
    private imgHeight: number;

    constructor(image: Image, start: number, end: number, orientation: ThreeSliceOrientation) {
        this.image = image;
        this.start = start;
        this.end = end;
        this.orientation = orientation;

        this.imgWidth = this.image.getWidth();
        this.imgHeight = this.image.getHeight();

        this.quads = this.buildQuads();
    }

    private buildQuads(): Quad[] {
        const iw = this.imgWidth;
        const ih = this.imgHeight;

        if (this.orientation === 'horizontal') {
            const middleW = iw - this.start - this.end;
            return [
                newQuad(0, 0, this.start, ih, iw, ih), // left
                newQuad(this.start, 0, middleW, ih, iw, ih), // center
                newQuad(iw - this.end, 0, this.end, ih, iw, ih), // right
            ];
        } else {
            const middleH = ih - this.start - this.end;
            return [
                newQuad(0, 0, iw, this.start, iw, ih), // top
                newQuad(0, this.start, iw, middleH, iw, ih), // center
                newQuad(0, ih - this.end, iw, this.end, iw, ih), // bottom
            ];
        }
    }

    public render(x: number, y: number, w: number, h: number): void {
        const quads = this.quads;

        if (this.orientation === 'horizontal') {
            const middleW = w - this.start - this.end;

            const positions = [
                { x: x, y: y, w: this.start, h: h }, // left
                { x: x + this.start, y: y, w: middleW, h: h }, // center
                { x: x + this.start + middleW, y: y, w: this.end, h: h }, // right
            ];

            for (let i = 0; i < 3; i++) {
                const quad = quads[i];
                const pos = positions[i];
                const [_, __, qw, qh] = quad.getViewport();
                draw(this.image, quad, pos.x, pos.y, 0, pos.w / qw, pos.h / qh);
            }
        } else {
            const middleH = h - this.start - this.end;

            const positions = [
                { x: x, y: y, w: w, h: this.start }, // top
                { x: x, y: y + this.start, w: w, h: middleH }, // center
                { x: x, y: y + this.start + middleH, w: w, h: this.end }, // bottom
            ];

            for (let i = 0; i < 3; i++) {
                const quad = quads[i];
                const pos = positions[i];
                const [_, __, qw, qh] = quad.getViewport();
                draw(this.image, quad, pos.x, pos.y, 0, pos.w / qw, pos.h / qh);
            }
        }
    }
}
