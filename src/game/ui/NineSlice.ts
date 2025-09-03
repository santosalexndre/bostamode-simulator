import { draw, Image, newQuad, Quad } from 'love.graphics';

export class NineSlice {
    private image: Image;
    private left: number;
    private top: number;
    private right: number;
    private bottom: number;
    private quads: Quad[][];

    private imgWidth: number;
    private imgHeight: number;

    constructor(image: Image, left: number, top: number, right: number, bottom: number) {
        this.image = image;
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;

        this.imgWidth = this.image.getWidth();
        this.imgHeight = this.image.getHeight();

        this.quads = this.buildQuads();
    }

    private buildQuads(): Quad[][] {
        const iw = this.imgWidth;
        const ih = this.imgHeight;
        const l = this.left;
        const r = this.right;
        const t = this.top;
        const b = this.bottom;

        const middleW = iw - l - r;
        const middleH = ih - t - b;

        return [
            [
                newQuad(0, 0, l, t, iw, ih), // top-left
                newQuad(l, 0, middleW, t, iw, ih), // top
                newQuad(iw - r, 0, r, t, iw, ih), // top-right
            ],
            [
                newQuad(0, t, l, middleH, iw, ih), // left
                newQuad(l, t, middleW, middleH, iw, ih), // center
                newQuad(iw - r, t, r, middleH, iw, ih), // right
            ],
            [
                newQuad(0, ih - b, l, b, iw, ih), // bottom-left
                newQuad(l, ih - b, middleW, b, iw, ih), // bottom
                newQuad(iw - r, ih - b, r, b, iw, ih), // bottom-right
            ],
        ];
    }

    public render(x: number, y: number, w: number, h: number): void {
        const l = this.left;
        const r = this.right;
        const t = this.top;
        const b = this.bottom;

        const middleW = w - l - r;
        const middleH = h - t - b;

        const positions = [
            [
                { x: x, y: y, w: l, h: t },
                { x: x + l, y: y, w: middleW, h: t },
                { x: x + l + middleW, y: y, w: r, h: t },
            ],
            [
                { x: x, y: y + t, w: l, h: middleH },
                { x: x + l, y: y + t, w: middleW, h: middleH },
                { x: x + l + middleW, y: y + t, w: r, h: middleH },
            ],
            [
                { x: x, y: y + t + middleH, w: l, h: b },
                { x: x + l, y: y + t + middleH, w: middleW, h: b },
                { x: x + l + middleW, y: y + t + middleH, w: r, h: b },
            ],
        ];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const quad = this.quads[row][col];
                const pos = positions[row][col];
                draw(this.image, quad, pos.x, pos.y, 0, pos.w / quad.getViewport()[2], pos.h / quad.getViewport()[3]);
            }
        }
    }
}
