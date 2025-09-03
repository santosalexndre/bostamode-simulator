import { Image, Font, draw, setColor, setBlendMode } from 'love.graphics';
import { Basic } from '../../bliss/Basic';
import { main } from '../../bliss/Main';
import { Images } from '../../bliss/util/Resources';
import * as Timer from '../../libraries/timer';
import { Color } from '../../bliss/util/Color';

export class DialogueBox extends Basic {
    public timer: Timer = Timer();

    _backgroundImage: Image;
    width: number;
    height: number;

    x: number;
    y: number;

    anchorX: number = 0.5;
    anchorY: number = 1;

    fullText: string;
    font: Font;
    _text: string = '';
    _idx: number = 0;

    constructor(text: string) {
        super();
        this.fullText = text;
        this.font = love.graphics.getFont()!;
        this._backgroundImage = Images.get('assets/images/ui/dialogue-background.png');
        this.width = this._backgroundImage.getWidth();
        this.height = this._backgroundImage.getHeight();

        this.x = main.width / 2;
        this.y = main.height - 40;

        print(this.width);

        this.typewriter();
    }

    public skip() {
        this.timer.clear();
        this._idx = this.fullText.length;
        this._text = this.fullText;
    }

    public hasFinished(): boolean {
        return this._text.length >= this.fullText.length;
    }

    public typewriter(): void {
        this.timer.clear();
        this.timer.every(0.03, () => {
            this._idx++;
            this._text = this.fullText.substring(0, this._idx);
            if (this._text.length >= this.fullText.length) {
                this.timer.clear();
                return false;
            }
        });
    }

    public override update(dt: number): void {
        super.update(dt);
        this.timer.update(dt);
    }

    // color = Color.fromHex('#bbff94af');
    public override render(): void {
        const padding = 40;
        const marginTop = 60;
        love.graphics.setFont(this.font);

        // Use font:getWrap to compute wrapped lines
        const [_, lines] = this.font.getWrap(this.fullText, this.width - padding * 2); // returns array of lines

        // this.color.apply();
        draw(this._backgroundImage, this.x, this.y, 0, 1, 0.75, this.width * this.anchorX, this.height * this.anchorY);
        // setColor(1, 1, 1);

        // Draw each line manually
        setColor(0, 0, 0);
        let y = this.y - this.height; // starting y
        let remaining = this._idx; // number of chars to draw

        for (const line of lines) {
            if (remaining <= 0) break;

            const toDraw = line.substring(0, remaining);
            love.graphics.print(toDraw, this.x - this.width / 2 + padding, y + padding + marginTop);

            remaining -= line.length;
            y += this.font.getHeight();
        }

        setColor(1, 1, 1);
    }
}
