import { Emitter } from '../bliss/effects/Emitter';
import { input } from '../bliss/Input';
import { ICollision } from '../bliss/interfaces';
import { main } from '../bliss/Main';
import { Sprite } from '../bliss/Sprite';
import { trace } from '../libraries/inspect';
import { deg2rad } from '../libraries/mathx';

export class Player extends Sprite {
    constructor(x: number, y: number) {
        super(x, y);

        this.setHitbox(0, 0, 32, 32);

        this.animation.setPath('player/');
        this.animation.play('divedown');

        this.timer.script(wait => {
            this.timer.tween(0.5, this.scale, { x: 0.5, y: 2 }, 'out-circ');
            this.timer.tween(0.5, this.position, { x: main.width / 2, y: main.height / 2 }, 'out-circ');
            this.timer.tween(0.5, this.scale, { x: 1, y: 1 }, 'out-circ');
            this.timer.tween(0.5, this.position, { x: main.width, y: main.height }, 'out-circ');
        });
    }

    override update(dt: number): void {
        super.update(dt);
        // this.rotation += dt * 360;
        // this.velocity.x = Math.cos(this.rotation * deg2rad) * 300;
        // this.velocity.y = Math.sin(this.rotation * deg2rad) * 300;
        // if (Input.down('left')) this.position.x -= 100 * dt;
        // if (Input.down('right')) this.position.x += 100 * dt;
        // if (Input.down('up')) this.position.y -= 100 * dt;
        // if (Input.down('down')) this.position.y += 100 * dt;
    }

    public override render(): void {
        super.render();
    }

    protected override onCollision(col: ICollision): void {
        this.destroy();
    }
}
