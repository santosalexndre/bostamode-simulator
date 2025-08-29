import { circle, pop, push, rectangle, setColor, translate } from 'love.graphics';
import vec from '../../libraries/nvec';
import { Basic } from '../Basic';
import { Entity } from '../Entity';
import { main } from '../Main';
import { Label } from './Label';
import { Color } from '../util/Color';
import { Signal } from '../util/Signal';
import { input } from '../Input';
import * as Timer from '../../libraries/timer';
import { UiElement } from './UiElement';

export class Button extends UiElement {
    public label: Label;

    public backgroundColor: Color = Color.LIGHT_GRAY;

    constructor(text?: string, onClick?: () => void) {
        super();
        this.label = new Label(text);
        this.label.anchor(this.anchorX, this.anchorY);
        this.width = this.label.width;
        this.height = this.label.height;
        if (onClick !== undefined) this.onClick.connect(onClick);
    }

    public setHitbox(left: number, top: number, right: number, bottom: number) {
        this.left = left + this.x;
        this.right = right + this.x;
        this.top = top + this.y;
        this.bottom = bottom + this.y;
    }

    public setSize(width: number, height: number) {
        const w = this.label.width;
        const h = this.label.height;
        this.width = math.max(width, w);
        this.height = math.max(height, h);
    }

    public setPosition(x: number, y: number) {
        this.label.position = vec(x + this.width * this.label['_anchorX'], y + this.height * this.label['_anchorY']);
        this.x = x;
        this.y = y;
    }

    override update(dt: number): void {
        this.timer.update(dt);
        if (this.overlaps(main.mouse.x, main.mouse.y, 2, 2)) {
            if (!this.hovered) {
                this.hovered = true;
                this.onHover.emit();
            }
        } else {
            if (this.hovered) this.onLeave.emit();
            this.hovered = false;
        }
        if (this.hovered && input.pressed('fire1')) {
            this.onClick.emit();
        }
    }

    override render(): void {
        setColor(this.backgroundColor);
        push();
        translate(-this.width * this.anchorX, -this.height * this.anchorY);
        rectangle('fill', this.x, this.y, this.width, this.height);
        setColor(1, 1, 1);
        this.label.render();
        setColor(1, 0, 0);
        // rectangle('line', this.left, this.top, this.right - this.left, this.bottom - this.top);
        pop();
        // circle('fill', this.x, this.y, 2);
    }
}
