import { Basic } from '../../bliss/Basic';
import { input } from '../../bliss/Input';
import { main } from '../../bliss/Main';
import { Signal } from '../../bliss/util/Signal';

export class Clickable extends Basic {
    onButtonPress: Signal = new Signal();
    onButtonReleased: Signal = new Signal();
    onMouseEnter: Signal = new Signal();
    onMouseLeave: Signal = new Signal();

    public hovered: boolean = false;

    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number,
    ) {
        super();
    }

    public overlaps(x: number, y: number, w: number, h: number): boolean {
        // this rect
        const ax1 = this.x - this.w / 2;
        const ay1 = this.y - this.h / 2;
        const ax2 = this.x + this.w / 2;
        const ay2 = this.y + this.h / 2;

        // other rect
        const bx1 = x;
        const by1 = y;
        const bx2 = x + w;
        const by2 = y + h;

        // check if they overlap
        return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
    }

    override update(dt: number): void {
        const inside = this.overlaps(main.mouse.x, main.mouse.y, 3, 3);

        if (inside) {
            if (input.released('fire1')) this.onButtonReleased.emit();
            if (input.pressed('fire1')) this.onButtonPress.emit();
        }

        if (inside && !this.hovered) {
            this.hovered = true;
            this.onMouseEnter.emit();
        } else if (!inside && this.hovered) {
            this.hovered = false;
            this.onMouseLeave.emit();
        }
    }
}
