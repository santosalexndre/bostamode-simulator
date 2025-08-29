import { Image, Quad } from 'love.graphics';
import { Signal } from '../util/Signal';
import { Animation } from './Animation';
import { Animations } from '../util/Resources';

// TODO: I think the animations variable might be redundant idk
// i want avoid creating garbage because tstl already does a lot of that
// and i want to avoid talbe lookups because i think tstl also overrides that
// shit and idk its probaly not a big deal but idk
export class AnimationController {
    // private static sharedDefs: LuaTable<string, LuaTable<string, FlxAnimation>> = new LuaTable();

    private _timer: number = 0;
    private _animationLength: number;
    public _current: Animation;
    public _texture: Image;
    public _currentQuad: Quad;

    public currentAnimation: string;
    public frameIndex: number;
    public playing: boolean = false;
    public loop: boolean = false;
    public loopCount: number = 0;

    public speed: number = 1;

    public animationFinished: Signal<string> = new Signal();
    public animationLooped: Signal<number> = new Signal();
    public animationChanged: Signal<string> = new Signal();

    // constructor(private graphicId: string) {
    // if (!FlxAnimationController.sharedDefs.has(graphicId)) {
    //     FlxAnimationController.sharedDefs.set(graphicId, new LuaTable());
    // }
    // }

    private path: string = '';
    public setPath(path: string) {
        this.path = path;
    }

    public play(animation: string) {
        if (this.currentAnimation === animation) return;
        this.currentAnimation = animation;
        this._current = Animations.get(this.path + animation);
        this._animationLength = this._current.frames.length;
        this._texture = this._current.frameSrc.texture;
        this.playing = true;
        this.frameIndex = 0;
        this.loop = this._current.loop;
        const frame = this._current.frames[this.frameIndex];
        this._currentQuad = this._current.frameSrc.frames[frame];
        this.animationChanged.emit(this.currentAnimation);
    }

    // public add(name: string, frames: number[], fps: number = 0, loop: boolean = false) {
    //     const defs = FlxAnimationController.sharedDefs.get(this.graphicId);
    //     let existing = defs.get(name);
    //     if (!existing) {
    //         const frameCollection = new FlxFrames(Images.get(this.graphicId), 8, 1);
    //         defs.set(name, new FlxAnimation(frameCollection, frames, fps, loop));
    //     }
    // }

    public stop() {
        this.playing = false;
    }

    public update(dt: number) {
        if (!this.playing) return;

        this._timer += dt * this.speed;
        if (this._timer > 1 / this._current.fps) {
            this._timer = 0;
            if (this.frameIndex >= this._animationLength - 1) {
                if (this.loop) {
                    this.frameIndex = 0;
                    this.loopCount += 1;
                    this.animationLooped.emit(this.loopCount);
                } else {
                    this.animationFinished.emit(this.currentAnimation);
                }
            } else {
                this.frameIndex += 1;
            }

            const frame = this._current.frames[this.frameIndex];
            this._currentQuad = this._current.frameSrc.frames[frame];
        }
    }
}
