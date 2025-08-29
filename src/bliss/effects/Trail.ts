import { setLineWidth, setColor, line } from 'love.graphics';
import { Entity } from '../Entity';

export class Trail extends Entity {
    public parent: Entity;
    public points: LuaTable<number, number | undefined> = new LuaTable();

    /**
     * Number of points in the trail.
     */
    public maxLength: number = 30;

    /**
     * Time in seconds for each point to fade out and be removed from the trail.
     */
    public trailDuration: number = 1;
    public trailMaxWidth: number = 8;
    public updateRate: number = 1 / 60; // 30 FPS
    private updateTimer: number = 0;

    private trailTimer: number = 0;

    constructor(parent: Entity) {
        super(parent.position.x, parent.position.y);
        this.parent = parent;
    }

    override update(dt: number): void {
        super.update(dt);

        this.position = this.parent.position;
        // if (this.updateTimer < this.updateRate)
        // {
        //     this.updateTimer += dt;
        //     return;
        // }
        // this.updateTimer -= this.updateRate;

        if (this.points.length() > 2) {
            this.trailTimer += dt;
            while (this.trailTimer > this.trailDuration) {
                // print('oi?');
                this.trailTimer -= this.trailDuration;
                this.points.set(this.points.length(), undefined);
                this.points.set(this.points.length(), undefined);
            }
        }

        // @ts-expect-error
        table.insert(this.points, 1, this.y);
        // @ts-expect-error
        table.insert(this.points, 1, this.x);

        if (this.points.length() > this.maxLength * 2) {
            for (let i = this.points.length(); i >= this.maxLength * 2 + 1; i--) {
                this.points.set(i, undefined);
            }
        }
    }

    getTrailWidth(i: number): number {
        return (this.points.length() - (i + 1)) / this.points.length();
    }

    override render() {
        super.render();

        if (this.points.get(1)) {
            const w = this.trailMaxWidth * this.getTrailWidth(1);
            // love.graphics.circle('fill', this.points.get(1)!, this.points.get(2)!, w / 2);
        }
        for (let i = this.points.length() - 1; i >= 3; i -= 2) {
            // backwards for color trail
            const c = this.getTrailWidth(i); // value of color
            const w = this.trailMaxWidth * c;
            setLineWidth(w);
            setColor(c, c, c);
            line(this.points.get(i - 2)!, this.points.get(i - 1)!, this.points.get(i)!, this.points.get(i + 1)!);
            // circle('fill', this.points.get(i)!, this.points.get(i + 1)!, w / 2);
        }

        setLineWidth(1);
        setColor(1, 1, 1);
    }
}
