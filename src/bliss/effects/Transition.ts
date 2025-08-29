import { rectangle, setColor } from 'love.graphics';
import * as Timer from '../../libraries/timer';
import { Basic } from '../Basic';
import { Signal } from '../util/Signal';
import { main } from '../Main';

export class Transition extends Basic {
    public timer: Timer = Timer();
    public onFinished: Signal = new Signal();

    override update(dt: number): void {
        super.update(dt);
        this.timer.update(dt);
    }

    constructor() {
        1;
        super();
    }
}

export class FadeInOut extends Transition {
    constructor() {
        super();
    }

    override render(): void {
        rectangle('fill', 0, 0, main.width, main.height);
    }
}
