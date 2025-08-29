import { draw, Image, newQuad, Quad } from 'love.graphics';

export class NineSlice {
    private _quads: Quad[];

    constructor(
        public texture: Image,
        public left: number,
        public right: number,
        public top: number,
        public bottom: number,
    ) {
        throw 'not implemented yet x-x';
    }

    public render(x: number, y: number, w: number, h: number): void {}
}
