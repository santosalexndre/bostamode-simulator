import { main } from '../bliss/Main';
import * as Timer from '../libraries/timer';
import { Effect } from './dialoguetypes';
import { globalState } from './global';

export const handleEffects = (effects: Effect[] | undefined, timer: Timer) => {
    if (effects === undefined) return;

    effects.forEach(effect => {
        if (effect.shake) {
            const shake = effect.shake;
            main.camera.shake(shake[0], shake[1], shake[2], shake[3]);
            timer.every(0.659340659, () => main.camera.shake(shake[0], shake[1], shake[2], shake[3]));
        }

        if (effect.set) {
            for (const [key, value] of effect.set) {
                globalState.set(key, value);
            }
        }
    });
};
