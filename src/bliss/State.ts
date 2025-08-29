import * as Timer from '../libraries/timer';
import { Group } from './group/Group';
import { Signal } from './util/Signal';

export class State extends Group {
    public timer: Timer = Timer();
    public onOpen: Signal<void> = new Signal();
    public onClose: Signal<void> = new Signal();

    constructor() {
        super();
    }

    public enter() {}

    public exit() {}

    public override update(dt: number): void {
        super.update(dt);
        this.timer.update(dt);
    }
}
