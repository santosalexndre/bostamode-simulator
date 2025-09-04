import { Basic } from '../../bliss/Basic';
import { input } from '../../bliss/Input';
import { Sprite } from '../../bliss/Sprite';
import { evaluateCondition, parseDialogue } from './DialogueParser';
import { DialogueEffect, DialogueEntry, DialogueScript } from './Interfaces';
import { globalState } from '../global';
import { DialogueBox } from './DialogueBox';
import { OptionButton } from '../ui/OptionButton';
import { main } from '../../bliss/Main';
import { origin, pop, push, scale, translate } from 'love.graphics';
import { trace } from '../../libraries/inspect';

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
    currentSpeaker: string | undefined;

    constructor() {
        super();
        this.loadScript('assets/data/gameintro.dsl');
    }

    loadScript(filepath: string) {
        this.fullScript = parseDialogue(filepath);
        this.nextEntry();
    }

    private applyEffects(effects?: DialogueEffect[]) {
        if (!effects) return;

        for (const eff of effects) {
            switch (eff.name) {
                case 'set': {
                    // Example: "confidence -= 1"
                    const [varName, op, valueStr] = string.match(eff.args, '(%w+)%s*([%+%-=]+)%s*(%d+)');
                    const value = tonumber(valueStr) ?? 0;

                    if (op === '-=') {
                        globalState.set(varName, (globalState.get(varName) ?? 0) - value);
                    } else if (op === '+=') {
                        globalState.set(varName, (globalState.get(varName) ?? 0) + value);
                    } else if (op === '=') {
                        globalState.set(varName, value);
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

        this.dialogueBox.speakerLeft = entry.speakers?.left;
        this.dialogueBox.speakerRight = entry.speakers?.right;

        // if (this.dialogueBox.speakerLeft == 'you') this.dialogueBox.speakerLeft = '(You)';

        this.dialogueBox.currentSpeaker = entry.speakers?.current;
        if (entry.speakers?.current == undefined && entry.speakers?.left) {
            this.dialogueBox.currentSpeaker = entry.speakers.left;
        }

        if (entry.speakers?.left !== 'you') {
            this.dialogueBox.speakerLeft = undefined;
            this.dialogueBox.speakerRight = entry.speakers?.left;
        }
        // this.dialogueBox.currentSpeaker = '(You)';

        this.speakerLeft = this.dialogueBox.speakerLeft;
        this.speakerRight = this.dialogueBox.speakerLeft;
        this.currentSpeaker = this.dialogueBox.currentSpeaker;

        this.applyEffects(entry.effects);
    }

    public stop() {
        this.dialogueBox?.kill();
        this.dialogueBox = undefined;
    }

    public nextEntry() {
        const entry = this.fullScript[this.currentId];
        if (!entry) error(`entry with #${this.currentId} not found`);

        if (this.currentLine >= this.fullScript[this.currentId].length) {
            if (this.stack.length > 0) {
                const prev = this.stack.pop();
                this.currentLine = prev!.line;
                this.currentId = prev!.id;
                if (this.currentLine >= this.fullScript[this.currentId].length) {
                    this.stop();
                    return;
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
            if (jump) {
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

        if (input.pressed('fire1') && this.dialogueBox !== undefined) {
            if (!this.dialogueBox.hasFinished()) {
                this.dialogueBox.skip();
            } else if (!this.answeringQuestion) {
                this.nextEntry();
            }
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

        this.buttons.forEach(b => b.render());
        this.dialogueBox?.render();
        pop();
    }
}
