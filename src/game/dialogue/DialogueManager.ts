import { Basic } from '../../bliss/Basic';
import { input } from '../../bliss/Input';
import { Sprite } from '../../bliss/Sprite';
import { evaluateCondition, parseDialogue } from './DialogueParser';
import { DialogueEffect, DialogueEntry, DialogueScript } from './Interfaces';
import { globalState } from '../global';
import { DialogueBox } from './DialogueBox';
import { OptionButton } from '../ui/OptionButton';
import { main } from '../../bliss/Main';
import { draw, origin, points, pop, push, scale, translate } from 'love.graphics';
import { capitalize, getSprite, spriteMap } from '../theme/theme';
import vec from '../../libraries/nvec';
import * as Timer from '../../libraries/timer';
import { Color } from '../../bliss/util/Color';
import { Signal } from '../../bliss/util/Signal';

export class DialogueManager extends Basic {
    fullScript: DialogueScript;
    currentId: string = 'default';
    currentEntry: DialogueEntry;
    currentLine: number = 0;
    stack: { id: string; line: number }[] = [];

    buttons: OptionButton[] = [];

    dialogueBox?: DialogueBox;
    speakerLeft?: string;
    speakerRight?: string;
    speakerLeftSpr?: Sprite;
    speakerRightSpr?: Sprite;
    answeringQuestion: boolean;
    finishedScript: boolean = false;
    currentSpeaker: string | undefined;

    switchScene: Signal<string> = new Signal();

    timer: Timer = Timer();

    constructor() {
        super();
    }

    loadScript(filename: string) {
        this.finishedScript = false;
        this.fullScript = parseDialogue(`assets/data/dialogues/${filename}`);
        this.nextEntry();

        const y = this.dialogueBox!.y;
        this.dialogueBox!.y = main.height;
        if (!this.finishedScript) this.timer.tween(0.5, this.dialogueBox, { y: y }, 'out-cubic');
    }

    private applyEffects(effects?: DialogueEffect[]) {
        if (!effects) return;

        for (const eff of effects) {
            switch (eff.name) {
                case 'set': {
                    // Example: "confidence -= 1"
                    const [varName, op, valueStr] = string.match(eff.args, '(%w+)%s*([%+%-=]+)%s*("?%w+"?)');
                    const value = tonumber(valueStr);

                    if (op === '-=') {
                        if (value === undefined) error('Invalid operator for ' + value);
                        globalState.set(varName, (globalState.get(varName) ?? 0) - value);
                    } else if (op === '+=') {
                        if (value === undefined) error('Invalid operator for ' + value);
                        globalState.set(varName, (globalState.get(varName) ?? 0) + value);
                    } else if (op === '=') {
                        if (valueStr === 'true') {
                            globalState.set(varName, true);
                        } else if (valueStr === 'false') {
                            globalState.set(varName, false);
                        } else if (value === undefined) {
                            globalState.set(varName, valueStr);
                        } else {
                            globalState.set(varName, value);
                        }
                    }

                    break;
                }

                case 'shake':
                    // Example: "STRONG y"
                    print(`Shake screen with args: ${eff.args}`);
                    break;
            }
        }
    }

    public playEntry(entry: DialogueEntry) {
        this.dialogueBox?.kill();
        this.dialogueBox = new DialogueBox(this.currentEntry.text!);

        this.dialogueBox.setSpeakerLeft(entry.speakers?.left);
        this.dialogueBox.setSpeakerRight(entry.speakers?.right);
        this.dialogueBox.setCurrentSpeaker(entry.speakers?.current);

        if (entry.speakers?.current == undefined && entry.speakers?.left) {
            this.dialogueBox.currentSpeaker = capitalize(entry.speakers.left);
        }

        if (entry.speakers?.left?.toLowerCase() !== 'you') {
            this.dialogueBox.speakerLeft = undefined;
            if (entry.speakers) this.dialogueBox.setSpeakerRight(entry.speakers!.left!);
        }

        if (entry.speakers === undefined) {
            this.speakerLeft = undefined;
            this.speakerRight = undefined;
            this.dialogueBox.speakerLeft = undefined;
            this.dialogueBox.speakerRight = undefined;
            this.dialogueBox.currentSpeaker = undefined;
        }

        this.setSpeakerLeft(this.dialogueBox.speakerLeft);
        this.setSpeakerRight(this.dialogueBox.speakerRight);

        // this.speakerRight = this.dialogueBox.speakerRight;
        // this.currentSpeaker = this.dialogueBox.currentSpeaker;
        this.setCurrentSpeaker(this.dialogueBox.currentSpeaker);

        // if (this.speakerRight && this.speakerRightSpr == undefined) {
        //     const spr = new Sprite();
        //     spr.loadGraphic(getSprite(this.speakerRight));
        //     spr.anchor(0.5, 1);
        //     spr.scale.x = -1;
        //     spr.position = vec(main.width * (0.75 + 0.17), main.height + 100);
        //     spr.alpha = 0;
        //     spr.timer.tween(0.7, spr.position, { x: main.width * 0.75 }, 'out-cubic');
        //     spr.timer.tween(0.5, spr, { alpha: 1 }, 'linear');
        //     this.speakerRightSpr = spr;
        // } else if (!this.speakerRight && this.speakerRightSpr !== undefined) {
        //     const spr = this.speakerRightSpr;
        //     spr.timer.tween(0.5, spr.position, { x: main.width }, 'out-cubic');
        //     spr.timer.tween(0.2, spr, { alpha: 0 }, 'linear');
        // }

        this.applyEffects(entry.effects);
    }

    public setCurrentSpeaker(s: string | undefined) {
        if (s === this.currentSpeaker) return;
        if (s === this.speakerRight) {
            if (this.speakerLeftSpr !== undefined) this.speakerLeftSpr!.tint = Color.fromHex('#8d8d8dff');
            if (this.speakerLeftSpr) this.animateBack(this.speakerLeftSpr, 1);
            if (this.speakerRightSpr) this.animateBack(this.speakerRightSpr, 1);
            if (this.speakerRightSpr) this.speakerRightSpr.tint = Color.fromHex('#ffffff');
        } else if (s === this.speakerLeft) {
            if (this.speakerRightSpr !== undefined) this.speakerRightSpr!.tint = Color.fromHex('#8d8d8dff');
            if (this.speakerLeftSpr !== undefined) this.speakerLeftSpr!.tint = Color.fromHex('#ffffff');
            if (this.speakerRightSpr) this.animateBack(this.speakerRightSpr, -1);
            if (this.speakerLeftSpr) this.animateBack(this.speakerLeftSpr, -1);
        }
        this.currentSpeaker = s;
    }

    public animateBack(spr: Sprite, dir: number) {
        this.timer.tween(0.3, spr.position, { x: spr.position.x - 30 * dir }, 'out-cubic');
    }

    public setSpeakerRight(s: string | undefined) {
        if (s === undefined) {
            if (this.speakerRightSpr) this.animateClose(this.speakerRightSpr, main.width);
            this.speakerRight = undefined;
            return;
        }
        if (this.speakerRight === s) return;

        this.speakerRight = s;
        const spr = new Sprite();
        spr.loadGraphic(getSprite(s));
        spr.anchor(0.5, 1);
        spr.scale.x = -1;
        spr.position = vec(main.width * 0.8, main.height + 100);
        spr.alpha = 0;
        spr.timer.tween(0.7, spr.position, { x: main.width * 0.75 }, 'out-cubic');
        spr.timer.tween(0.5, spr, { alpha: 1 }, 'linear');
        this.speakerRightSpr = spr;
    }

    public setSpeakerLeft(s: string | undefined) {
        if (s === undefined) {
            if (this.speakerLeftSpr) this.animateClose(this.speakerLeftSpr, 0);
            this.speakerLeft = undefined;
            return;
        }
        if (this.speakerLeft === s) return;

        this.speakerLeft = s;
        const spr = new Sprite();
        spr.loadGraphic(getSprite(s));
        spr.anchor(0.5, 1);
        spr.position = vec(main.width * 0.17, main.height + 100);
        spr.alpha = 0;
        spr.timer.tween(0.7, spr.position, { x: main.width * 0.2 }, 'out-cubic');
        spr.timer.tween(0.5, spr, { alpha: 1 }, 'linear');
        this.speakerLeftSpr = spr;
    }

    public animateClose(spr: Sprite, x: number) {
        spr.timer.tween(0.5, spr.position, { x: x }, 'out-cubic');
        spr.timer.tween(0.2, spr, { alpha: 0 }, 'linear');
    }

    public animateOpen(sprite: Sprite) {}

    public stop() {
        this.finishedScript = true;
        this.closeAnimation();
    }

    public closeAnimation() {
        if (this.speakerRightSpr) {
            this.timer.tween(0.5, this.speakerRightSpr.position, { x: main.width }, 'linear', () => (this.speakerRightSpr = undefined));
            this.timer.tween(0.2, this.speakerRightSpr, { alpha: 0 });
        }
        if (this.speakerLeftSpr) {
            this.timer.tween(0.5, this.speakerLeftSpr.position, { x: 0 }, 'linear', () => (this.speakerLeftSpr = undefined));
            this.timer.tween(0.2, this.speakerLeftSpr, { alpha: 0 });
        }
        this.timer.tween(0.5, this.dialogueBox, { y: main.height + this.dialogueBox!.height + 100, alpha: 0 }, 'out-cubic', () => {
            this.dialogueBox?.kill();
            this.dialogueBox = undefined;
        });
    }

    public nextEntry() {
        if (this.currentId.startsWith('scene')) {
            this.switchScene.emit(string.gsub(this.currentId, 'scene_', '')[0]);
            return;
        }

        const entry = this.fullScript[this.currentId];
        if (!entry) error(`entry with #${this.currentId} not found`);

        if (this.currentLine >= this.fullScript[this.currentId].length) {
            if (this.stack.length > 0) {
                while (this.currentLine >= this.fullScript[this.currentId].length) {
                    if (this.stack.length <= 0) {
                        this.stop();
                        return;
                    }
                    const prev = this.stack.pop();
                    this.currentLine = prev!.line;
                    this.currentId = prev!.id;
                }
            } else {
                this.stop();
                return;
            }
        }

        if (this.currentEntry && this.currentEntry.jumpTo && this.currentEntry.jumpTo.condition) {
            const jump = this.currentEntry.jumpTo;

            const valid = evaluateCondition(this.currentEntry.jumpTo.condition, globalState);
            this.stack.push({ id: this.currentId, line: this.currentLine });

            if (valid) {
                this.currentId = this.currentEntry.jumpTo.true!;
            } else {
                this.currentId = this.currentEntry.jumpTo.default!;
            }

            this.currentLine = 0;
        }

        this.currentEntry = this.fullScript[this.currentId][this.currentLine];
        // this.currentEntry = this.getEntry(this.currentId)[this.currentLine];

        if (this.currentEntry.type === 'pipe') {
            const jump = this.currentEntry.jumpTo;
            if (jump && jump.default) {
                const valid = evaluateCondition(this.currentEntry.conditions, globalState);
                if (valid) {
                    this.stack.push({ id: this.currentId, line: this.currentLine + 1 });
                    this.currentId = jump.default;
                    this.currentLine = 0;
                    this.nextEntry();
                    return;
                }
                this.currentLine++;
                this.nextEntry();
                return;
            }
            if (this.currentEntry.effects) {
                this.applyEffects(this.currentEntry.effects);
                this.currentLine++;
                this.nextEntry();
                return;
            }
        } else if (this.currentEntry.type == 'question') {
            const spacing = 20;
            const buttonHeight = 60; // assuming all have the same height

            // Count valid options (that pass condition)
            const visibleOptions = this.currentEntry.options?.filter(o => !o.conditions || evaluateCondition(o.conditions, globalState)) ?? [];

            const totalHeight = visibleOptions.length * buttonHeight + (visibleOptions.length - 1) * spacing;
            const startY = (main.height - totalHeight) / 2 - buttonHeight * 2; // top Y of the block

            this.answeringQuestion = true;

            this.currentEntry.options?.forEach((o, idx) => {
                const y = startY + idx * (buttonHeight + spacing);
                const btn = new OptionButton(o.text, () => {
                    this.answeringQuestion = false;
                    this.buttons = [];
                    if (o.jumpTo) {
                        this.stack.push({ id: this.currentId, line: this.currentLine + 1 });
                        this.currentId = o.jumpTo.default;
                        this.currentLine = 0;
                        this.nextEntry();
                    } else {
                        this.stop();
                    }
                });

                btn.setPosition(main.width / 2, y);
                this.buttons.push(btn);
            });
            this.playEntry(this.currentEntry);
            return;
        }

        if (this.currentEntry.conditions) print('OI: ', evaluateCondition(this.currentEntry.conditions, globalState));

        if (this.currentEntry.conditions && !evaluateCondition(this.currentEntry.conditions, globalState)) {
            this.currentLine++;
            this.nextEntry();
            return;
        }

        this.playEntry(this.currentEntry);
        this.currentLine++;
    }

    public getEntry(id: string) {
        const entry = this.fullScript[id];
        if (!entry) error(`Dialogue #${id} not found`);

        return entry;
    }

    override update(dt: number): void {
        super.update(dt);
        this.timer.update(dt);

        if (input.pressed('fire1') && this.dialogueBox !== undefined) {
            if (!this.dialogueBox.hasFinished()) {
                this.dialogueBox.skip();
            } else if (!this.answeringQuestion) {
                this.nextEntry();
            }
        }
        if (this.speakerRightSpr !== undefined) {
            this.speakerRightSpr.update(dt);
        }
        if (this.speakerLeftSpr !== undefined) {
            this.speakerLeftSpr.update(dt);
        }

        this.buttons.forEach(b => b.update(dt));
        this.dialogueBox?.update(dt);
    }

    override render(): void {
        super.render();

        push();
        origin();
        const [dx, dy] = main.camera.viewport.getScreenOffset();
        translate(dx, dy);
        scale(main.camera.viewport.getScreenScale());

        if (this.speakerRightSpr !== undefined) {
            this.speakerRightSpr.render();
        }

        if (this.speakerLeftSpr !== undefined) {
            this.speakerLeftSpr.render();
        }

        this.buttons.forEach(b => b.render());
        this.dialogueBox?.render();
        pop();
    }
}
