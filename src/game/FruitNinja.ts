import { Entity } from '../bliss/Entity';
import { Group } from '../bliss/group/Group';
import { main } from '../bliss/Main';
import { Sprite } from '../bliss/Sprite';
import { State } from '../bliss/State';

export class Cloth extends Sprite {
    public type: string;

    angularVelocity = 0;

    constructor(x: number, y: number, type: 'girl' | 'boy') {
        super(x, y);

        this.angularVelocity = love.math.random() * 180 + 180;
        this.type = type;

        if (type == 'girl') {
            this.loadGraphic('images/dress.png');
        } else {
            this.loadGraphic('images/suit.png');
        }
    }

    public override update(dt: number): void {
        super.update(dt);
        this.rotation += dt * this.angularVelocity;

        this.velocity.y += 98 * dt;
    }
}

export class FruitNinja extends State {
    main: Group = new Group();
    constructor() {
        super();

        this.timer.script(wait => {
            for (;;) {
                const rand = love.math.random(1, 2);
                const c = new Cloth(love.math.random() * (main.width + 400) - 200, main.height, rand == 1 ? 'girl' : 'boy');

                c.velocity.x = love.math.random(-150, 150);
                c.velocity.y = love.math.random(-300, -100);

                this.main.add(c);
                wait(love.math.random() * 1 + 0.2);
            }
        });
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
