import { Image, newQuad, Quad } from 'love.graphics';

/**
 * TODO: Im not really using this the same way as before so is hould probalbly
 * clean this up a bit, like, remove the texture field adn other redudant information */
export class FrameCollection {
    public frames: Quad[] = [];
    public texture: Image;
    public frameWidth: number;
    public frameHeight: number;

    constructor(texture: Image, width: number, height: number) {
        const [w, h] = texture.getDimensions();
        const vslices = Math.ceil(w / width);
        const hslices = Math.ceil(h / height);
        const fw = width;
        const fh = height;

        for (let y = 0; y < hslices; y++) {
            for (let x = 0; x < vslices; x++) {
                this.frames.push(newQuad(x * fw, y * fh, fw, fh, w, h));
            }
        }

        this.texture = texture;
        this.frameWidth = fw;
        this.frameHeight = fh;
    }

    public getDimensions(): LuaMultiReturn<[number, number]> {
        return $multi(this.frameWidth, this.frameHeight);
    }
}
