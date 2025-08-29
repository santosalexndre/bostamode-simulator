import { Group } from '../bliss/group/Group';
import { main } from '../bliss/Main';
import { State } from '../bliss/State';
import { Player } from './Player';
import { Dialogue } from './Dialogue';

export class PlayState extends State {
    private main: Group = new Group();
    private particles: Group = new Group();

    public override enter(): void {
        const p = new Player(100, 200);
        p.position.y = main.height - p.height;
        // p.timer.every(0.5, () => {
        //     this.particles.add(new Emitter(p.position.x, p.position.y));
        // });
        this.main.add(p);

        this.main.add(new Dialogue());
    }

    public override update(dt: number): void {
        super.update(dt);
        this.main.update(dt);
        this.particles.update(dt);
    }

    public override render(): void {
        super.render();

        main.camera.viewport.renderTo(() => {
            main.camera.attach();

            this.main.render();
            this.particles.render();

            main.camera.detach();
        });
    }
}
