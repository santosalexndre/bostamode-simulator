import { setColor, setLineWidth } from 'love.graphics';
import { Basic } from '../bliss/Basic';
import { SimpleDebugger } from '../bliss/debug/Debugger';
import { Emitter } from '../bliss/effects/Emitter';
import { Entity } from '../bliss/Entity';
import { Group } from '../bliss/group/Group';
import { input } from '../bliss/Input';
import { main } from '../bliss/Main';
import { State } from '../bliss/State';
import { TileLayer } from '../bliss/tilemap/Tilemap';
import { SpriteSheets } from '../bliss/util/Resources';
import { Bullet } from './Bullet';
import { Player } from './Player';

export class Dialogue extends Entity {
    private fullDialogue: string[] = ['This time im really gonna do it.', 'im going to girlmode for real', 'nothing is gonna stop me this time'];
    public currentText: string = '';
    public dialogueidx: number = 0;
    constructor() {
        super(0, 0);
        this.nextDialogue();
    }

    nextDialogue() {
        let idx = 0;
        this.timer.every(0.05, () => {
            this.currentText = this.fullDialogue[this.dialogueidx].slice(0, idx);
            idx++;
            if (idx > this.fullDialogue[this.dialogueidx].length) return false;
        });
    }
    override update(dt: number): void {
        super.update(dt);
        if (input.pressed('fire2') && this.dialogueidx < this.fullDialogue.length - 1) {
            this.nextDialogue();
            this.dialogueidx++;
        }
    }

    override render(): void {
        setColor(0, 0, 0);
        love.graphics.rectangle('fill', 0, 0, main.width, 100);
        setLineWidth(2);
        setColor(1, 1, 1);
        love.graphics.rectangle('line', 0, 0, main.width, 100);

        love.graphics.print(this.currentText, 10, 10);
    }
}

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
        // this.particles.blendMode = 'add';
        // SimpleDebugger.register(p, 'tint');
        // SimpleDebugger.register(p, 'position');
        // SimpleDebugger.register(p, 'scale');

        this.main.add(new Dialogue());
    }

    public override update(dt: number): void {
        super.update(dt);
        this.main.update(dt);
        this.particles.update(dt);

        // if (input.down('fire1')) {
        //     const emitter = new Emitter(main.mouse.x, main.mouse.y);
        //     this.main.add(emitter);

        //     for (let i = 0; i < 1; i++) {
        //         const p = new Bullet(main.mouse.x, main.mouse.y);
        //         // p.velocity = vec.randomDirection(50, 100);
        //         p.rotation = love.math.random() * 360;
        //         this.main.add(p);
        //     }
        // }

        // if (input.down('left')) main.camera.move(-1000 * dt, 0);
        // if (input.down('right')) main.camera.move(1000 * dt, 0);
        // if (input.down('up')) main.camera.move(0, -1000 * dt);
        // if (input.down('down')) main.camera.move(0, 1000 * dt);
    }

    public override render(): void {
        super.render();

        main.camera.viewport.renderTo(() => {
            main.camera.attach();

            this.main.render();
            this.particles.render();

            main.camera.detach();
        });

        // SimpleDebugger.render(10, 50);
        // love.graphics.print(`FPS: ${love.timer.getFPS()} \nEntities: ${this.main.count()}`, 10, 10);
    }
}
