import { circle, rectangle, setColor } from 'love.graphics';
import { Sprite } from '../bliss/Sprite';
import { Dialogue } from './Dialogue';
import { PlayState } from './PlayState';
import { Signal } from '../bliss/util/Signal';

type InteractMode = 'hide' | 'dialogue' | 'unknown';

export class Prop extends Sprite {
    public dialogue?: Dialogue;
    public playerNearby: boolean = false;

    public interactMode: InteractMode;

    constructor(
        x: number,
        y: number,
        private state: PlayState,
    ) {
        super(x, y);
        // this.dialogue = this.state.ui.add(
        //     new Dialogue([
        //         'yes this is an innanimate object!',
        //         'and my purpose here is to test this piece of shit you call software',
        //         'this code sucks so ass omg i cant believe you call yourself a programmer!',
        //     ]),
        // );
        this.setHitbox(0, 0, 20, 20);
    }

    showDialogue() {
        // switch (this.interactMode) {
        //     case 'dialogue':
        // this.dialogue!.show();
        //         break;
        //     case 'hide':
        //         this.dialogue!.show();
        //         break;
        // }
    }

    public override update(dt: number): void {
        super.update(dt);
    }

    public override render(): void {
        super.render();
        if (this.playerNearby) {
            setColor(1, 0, 0);
            circle('fill', this.position.x, this.position.y - this.height, 4);
            setColor(1, 1, 1);
        }
        rectangle('fill', this.position.x, this.position.y, this.width, this.height);
    }
}
