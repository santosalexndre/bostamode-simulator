import { draw, Image, pop, push, rectangle, rotate, setColor, translate } from 'love.graphics';
import { Color } from './util/Color';
import { Images } from './util/Resources';
import { Entity } from './Entity';
import { AnimationController } from './animation/AnimationController';

// TODO: Major refactor T_T
export class Sprite extends Entity {
    /**
     * X offset for drawing
     */
    public offsetX: number = 0;

    /**
     * Y offset for drawing
     */
    public offsetY: number = 0;

    /**
     * controls the horizontal scale of the sprite
     */
    public flipX: number = 1;

    /**
     * controls the vertical scale of the sprite
     */
    public flipY: number = 1;

    /**
     * The animation controller
     */
    public animation: AnimationController;

    public tint: Color = Color.WHITE;

    private _currentTexture: Image;
    private _graphicColor?: Color;

    constructor(x?: number, y?: number, defaultGraphic?: string) {
        super(x, y);
        this.animation = new AnimationController();
        this.animation.animationChanged.connect(() => {
            this._currentTexture = this.animation._texture;
            const [w, h] = this.animation._current.frameSrc.getDimensions();
            this.updateAnchor(w, h);
        });
        if (defaultGraphic) {
            this.loadGraphic(defaultGraphic);
        }
    }

    /**
     * Loads a static image to the sprite
     * @param path the path to the image file
     */
    public loadGraphic(path: string): void {
        this._currentTexture = Images.get(path);
        this.updateAnchor(this._currentTexture.getWidth(), this._currentTexture.getHeight());
    }

    /**
     * Sets the anchor value of the sprite, in percentage. ie. a value of 0.5 will center the sprite
     * @param x the percentage in which the sprite should be anchored horizontally
     * @param y the percentage in which the sprite should be anchored vertically
     */
    public override anchor(x: number, y: number): void {
        super.anchor(x, y);
        this.updateAnchor(this._currentTexture?.getWidth() || 0, this._currentTexture?.getHeight() || 0);
    }

    private updateAnchor(w: number, h: number): void {
        this['_anchorOffsetX'] = this['_anchorX'] * w;
        this['_anchorOffsetY'] = this['_anchorY'] * h;
        this['_hitboxOffsetX'] = -this['_anchorOffsetX'];
        this['_hitboxOffsetY'] = -this['_anchorOffsetY'];
    }

    public override update(dt: number): void {
        super.update(dt);
        this.animation.update(dt);
    }

    public override render(): void {
        super.render();
        const deg2rad = Math.PI / 180;
        setColor(this.tint);
        const offx = this['_anchorOffsetX'];
        const offy = this['_anchorOffsetY'];
        if (this.animation.playing) {
            draw(
                this._currentTexture,
                this.animation._currentQuad,
                this.position.x,
                this.position.y,
                this.rotation * deg2rad,
                this.scale.x * this.flipX,
                this.scale.y * this.flipY,
                this.offsetX + offx,
                this.offsetY + offy,
            );
        } else if (this._graphicColor) {
            this._graphicColor.apply();
            push();
            translate(this.position.x - this.offsetX + offx, this.position.y - this.offsetY + offy);
            rotate(this.rotation * deg2rad);
            rectangle('fill', this.position.x - this.offsetX + offx, this.position.y - this.offsetY + offy, this.width, this.height);
            pop();
            setColor(1, 1, 1);
        } else if (this._currentTexture !== undefined) {
            draw(
                this._currentTexture,
                this.position.x,
                this.position.y,
                this.rotation * deg2rad,
                this.scale.x * this.flipX,
                this.scale.y * this.flipY,
                this.offsetX + offx,
                this.offsetY + offy,
            );
        }
    }

    public makeGraphic(w: number, h: number, color: Color): void {
        this._graphicColor = color;
        this.width = w;
        this.height = h;
    }

    public override destroy(): void {
        super.destroy();
        this.timer.clear();
    }
}
