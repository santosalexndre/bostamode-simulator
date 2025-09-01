import { Group } from '../bliss/group/Group';
import { main } from '../bliss/Main';
import { State } from '../bliss/State';
import { Player } from './Player';
import { Dialogue } from './Dialogue';
import { Prop } from './Prop';
import { input } from '../bliss/Input';
import { Npc } from './Npc';
import { StealthMeme } from './StealthMeme';
import { Scene } from './Scene';
import { SceneManager } from './SceneManager';

export class PlayState extends State {
    public main: Group = new Group();
    public ui: Group = new Group();
    public particles: Group = new Group();
    public props: Group<Prop> = new Group();
    public currentScene?: Scene;

    public override enter(): void {
        // this.currentScene = new Scene('assets/data/scenes/bedroom1.json');
        // this.currentScene.switchRequest.connect(newScene => {
        //     this.currentScene = new Scene(`assets/data/scenes/${newScene}.json`);
        // });
    }

    public override update(dt: number): void {
        this.main.update(dt);
        SceneManager.currentScene?.update(dt);
    }

    public override render(): void {
        super.render();

        main.camera.viewport.renderTo(() => {
            main.camera.attach();

            this.main.render();
            SceneManager.currentScene?.render();
            this.particles.render();
            this.props.render();

            main.camera.detach();
            this.ui.render();
        });
    }
}
