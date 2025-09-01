import { main } from '../../bliss/Main';
import { Images } from '../../bliss/util/Resources';
import { PlayState } from '../PlayState';
import { SceneManager } from '../SceneManager';
import { ClickableSprite } from './ClickableSprite';

export class ClickableObject extends ClickableSprite {
    public sxx: number = 1;
    public syy: number = 1;

    public type: 'npc' | 'object';

    constructor(spritePath: string, x: number, y: number) {
        super(Images.get(spritePath), x, y);

        this.onMouseEnter.connect(() => {
            this.timer.tween(0.2, this, { sxx: 1.1, syy: 1.1 }, 'out-cubic');
            this.spring.pull(5);
        });
        this.onMouseLeave.connect(() => {
            this.timer.tween(0.2, this, { sxx: 1.0, syy: 1.0 }, 'out-cubic');
        });
    }

    override update(dt: number): void {
        super.update(dt);
        this.sx = this.sxx + this.spring.value;
        this.sy = this.syy + this.spring.value;
    }
}
