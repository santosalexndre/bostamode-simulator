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

export class btn extends Button {
    public bgWidth = 200;
    public bgHeight = 20;

    handle1: TimerHandle;
    handle2: any;
    constructor(text?: string, onClick?: () => void) {
        super(text, onClick);
        this.label.position = vec(this.x, this.y);
        this.label.anchor(0.5, 0.5);
        this.onHover.connect(() => {
            print('entrei?');
            if (!this.handle1) {
                this.handle1 = this.timer.tween(0.1, this, { bgHeight: 20, bgWidth: 500 }, 'out-cubic');
            } else if (this.handle1.count > 0) {
            } else {
                this.handle1 = this.timer.tween(0.1, this, { bgHeight: 20, bgWidth: 500 }, 'out-cubic');
            }
        });
        this.onLeave.connect(() => {
            if (!this.handle2) {
                this.handle2 = this.timer.tween(0.1, this, { bgHeight: 0, bgWidth: 500 }, 'out-cubic');
            } else if (this.handle2.count > 0) {
            } else {
                this.handle2 = this.timer.tween(0.1, this, { bgHeight: 0, bgWidth: 500 }, 'out-cubic');
            }
        });
    }

    public override update(dt: number): void {
        super.update(dt);
    }

    override render(): void {
        this.label.render();
        setColor(this.backgroundColor);
        rectangle('fill', this.x - this.bgWidth / 2, this.y - this.bgHeight / 2, this.bgWidth, this.bgHeight);
        setColor(1, 1, 1);
    }
}

export class MenuState extends State {
    private camera: Camera = new Camera(main.width, main.height);
    public main: Group = new Group();

    public override enter(): void {
        const label = new Label('- B0ST4 -', OutlineMode.DropShadow);
        label.anchor(0.5, 0.5);
        label.setColor(new Color('#cf9b9bff'), new Color('#520303ff'));
        label.position = vec(main.width / 2, 90);
        this.main.add(label);

        for (let y = 0; y < 4; y++) {
            const button = new btn('AAAAAAAAAAAAAAAAAAA', () => main.switchState(PlayState));
            button.anchor(0.5, 0.5);
            button.label.anchor(0.5, 0.5);
            button.setSize(100, 10);
            button.backgroundColor = Color.fromHex('#d1c0c018');
            button.setPosition(main.width / 2, main.height / 2 + y * 25);
            button.label.position = vec(button.x, button.y);
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
        this.camera.viewport.renderTo(() => {
            this.camera.attach();
            this.main.render();

            // love.graphics.print(`JOGO ${love.timer.getFPS()}`, main.width / 2, main.height / 2 + 30);
            this.camera.detach();
        });
    }
}
