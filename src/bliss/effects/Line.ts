import { circle, getLineWidth, setLineWidth, line } from 'love.graphics';
import { Basic } from '../Basic';

export enum LineJointMode {
    Round,
    Flat,
}

export enum LineCapMode {
    Round,
    Flat,
}

export class Line extends Basic {
    private points: number[] = [];

    public capMode: LineJointMode = LineJointMode.Flat;
    public jointMode: LineJointMode = LineJointMode.Flat;
    public width: number = 1;

    public maxLength: number = 30;

    public addPoint(x: number, y: number): void {
        table.insert(this.points, x);
        table.insert(this.points, y);
    }

    public length(): number {
        return this.points.length / 2;
    }

    public removeFirst(): void {
        if (this.points.length >= 2) {
            table.remove(this.points, 1);
            table.remove(this.points, 1);
        }
    }

    public removeLast(): void {
        if (this.points.length >= 2) {
            table.remove(this.points, this.points.length);
            table.remove(this.points, this.points.length);
        }
    }

    public override render(): void {
        if (this.points.length < 4) return;
        if (this.capMode == LineJointMode.Round) {
            circle('fill', this.points[0], this.points[1], this.width / 2);
            circle('fill', this.points[this.points.length - 2], this.points[this.points.length - 1], this.width / 2);
        }
        if (this.jointMode == LineJointMode.Round) {
            for (let i = 0; i < this.points.length - 2; i += 2) {
                circle('fill', this.points[i], this.points[i + 1], this.width / 2);
            }
        }
        const lw = getLineWidth();
        setLineWidth(this.width);
        line(this.points);
        setLineWidth(lw);
    }
}
