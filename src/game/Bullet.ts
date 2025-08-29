import { ICollision } from '../bliss/interfaces';
import { Sprite } from '../bliss/Sprite';
import { Color } from '../bliss/util/Color';
import { trace } from '../libraries/inspect';
import { deg2rad } from '../libraries/mathx';

const color1: Color = new Color('#e7d5d565');
const color2: Color = new Color('#00f7ffff');
export class Bullet extends Sprite {
    constructor(x?: number, y?: number) {
        super(x, y);
        this.loadGraphic('images/bullet.png');
        this.tag = 'bullet';
        this.setHitbox(0, 0, 12, 12);
        this.setCollisionFilters({ player: 'slide', bullet: 'cross' });
        // this.timer.after(0.5, () => this.removeTag('ghost'));
    }

    public override update(dt: number): void {
        super.update(dt);
        if (this.lifetime > 2) this.destroy();
        // this.rotation += dt * 360;
        this.velocity.x = math.cos(this.rotation * deg2rad) * 300;
        this.velocity.y = Math.sin(this.rotation * deg2rad) * 300;
        // if (this.hasTag('ghost')) this.tint = color1;
        // else this.tint = color2;
    }

    public override onCollision(col: ICollision): void {
        // this.destroy();
    }
}
