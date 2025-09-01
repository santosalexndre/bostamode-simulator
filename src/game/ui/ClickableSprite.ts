import { draw, Image } from 'love.graphics';
import { Clickable } from './Clickable';
import { Spring } from '../../bliss/effects/Spring';
import * as Timer from '../../libraries/timer';

export class ClickableSprite extends Clickable {
    public sx: number;
    public sy: number;
    public rotation: number;
    public spring: Spring = new Spring();
    public timer: Timer = Timer();

    constructor(
        public sprite: Image,
        x: number,
        y: number,
    ) {
        super(x, y, sprite.getWidth(), sprite.getHeight());
    }

    override update(dt: number): void {
        super.update(dt);
        this.timer.update(dt);
        this.spring.update(dt);
    }

    override render(): void {
        draw(this.sprite, this.x, this.y, this.rotation, this.sx, this.sy, this.w / 2, this.h / 2);
    }
}
