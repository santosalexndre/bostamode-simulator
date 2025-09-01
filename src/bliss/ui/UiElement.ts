import * as Timer from '../../libraries/timer';
import { Basic } from '../Basic';
import { Signal } from '../util/Signal';

export class UiElement extends Basic {
    public x: number = 0;
    public y: number = 0;
    public anchorX: number = 0;
    public anchorY: number = 0;

    public left: number = 0;
    public right: number = 0;
    public top: number = 0;
    public bottom: number = 0;

    public width: number = 0;
    public height: number = 0;

    public hovered: boolean = false;
    public timer: Timer = Timer();
    public onHover: Signal<void> = new Signal();
    public onLeave: Signal<void> = new Signal();
    public onClick: Signal<void> = new Signal();
    public onClickReleased: Signal<void> = new Signal();

    public overlaps(x: number, y: number, w: number, h: number): boolean {
        // this rect
        const ax1 = this.left;
        const ay1 = this.top;
        const ax2 = this.right;
        const ay2 = this.bottom;

        // other rect
        const bx1 = x;
        const by1 = y;
        const bx2 = x + w;
        const by2 = y + h;

        // check if they overlap
        return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
    }
    public anchor(x: number, y: number) {
        this.anchorX = x;
        this.anchorY = y;
    }
    constructor() {
        super();
    }
}
