import { circle, draw, Image, newImage, pop, push, rectangle, Shader } from 'love.graphics';
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
import { globalState } from './global';
import { DialogueManager } from './dialogue/DialogueManager';

export class Scene extends Group implements IScene {
    background: Image;
    data: SceneData;

    switchRequest: Signal<string> = new Signal();

    currentDialogue?: Dialogue;
    dialogues: Record<string, DialogueEntry> = new LuaTable() as any;

    timer: Timer = Timer();

    dialogueGroup: Group<Dialogue> = new Group();
    objects: Group<ClickableObject> = new Group();

    playerInDialogue: boolean = false;

    whiteShader: Shader = love.graphics.newShader('assets/shaders/flash.frag');

    manager: DialogueManager;

    constructor(path: string) {
        super();

        const [file, _] = love.filesystem.read(`assets/data/scenes/${path}.json`);
        print(file, _);
        const data = decode(file!) as SceneData;

        if (data.music !== undefined) MusicManager.playMusic(data.music);

        this.background = Images.get(data.background);

        this.manager = new DialogueManager();

        this.manager.dialogueStarted.connect(() => {
            this.deactivateObjects();
        });
        this.manager.dialogueEnded.connect(() => {
            this.activateObjects();
        });

        this.manager.switchScene.connect(s => {
            this.switchRequest.emit(s);
        });

        if (data.objects) {
            for (const obj of data.objects) {
                const instance = new ClickableObject(obj.sprite, obj.position[0], obj.position[1]);
                instance.x += instance.w / 2;
                instance.y += instance.h / 2;

                instance.type = obj.id.startsWith('npc') ? 'npc' : 'object';
                instance.onButtonReleased.connect(() => {
                    if (!instance['activated']) return;

                    if (instance.type == 'npc') {
                        instance.visible = false;
                    }

                    if (obj.dialogue) this.manager.loadScript(obj.dialogue);

                    this.manager.dialogueEnded.connect(() => {
                        if (instance.type == 'npc') instance.visible = true;
                    });
                });
                this.objects.add(instance);
            }
        }

        if (data.start) this.manager.loadScript(data.start);
        // if (data.start.length > 0) {
        //     this.addDialogue(data.start);
        // }
        handleEffects(data.effects, this.timer);
    }

    // addDialogue(data: DialogueEntry[]): Dialogue | undefined {
    // if (this.currentDialogue === undefined || this.currentDialogue.dead) {
    //     globalState.set('State: playerInDialogue', true);
    //     this.currentDialogue = this.dialogueGroup.add(new Dialogue(data));
    //     this.currentDialogue.dialogueSwitch.connect(s => {
    //         this.switchRequest.emit(s);
    //     });
    //     this.currentDialogue.start();
    //     this.currentDialogue.dialogueClosed.connect(() => {
    //     });
    //     return this.currentDialogue;
    // }
    // }

    deactivateObjects() {
        this.objects.forEach(m => (m.active = false));
        this.objects.forEach(m => m.deactivate());
    }

    activateObjects() {
        this.objects.forEach(m => m.activate());
        this.objects.forEach(m => (m.active = true));
    }

    public override update(dt: number): void {
        super.update(dt);
        this.timer.update(dt);
        this.objects.update(dt);
        love.graphics.setShader();
        this.manager.update(dt);

        this.dialogueGroup.update(dt);
    }

    public override render(): void {
        const scale = main.camera.viewport.getScreenScale();
        const [w, h] = this.background.getDimensions();
        const sw = w / main.width;
        const sh = h / main.height;
        push();

        draw(this.background, 0, 0, 0, 1 / sw, 1 / sh);
        super.render();
        this.objects.render();
        this.manager.render();
        // main.camera.detach();
        this.dialogueGroup.render();
        pop();
    }
}
