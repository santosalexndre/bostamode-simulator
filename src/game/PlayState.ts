import { Group } from '../bliss/group/Group';
import { main } from '../bliss/Main';
import { State } from '../bliss/State';
import { Player } from './Player';
// import { Dialogue } from './Dialogue';
import { Prop } from './Prop';
import { input } from '../bliss/Input';
import { Npc } from './Npc';
import { StealthMeme } from './StealthMeme';
import { Scene } from './Scene';
import { SceneManager } from './SceneManager';
import { PauseMenu } from './states/PauseMenu';

export class PlayState extends State {
    public main: Group = new Group();
    public ui: Group = new Group();
    public particles: Group = new Group();
    public props: Group<Prop> = new Group();
    public currentScene?: Scene;
    public pauseScene?: PauseMenu;
    public paused: boolean = false;

    public override enter(): void {
        // this.currentScene = new Scene('ryan');
        // this.currentScene.switchRequest.connect(newScene => {
        //     this.currentScene = new Scene(`assets/data/scenes/${newScene}.json`);
        // });
    }

    public override update(dt: number): void {
        this.main.update(dt);

        if (this.paused) {
            this.pauseScene!.update(dt);
        } else {
            SceneManager.currentScene?.update(dt);
            if (input.pressed('fire2')) this.pause();
        }
    }

    public pause() {
        this.paused = true;
        this.pauseScene = new PauseMenu();
        this.pauseScene.enter();
        this.pauseScene.onClose.connect(() => {
            this.paused = false;
            this.pauseScene = undefined;
            print('OI');
        });
    }

    public override render(): void {
        super.render();

        main.camera.viewport.renderTo(() => {
            main.camera.attach();

            this.main.render();
            if (this.paused) {
                this.pauseScene!.render();
            } else {
                SceneManager.currentScene?.render();
            }
            this.particles.render();
            this.props.render();

            main.camera.detach();
            this.ui.render();
        });
    }
}
