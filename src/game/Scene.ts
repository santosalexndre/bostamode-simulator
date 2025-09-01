import { circle, draw, Image, newImage, pop, push, rectangle } from 'love.graphics';
import { Group } from '../bliss/group/Group';
import { main } from '../bliss/Main';
import { Images } from '../bliss/util/Resources';
import { decode } from '../libraries/json/json';
import { Source } from 'love.audio';
import { Dialogue } from './Dialogue';
import { DialogueEntry, IScene, SceneData } from './dialoguetypes';
import { Sprite } from '../bliss/Sprite';
import { UiElement } from '../bliss/ui/UiElement';
import { input } from '../bliss/Input';
import { Spring } from '../bliss/effects/Spring';
import { Signal } from '../bliss/util/Signal';
import * as Timer from '../libraries/timer';
import { handleEffects } from './util';
import { ClickableObject } from './ui/ClickableObject';
import { MusicManager } from './MusicManager';

export class SceneObject extends UiElement {
    sprite: Image;
    public sx: number = 1;
    public sy: number = 1;
    public spring: Spring = new Spring();

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;

        this.onHover.connect(() => {
            this.timer.tween(0.3, this, { sx: 1.1, sy: 1.1 }, 'out-cubic');
            this.spring.pull(5);
        });

        this.onLeave.connect(() => {
            this.timer.tween(0.3, this, { sx: 1.0, sy: 1.0 }, 'out-cubic');
        });
    }

    override update(dt: number): void {
        super.update(dt);
        this.timer.update(dt);
        this.spring.update(dt);
        const width = this.right - this.left;
        const height = this.bottom - this.top;

        if (this.overlaps(main.mouse.x + width / 2, main.mouse.y + height / 2, 2, 2)) {
            if (!this.hovered) {
                this.onHover.emit();
            }
            if (input.pressed('fire1')) {
                this.onClick.emit();
            }
            if (input.released('fire1')) {
                this.onClickReleased.emit();
            }
            this.hovered = true;
        } else {
            if (this.hovered) {
                this.onLeave.emit();
                this.hovered = false;
            }
        }
    }

    override render(): void {
        super.render();
        const width = this.right - this.left;
        const height = this.bottom - this.top;

        // rectangle('line', this.left - width / 2, this.top - height / 2, this.right - this.left, this.bottom - this.top);
        circle('fill', this.x, this.y, 2);
        love.graphics.draw(this.sprite, this.x, this.y, 0, this.sx + this.spring.value, this.sy + this.spring.value, width / 2, height / 2);
    }
}

export class Scene extends Group implements IScene {
    background: Image;
    data: SceneData;

    switchRequest: Signal<string> = new Signal();

    currentDialogue?: Dialogue;
    dialogues: Record<string, DialogueEntry> = new LuaTable() as any;

    timer: Timer = Timer();

    ui: Group = new Group();

    constructor(path: string) {
        super();

        const [file, _] = love.filesystem.read(`assets/data/scenes/${path}.json`);
        print(file, _);
        const data = decode(file!) as SceneData;

        if (data.music !== undefined) MusicManager.playMusic(data.music);

        this.background = Images.get(data.background);

        if (data.start.length > 0) {
            this.addDialogue(data.start);
        }

        if (data.objects) {
            for (const obj of data.objects) {
                const instance = new ClickableObject(obj.sprite, obj.position[0], obj.position[1]);

                instance.type = obj.id.startsWith('npc') ? 'npc' : 'object';
                // instance.left = instance.x + obj.hitbox[0];
                // instance.top = instance.y + obj.hitbox[1];
                // instance.right = instance.x + obj.hitbox[2];
                // instance.bottom = instance.y + obj.hitbox[3];
                instance.onButtonReleased.connect(() => {
                    if (instance.type == 'npc') {
                        instance.visible = false;
                        instance.active = false;
                    }
                    const diag = this.addDialogue(obj.dialogue);
                    diag?.dialogueClosed.connect(() => {
                        instance.visible = true;
                        instance.active = true;
                    });
                });
                this.add(instance);
            }
        }

        handleEffects(data.effects, this.timer);
    }

    addDialogue(data: DialogueEntry[]): Dialogue | undefined {
        if (this.currentDialogue === undefined || this.currentDialogue.dead) {
            this.currentDialogue = this.ui.add(new Dialogue(data));
            this.currentDialogue.dialogueSwitch.connect(s => {
                this.switchRequest.emit(s);
            });
            this.currentDialogue.start();
            return this.currentDialogue;
        }
    }

    public override update(dt: number): void {
        super.update(dt);
        this.timer.update(dt);
        this.ui.update(dt);
    }

    public override render(): void {
        const scale = main.camera.viewport.getScreenScale();
        const [w, h] = this.background.getDimensions();
        const sw = w / main.width;
        const sh = h / main.height;

        draw(this.background, 0, 0, 0, 1 / sw, 1 / sh);
        super.render();
        push();
        // main.camera.detach();
        this.ui.render();
        pop();
    }
}
