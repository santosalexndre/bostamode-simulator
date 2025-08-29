import { Image, setColor, setLineWidth } from 'love.graphics';
import { Entity } from '../bliss/Entity';
import { input } from '../bliss/Input';
import { main } from '../bliss/Main';
import { TimerHandle } from '../bliss/interfaces';

export class Dialogue extends Entity {
    private fullDialogue: string[] = [
        'Okay okay okay, this time it"s for real, no more excuses, no more putting it off.',
        'I"ve been thinking about it for literally forever and every single time I back out at the last second.',
        'But fjdskl  jdlsj flsd jfsdlk fmoim feiwmfpeowm foewkm fkselafm dkfmiwemf weiomf ekowmf ewio mfkosafm kalds miksjfdskdksfjdskljfksdlmf e jfeo,oeiw feow fmioewn iewm feiwj fiewmf eifj skdjfaomwei feio fmweoiaf mekof meowa fmewoa fmaeo fmewo fmewaoi fmewioa mfaeo mfewak fmewoa mdks aiowem fweoi fmeawoi fmeao fmaklds fm okamfo ewamf oamf odskfm aof msdklf madklfj lemfleo rmelr meamfdlsm oaerme wlamonot today, no sir, today is the day, today is the dawn of girlmode.',
        'lkfdjskjsdk oi',
        'entao sei la',
        'lfjdlkfasd hm espero que isso de certo kk',
        'eh foda viu',
        'jfdlkjf kdjf kdsjf lsdkjf kdlsjf kdlsmf kdsmf kewjf ieow meiwm fiew fieom fiewom foweimf owei',
    ];

    public portrait: Image;
    public currentText: string = '';
    public dialogueidx: number = 0;

    public dialogueHandle?: TimerHandle;
    public finishedDialogue = false;
    public finishedFullDialogue = false;

    constructor() {
        super(0, 0);
        this.nextDialogue();
        this.portrait = love.graphics.newImage('assets/images/player1.png');
    }

    nextDialogue() {
        let idx = 0;
        this.finishedDialogue = false;

        if (this.dialogueidx >= this.fullDialogue.length - 1) {
            this.finishedFullDialogue = true;
            return;
        }
        this.dialogueHandle = this.timer.every(0.05, () => {
            this.currentText = this.fullDialogue[this.dialogueidx].slice(0, idx);
            idx++;
            if (idx > this.fullDialogue[this.dialogueidx].length) {
                this.finishedDialogue = true;
                return false;
            }
        });

        this.dialogueidx++;
    }

    skip() {
        if (this.dialogueHandle !== undefined) this.timer.cancel(this.dialogueHandle);
        this.currentText = this.fullDialogue[this.dialogueidx];
        this.finishedDialogue = true;
    }

    override update(dt: number): void {
        super.update(dt);
        if (input.pressed('up')) {
            if (this.currentText.length < this.fullDialogue[this.dialogueidx].length) {
                this.skip();
            } else {
                if (this.finishedFullDialogue) {
                    this.kill();
                } else if (this.finishedDialogue) {
                    this.nextDialogue();
                }
            }
        }
    }

    override render(): void {
        const font = love.graphics.getFont();
        const percent = font!.getWidth(this.fullDialogue[this.dialogueidx]) / (main.width - 20 - 64 - 64 - 10);
        const height = font!.getHeight();
        const textHeight = height * math.ceil(percent);
        print(math.ceil(percent));
        const actualHeight = math.max(textHeight, 64 + 20);

        setColor(0, 0, 0);
        love.graphics.rectangle('fill', 0, 0, main.width, actualHeight);
        setLineWidth(2);
        setColor(1, 1, 1);
        love.graphics.draw(this.portrait, 4, 4);
        love.graphics.rectangle('line', 0, 0, main.width, actualHeight);

        love.graphics.printf(this.currentText, 64 + 10, 10, main.width - 20 - 64, 'left');
    }
}
