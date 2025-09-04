import { draw, Image } from 'love.graphics';
import { Group } from '../bliss/group/Group';
import { main } from '../bliss/Main';
import { State } from '../bliss/State';
import { Button } from '../bliss/ui/Button';
import { Spring } from '../bliss/effects/Spring';
import { ClickableObject } from './ui/ClickableObject';
import { SceneManager } from './SceneManager';
import { PlayState } from './PlayState';

export class WorldMap extends State {
    main: Group = new Group();

    constructor() {
        super();
    }

    public override enter() {
        super.enter();

        const location = new ClickableObject('assets/images/dress.png', 100, 100);
        location.onButtonReleased.connect(() => {
            main.switchState(PlayState);
            SceneManager.switchScene('bedroom1');
        });
        this.main.add(location);
    }

    public override update(dt: number): void {
        super.update(dt);
        this.main.update(dt);
    }
    public override render(): void {
        super.render();
        main.camera.viewport.renderTo(() => {
            main.camera.attach();
            this.main.render();
            main.camera.detach();
        });
    }
}
