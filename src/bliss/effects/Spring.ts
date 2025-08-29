import type { IUpdatable } from '../interfaces';

export class Spring implements IUpdatable {
    public value: number = 0;
    private tension: number = 500;
    private damping: number = 20;
    private target: number = 0;
    private velocity: number = 0;

    public update(dt: number) {
        const a = -this.tension * (this.value - this.target) - this.damping * this.velocity;
        this.velocity = this.velocity + a * dt;
        this.value = this.value + this.velocity * dt;
    }

    public pull(force: number, tension: number = 500, damp: number = 20) {
        this.tension = tension;
        this.damping = damp;
        this.velocity = this.velocity + force;
    }
}
