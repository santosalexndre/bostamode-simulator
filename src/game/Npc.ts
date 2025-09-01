import { pop, push, scale, translate } from 'love.graphics';
import { Sprite } from '../bliss/Sprite';

export class Npc extends Sprite {
    public state: string = 'wander';
    public dir: number = 1;
    public wanderTime: number = 1;
    public idleTime: number = 1;

    polygon: number[];
    constructor(x: number, y: number) {
        super(x, y);
        this.animation.play('girl/idle')
        this.setHitbox(0, 0, 32, 128);
        this.polygon = [0, 5, 0, -5, 150, -40, 150, 40];
    }

    public override update(dt: number): void {
        super.update(dt);

        if (this.state === 'wander') {
            this.wanderTime -= dt;
            this.velocity.x = this.dir * 100;

            if (this.wanderTime < 0) {
                this.state = 'idle';
                this.idleTime = love.math.random() * 1 + 1;
                this.flipX = this.dir;
            }
        } else if (this.state == 'idle') {
            this.idleTime -= dt;
            this.velocity.x = 0;
            if (this.idleTime < 0) {
                this.state = 'wander';
                this.wanderTime = love.math.random() * 1 + 1;
                this.dir *= -1;
                this.flipX = this.dir;
            }
        }
    }

    public override render(): void {
        super.render();
        push();
        translate(this.position.x, this.position.y - this.height / 2 + 15);
        scale(this.flipX, 1);
        love.graphics.setColor(1, 0, 0, 0.2);
        love.graphics.polygon('fill', this.polygon);
        love.graphics.setColor(1, 1, 1);
        pop();
    }
}
