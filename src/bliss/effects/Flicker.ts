import { Entity } from '../Entity';

export class FlxFlicker {
    public static flicker(object: Entity, times: number, rate: number, after?: () => void) {
        object.timer.every(
            rate,
            () => {
                object.visible = !object.visible;
            },
            rate,
        );
        if (after) object.timer.after(times * rate, after);
    }
}
