import { Emitter } from '../bliss/effects/Emitter';
import { input } from '../bliss/Input';
import { ICollision } from '../bliss/interfaces';
import { main } from '../bliss/Main';
import { Sprite } from '../bliss/Sprite';
import { trace } from '../libraries/inspect';
import { clamp, deg2rad, lerp_angle } from '../libraries/mathx';
import { PlayState } from './PlayState';
import { Prop } from './Prop';

export class Player extends Sprite {
    constructor(
        x: number,
        y: number,
        private state: PlayState,
    ) {
        super(x, y);

        this.setHitbox(0, 0, 64, 70);

        // this.loadGraphic('images/player.png');
        this.animation.setPath('girl/');
        this.animation.play('idle');
    }

    moving = false;
    rot = 0;
    closestProp?: Prop;
    inDialogue = false;
    override update(dt: number): void {
        super.update(dt);

        if (this.state.props.count() > 0) {
            let closest: Prop = this.state.props['members'][0];
            let cdist = closest.position.dist2(this.position);

            for (const prop of this.state.props['members']) {
                const dist = prop.position.dist2(this.position);
                if (dist < 16 * 16) {
                    if (dist < cdist) {
                        closest = prop;
                        cdist = dist;
                    }
                }

                prop.playerNearby = false;
            }
            if (cdist < 16 * 16) {
                this.closestProp = closest;
                this.closestProp.playerNearby = true;
            }
        }

        if (this.closestProp !== undefined) {
            if (input.pressed('interact')) {
                if (this.hiding) {
                    this.unhide();
                } else if (this.closestProp.interactMode == 'dialogue') {
                    this.closestProp.showDialogue();
                    // this.closestProp.dialogue?.onClose.connect(() => (this.inDialogue = false));
                    this.velocity.x = 0;
                    this.inDialogue = true;
                } else if (this.closestProp.interactMode == 'hide') {
                    this.hide();
                }
            }
        }

        this.handleMovement(dt);

        this.closestProp = undefined;
    }

    hiding = false;
    hide() {
        this.animation.play('hide');
        this.position = this.closestProp!.position.clone();
        this.velocity.x = 0;
        this.hiding = true;
    }
    unhide() {
        this.animation.play('idle');
        this.hiding = false;
    }

    public handleMovement(dt: number) {
        if (this.hiding || this.inDialogue) return;
        let dx = 0,
            dy = 0;

        if (input.down('left')) dx -= 1;
        if (input.down('right')) dx += 1;
        if (input.down('down')) dy += 1;
        if (input.down('up')) dy -= 1;

        this.velocity.x = dx * 60;
    }
    public override render(): void {
        super.render();
    }

    protected override onCollision(col: ICollision): void {
        // this.destroy();
    }
}
