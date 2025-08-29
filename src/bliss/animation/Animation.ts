import { FrameCollection } from './FrameCollection';

export class Animation {
    public fps: number;
    public frames: number[];
    public frameSrc: FrameCollection;
    public loop: boolean;
    constructor(frameSrc: FrameCollection, frames: number[], fps: number, loop: boolean = false) {
        this.frames = frames;
        this.fps = fps;
        this.frameSrc = frameSrc;
        this.loop = loop;
    }
}
