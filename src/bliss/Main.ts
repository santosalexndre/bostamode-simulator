import * as bump from '../libraries/bump';
import { Camera } from './Camera';
import { StateConstructor } from './interfaces';
import { Signal } from './util/Signal';

export class main {
    public static camera: Camera;
    public static width: number;
    public static height: number;
    public static mouse = { x: 0, y: 0, viewportX: 0, viewportY: 0, windowX: 0, windowY: 0 };
    public static world: bump.World = bump.newWorld(32);

    public static switchStateEvent: Signal<StateConstructor> = new Signal();

    public static switchState(state: StateConstructor): void {
        main.switchStateEvent.emit(state);
    }
}
