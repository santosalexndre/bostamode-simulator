import { Emitter } from '../bliss/effects/Emitter';
import { input } from '../bliss/Input';
import { ICollision } from '../bliss/interfaces';
import { main } from '../bliss/Main';
import { Sprite } from '../bliss/Sprite';
import { trace } from '../libraries/inspect';
import { clamp, deg2rad, lerp_angle } from '../libraries/mathx';

export class Player extends Sprite {
    constructor(x: number, y: number) {
        super(x, y);

        this.setHitbox(0, 0, 16, 16);

        this.loadGraphic('images/player.png');
        // this.animation.setPath('girl/');
        // this.animation.play('idle');
    }

    moving = false;
    rot = 0;
    override update(dt: number): void {
        super.update(dt);
        let dx = 0,
            dy = 0;

        if (input.down('left')) dx -= 1;
        if (input.down('right')) dx += 1;
        if (input.down('down')) dy += 1;
        if (input.down('up')) dy -= 1;

        this.velocity.x = dx * 60;

        if (dx != 0) {
            this.rot += dt % math.pi;
            this.rotation = math.sin(this.rot * 360) * 5;
        } else {
            this.rotation = 0;
        }
    }

    public override render(): void {
        super.render();
    }

    protected override onCollision(col: ICollision): void {
        // this.destroy();
    }
}
