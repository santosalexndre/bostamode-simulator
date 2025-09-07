// import { circle, draw, Font, Image, line, newImage, origin, pop, push, rectangle, scale, setColor, setLineWidth, translate } from 'love.graphics';
// import { Entity } from '../bliss/Entity';
// import { input } from '../bliss/Input';
// import { main } from '../bliss/Main';
// import { Signal } from '../bliss/util/Signal';
// import { ChoiceOption, DialogueEntry, Line, MultiLine } from './dialoguetypes';
// import { Images } from '../bliss/util/Resources';
// import { globalState } from './global';
// import { Color } from '../bliss/util/Color';
// import { Button } from '../bliss/ui/Button';
// import { btn } from './UiButton';
// import { newSource } from 'love.audio';
// import { handleEffects } from './util';
// import { trace } from '../libraries/inspect';
// import * as Timer from '../libraries/timer';
// import { NineSlice } from './ui/NineSlice';
// import { OptionButton } from './ui/OptionButton';
// import { evaluateCondition } from './dialogue/DialogueParser';

// type BranchChoice = {
//     condition: string;
//     target: string;
// };
// type GameState = { [key: string]: any };

// const parseGoto = (gotoStr: string): BranchChoice[] | null => {
//     const choices: BranchChoice[] = [];
//     if (!gotoStr.includes('->')) return null;

//     const parts = gotoStr.split(';');
//     // split by semicolons
//     for (const part of parts) {
//         const trimmed = part.trim();
//         if (trimmed !== '') {
//             // Lua-compatible pattern:
//             //   (condition) -> (target)
//             //   captures everything before '->' as condition, after as target
//             const match = string.match(trimmed, '^(.-)%s*%-%>%s*(.+)$');

//             if (match) {
//                 choices.push({
//                     condition: match[0].trim(),
//                     target: match[1].trim(),
//                 });
//             }
//         }
//     }

//     return choices;
// };

// // const dialogueSound = newSource('assets/sounds/dialogue.wav', 'static');

// export class Dialogue extends Entity {
//     public fullScript: DialogueEntry[] = [];
//     public currentDialogue: DialogueEntry;
//     public currentLines: string[] = [];
//     public currentSpeaker: string;
//     public speakerRight: string;

//     public spriteLeft: Image;
//     public spriteRight: Image;

//     public dialogueEnded: Signal = new Signal();
//     public dialogueSwitch: Signal<string> = new Signal();
//     public dialogueClosed: Signal = new Signal();
//     public lineEnded: Signal = new Signal();

//     public _lineidx: number = 0;
//     public _dialogueidx: number = 0;
//     public _currentTextEntry: string = '';
//     public _currentText: string;
//     public _font: Font;
//     public _typeidx: number = 0;
//     public _padding: number = 5;
//     public options: ChoiceOption[] = [];

//     // public _backgroundImage: NineSlice = new NineSlice(newImage('assets/images/nineslice.png'), 9, 9, 9, 9);
//     public _backgroundImage: Image = Images.get('assets/images/ui/dialogue-background.png');

//     constructor(script: DialogueEntry[]) {
//         super(0, 0);
//         this.fullScript = script;

//         // this._backgroundImage = Images.get('assets/images/interfacedialogueempty.png');
//         this._font = love.graphics.getFont()!;
//         this._currentText = '';
//         // this.width = this._backgroundImage.getWidth();
//         // this.height = this._backgroundImage.getHeight();
//         this.width = 1440;
//         this.height = this._backgroundImage.getHeight();

//         // this.jumpTo(this.fullScript[0].id);
//     }

//     public skip() {
//         this.timer.clear();
//         this._currentText = this._currentTextEntry;
//         this.lineEnded.emit();
//         this._typeidx = this._currentTextEntry.length;
//     }

//     public buttons: OptionButton[] = [];
//     public answeringQuestion: boolean = false;

//     public loadQuestions() {
//         this.lineEnded.connect(() => (this.answeringQuestion = true));

//         const spacing = 12;
//         const buttonHeight = 60; // assuming all have the same height

//         // Count valid options (that pass condition)
//         const visibleOptions = this.currentDialogue.options?.filter(o => !o.condition || evaluateCondition(o.condition, globalState)) ?? [];

//         const totalHeight = visibleOptions.length * buttonHeight + (visibleOptions.length - 1) * spacing;
//         const startY = (main.height - totalHeight) / 2 - buttonHeight; // top Y of the block

//         visibleOptions.forEach((o, idx) => {
//             const b = new OptionButton(o.text, () => {
//                 this.answeringQuestion = false;
//                 this.buttons = [];
//                 if (o.goto) {
//                     this.jumpTo(o.goto);
//                 } else {
//                     this.closeDialogue();
//                 }
//             });
//             const y = startY + idx * (buttonHeight + spacing);
//             b.setPosition(main.width / 2, y);
//             this.buttons.push(b);
//         });
//         // const length = this.currentDialogue.options?.length;

//         // this.currentDialogue.options?.forEach((o, idx) => {
//         //     const len = this.currentDialogue.options?.length;
//         //     if (o.condition && !evaluateCondition(o.condition, globalState)) return;
//         //     const b = new OptionButton(o.text, () => {
//         //         this.answeringQuestion = false;
//         //         this.buttons = [];
//         //         if (o.goto) {
//         //             this.jumpTo(o.goto);
//         //         } else {
//         //             this.closeDialogue();
//         //         }
//         //     });
//         //     // b.label.anchor(0.5, 0.5);
//         //     b.setPosition(main.width / 2, 100 + idx * (b.h + 10));
//         //     // b.setSize(100, 16);
//         //     // b.setPosition(main.width / 2 - b.width / 2, 20 + idx * 24);
//         //     // b.setHitbox(0, 0, b.width, b.height);
//         //     // b.onHover.connect(() => print('passei a mao'));
//         //     this.buttons.push(b);
//         // });

//         this.currentLines.push(this.currentDialogue.question!);
//     }

//     public prepareNextDialogue(next: DialogueEntry) {
//         this.dialogueEnded.clear();
//         this.lineEnded.clear();

//         this.currentDialogue = next;
//         this.currentSpeaker = next.speaker;

//         if (next.sprite) this.spriteLeft = Images.get(next.sprite);

//         if (next.speakerRight) this.speakerRight = next.speakerRight;
//         if (next.spriteRight) this.spriteRight = Images.get(next.spriteRight);

//         handleEffects(next.effects, this.timer);
//         // if (next.effects) {
//         // for (const effect of next.effects) {
//         //     if (effect.set !== undefined) {
//         //         for (const [key, value] of effect.set) {
//         //             globalState.set(key, value);
//         //         }
//         //     }
//         // }
//         // }
//         if (next.goto) {
//             this.dialogueEnded.connect(() => {
//                 const data = parseGoto(next.goto!);
//                 // const target = data ? evaluateCondition(data, globalState) : next.goto;
//                 // if (target) {
//                 //     this.jumpTo(target);
//                 // } else {
//                 //     this.closeDialogue();
//                 // }
//             });
//         } else {
//             this.dialogueEnded.connect(() => {
//                 const after = this.findAfter(next);
//                 if (after) {
//                     this.jumpTo(after.id);
//                 } else {
//                     this.closeDialogue();
//                 }
//             });
//         }
//     }

//     public findAfter(dialogue: DialogueEntry): DialogueEntry | null {
//         let item: DialogueEntry | null = null;
//         this.fullScript.forEach((d, i) => {
//             if (d.id == dialogue.id) {
//                 if (i + 1 < this.fullScript.length) {
//                     item = this.fullScript[i + 1];
//                 }
//             }
//         });

//         return item || null;
//     }

//     public nextDialogue() {
//         // if type is choice we have a question and choices, each choice have {text, goto, condition}
//         // if type is lines we have content with multiple lines
//         if (this.currentDialogue.type === 'choice') {
//             this.loadQuestions();
//         } else if (this.currentDialogue.type === 'lines') {
//             if (this.currentDialogue.content) {
//                 for (const line of this.currentDialogue.content) {
//                     this.currentLines.push(line);
//                 }
//             }
//         }
//         this._dialogueidx++;
//     }

//     public start() {
//         this.jumpTo(this.fullScript[0].id);
//     }

//     public jumpTo(id: string) {
//         if (id.startsWith('scene')) {
//             this.dialogueSwitch.emit(string.gsub(id, 'scene:', '')[0]);
//             return;
//         } else if (id.startsWith('diag')) {
//             print('e so pular de dialogo agora');
//         } else if (id == 'end-convo') {
//             this.closeDialogue();
//             return;
//         }

//         const diag = this.fullScript.find(d => d.id === id);

//         if (diag === undefined) throw `Dialogue with id: ${id} not found`;

//         if (!diag.content) {
//             if (diag.goto) {
//                 const data = parseGoto(diag.goto!);
//                 // trace(data);
//                 // const target = data ? evaluateConditions(data, globalState) : diag.goto;
//                 // trace(target);

//                 // trace(globalState);
//                 // if (target) {
//                 //     this.jumpTo(target);
//                 // } else {
//                 //     this.closeDialogue();
//                 // }

//                 return;
//             }
//         }

//         // if (diag.type === 'branch') {
//         //     const cond = evaluateCondition(diag.condition!, globalState);
//         //     if (!cond) {
//         //         if(cond.goto) {}
//         //     }
//         // }

//         // this.currentDialogue = diag;
//         this.prepareNextDialogue(diag);
//         this.nextDialogue();
//         this.nextLine();
//     }

//     public closeDialogue() {
//         this.dialogueClosed.emit();
//         this.kill();
//     }

//     public nextLine() {
//         if (this.hasFinishedAllLines()) {
//             this.dialogueEnded.emit();
//             return;
//         }

//         this._currentTextEntry = this.currentLines[this._lineidx];
//         this._currentText = '';
//         this._typeidx = 0;
//         this._lineidx++;
//         this.typewriter();
//     }

//     public typewriter() {
//         this.timer.clear();
//         this.timer.every(0.05, () => {
//             this._currentText += this._currentTextEntry.charAt(this._typeidx);
//             this._typeidx++;
//             if (this._typeidx % 2 == 0) {
//                 dialogueSound.stop();
//                 dialogueSound.play();
//             }
//             if (this._typeidx > this._currentTextEntry.length) {
//                 this.lineEnded.emit();
//                 this.timer.clear();
//             }
//         });
//     }

//     public hasFinishedAllLines() {
//         return this._lineidx >= this.currentLines.length;
//     }

//     public hasFinishedScript(): boolean {
//         return this._dialogueidx >= this.fullScript.length;
//     }
//     public hasFinishedLine(): boolean {
//         return this._typeidx >= this._currentTextEntry.length;
//     }

//     override update(dt: number): void {
//         super.update(dt);

//         if (input.pressed('fire1')) {
//             if (this.hasFinishedLine() && !this.answeringQuestion) {
//                 this.nextLine();
//             } else {
//                 this.skip();
//             }
//         }

//         if (this.answeringQuestion) this.buttons.forEach(b => b.update(dt));
//     }

//     color1 = new Color('#b64b92cb');
//     color2 = new Color('#eddceeff');
//     override render(): void {
//         super.render();

//         const screenPadding = 5;
//         // draw main thing

//         push();
//         origin();
//         scale(main.camera.viewport.getScreenScale());
//         // main.camera.viewport.attach();
//         // translate(math.floor(-this.width / 2), math.floor(-this.height / 2) - screenPadding);
//         // translate(main.width / 2, main.height - this.height / 2);

//         if (this.spriteLeft !== undefined) {
//             draw(this.spriteLeft, 30, screenPadding + this.height - this.spriteLeft.getHeight(), 0, 1.0, 1.0, this.spriteLeft.getWidth() / 2);
//         }

//         if (this.spriteRight !== undefined) {
//             draw(this.spriteRight, this.width - 15, main.height - this.spriteRight.getHeight(), 0, -1.0, 1.0, this.spriteRight.getWidth() / 2);
//         }

//         love.graphics.setFont(this._font);
//         draw(this._backgroundImage, main.width / 2, main.height, 0, 1, 1, this._backgroundImage.getWidth() / 2, this._backgroundImage.getHeight());
//         // this._backgroundImage.render(0, 0, this.width, this.height);

//         const padding = 25;
//         push();
//         translate(255 + padding, 845 + padding);
//         setColor(0, 0, 0);
//         love.graphics.printf(this._currentText, 0, 0, this.width - padding * 2, 'left');
//         setColor(1, 1, 1);
//         pop();

//         if (this.hasFinishedLine()) {
//             circle('fill', this.width - this._padding - 5, this.height - this._padding - 5, 2);
//         }

//         //draw character name bubble
//         if (this.currentSpeaker) {
//             // translate(8, -8);
//             // setColor(0, 0, 0);
//             // rectangle('fill', 0, 0, 48, 16, 8, 8);

//             setColor(0, 0, 0);
//             const w = this._font.getWidth(this.currentSpeaker);
//             const h = this._font.getHeight();
//             love.graphics.print(this.currentSpeaker, 254 + 180, 781 + 30, 0, 1, 1, w / 2, h / 2);
//             setColor(1, 1, 1);
//         }

//         //draw character name bubble
//         if (this.speakerRight) {
//             setColor(0, 0, 0);
//             const w = this._font.getWidth(this.currentSpeaker);
//             const h = this._font.getHeight();
//             love.graphics.print(this.speakerRight, 136 + 180, 781 + 30, 0, 1, 1, w / 2, h / 2);
//             setColor(1, 1, 1);
//         }

//         // main.camera.viewport.detach();
//         pop();

//         if (this.answeringQuestion) this.buttons.forEach(b => b.render());
//     }
// }
