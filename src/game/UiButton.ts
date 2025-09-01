import { rectangle, setColor } from 'love.graphics';
import { TimerHandle } from '../bliss/interfaces';
import { Button } from '../bliss/ui/Button';
import vec from '../libraries/nvec';

export class btn extends Button {
    public bgWidth = 200;
    public bgHeight = 20;

    handle1: TimerHandle;
    handle2: any;
    constructor(text?: string, onClick?: () => void) {
        super(text, onClick);
        this.label.position = vec(this.x, this.y);
        this.label.anchor(0.5, 0.5);
    }

    public override update(dt: number): void {
        super.update(dt);
    }

    override render(): void {
        setColor(this.backgroundColor);
        rectangle('fill', this.x - this.bgWidth / 2 + this.width / 2, this.y - this.bgHeight / 2 + this.height / 2, this.bgWidth, this.bgHeight);
        setColor(1, 1, 1);
        this.label.render();
        // rectangle('line', this.left, this.top, this.right - this.left, this.bottom - this.top);
        // super.render();
    }
}
