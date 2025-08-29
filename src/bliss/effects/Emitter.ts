import { draw, Image, newParticleSystem, ParticleSystem } from 'love.graphics';
import vec, { Point } from '../../libraries/nvec';
import * as Timer from '../../libraries/timer';
import { Basic } from '../Basic';
import { Images, SpriteSheets } from '../util/Resources';
import { main } from '../Main';
import { FrameCollection } from '../animation/FrameCollection';
import { Color } from '../util/Color';

export class Emitter extends Basic {
    public position: Point;
    public timer: Timer = Timer();
    private _ps: ParticleSystem;
    private _texture: FrameCollection;
    public rotation: number = 0;

    constructor(x: number, y: number) {
        super();
        this._texture = SpriteSheets.load('images/bola.png', 16, 16);

        const amount = 5;
        this._ps = newParticleSystem(this._texture.texture, amount);
        this._ps.setBufferSize(amount);
        this._ps.setSpread(math.pi * 2);
        this._ps.setEmissionArea('ellipse', 0, 0);
        // this._ps.setSpin(0, 5);
        this._ps.setQuads(this._texture.frames as any);
        this._ps.setColors(new Color('#ff13a48e') as any);
        this._ps.setParticleLifetime(0.3, 0.5);
        this._ps.setSpeed(-250, 250);
        this._ps.setLinearDamping(3, 5);
        this.position = vec(x, y);
        this._ps.emit(amount);
        this.timer.after(4, () => this.kill());
    }

    override update(dt: number): void {
        this.timer.update(dt);
        this._ps.update(dt);
    }

    override destroy(): void {
        super.destroy();
        this._ps.release();
    }

    override render(): void {
        draw(this._ps, this.position.x, this.position.y, this.rotation);
    }
}
