import { setShader, Shader } from 'love.graphics';
import { main } from '../../bliss/Main';
import { Color } from '../../bliss/util/Color';
import { Images } from '../../bliss/util/Resources';
import { PlayState } from '../PlayState';
import { SceneManager } from '../SceneManager';
import { ClickableSprite } from './ClickableSprite';

export class ClickableObject extends ClickableSprite {
    public sxx: number = 1;
    public syy: number = 1;

    public type: 'npc' | 'object';

    public tint: Color = Color.fromHex('#ffffff');
    public whiteFactor: number = 0;
    public shader: Shader = love.graphics.newShader('assets/shaders/flash.frag');

    private activated: boolean = true;

    public deactivate() {
        this.activated = false;
    }

    public activate() {
        if (!this.overlaps(main.mouse.x, main.mouse.y, 3, 3)) {
            this.activated = true;
        }
    }

    constructor(spritePath: string, x: number, y: number) {
        super(Images.get(spritePath), x, y);

        this.onMouseEnter.connect(() => {
            if (this.activated) this.whiteFactor = 0.7;
        });
        this.onMouseLeave.connect(() => {
            if (!this.activated) {
                this.activated = true;
            }
            this.whiteFactor = 0;
        });
    }

    override update(dt: number): void {
        super.update(dt);
        this.sx = this.sxx + this.spring.value;
        this.sy = this.syy + this.spring.value;
    }

    override render(): void {
        setShader(this.shader);
        this.shader.send('WhiteFactor', this.activated ? this.whiteFactor : 0);
        this.shader.send('texture_size', [this.w, this.h]);
        super.render();
        setShader();
        love.graphics.print(tostring(this.activated), this.x, this.y - 60);
    }
}
