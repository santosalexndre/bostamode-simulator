import { getFont, rectangle, setColor } from 'love.graphics';
import { Camera } from '../bliss/Camera';
import { Group } from '../bliss/group/Group';
import { main } from '../bliss/Main';
import { State } from '../bliss/State';
import { Label, OutlineMode } from '../bliss/ui/Label';
import vec from '../libraries/nvec';
import { trace } from '../libraries/inspect';
import { Color } from '../bliss/util/Color';
import { Button } from '../bliss/ui/Button';
import { PlayState } from './PlayState';
import { TimerHandle } from '../bliss/interfaces';
import { WorldMap } from './WorldMap';

export class MenuState extends State {
    private camera: Camera = new Camera(main.width, main.height);
    public main: Group = new Group();

    public override enter(): void {
        const label = new Label('- BOYMODER CHRONICLES -', OutlineMode.DropShadow);
        label.anchor(0.5, 0.5);
        label.setColor(new Color('#cf9b9bff'), new Color('#520303ff'));
        label.position = vec(main.width / 2, 90);
        this.main.add(label);

        for (let y = 0; y < 1; y++) {
            const button = new Button('play', () => main.switchState(WorldMap));
            button.anchor(0.5, 0.5);
            button.label.anchor(0.5, 0.5);
            button.setSize(100, 10);
            button.backgroundColor = Color.fromHex('#d1c0c018');
            button.setPosition(main.width / 2 - button.width / 2, main.height / 2 + y * 25 - button.height / 2);
            button.onHover.connect(() => {
                button.backgroundColor = Color.fromHex('#000000');
            });
            button.onLeave.connect(() => {
                button.backgroundColor = Color.fromHex('#d1c0c018');
            });
            button.setHitbox(0, 0, button.width, button.height);

            this.main.add(button);
        }
        // label.setText('cu bosta buceta pau pinto xerec');
    }

    public override update(dt: number): void {
        super.update(dt);
        this.main.update(dt);
        // this.camera.x = (main.mouse.x - main.width / 2) * 0.1 + main.width / 2;
        // this.camera.y = (main.mouse.y - main.height / 2) * 0.1 + main.height / 2;
        this.camera.update(dt);
    }

    public override render(): void {
        super.render();
        main.camera.viewport.renderTo(() => {
            main.camera.attach();
            this.main.render();

            // love.graphics.print(`JOGO ${love.timer.getFPS()}`, main.width / 2, main.height / 2 + 30);
            main.camera.detach();
        });
    }
}
