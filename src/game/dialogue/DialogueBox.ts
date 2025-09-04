import { Image, Font, draw, setColor, setBlendMode, rectangle, setLineWidth, setLineStyle, getColor } from 'love.graphics';
import { Basic } from '../../bliss/Basic';
import { main } from '../../bliss/Main';
import { Images } from '../../bliss/util/Resources';
import * as Timer from '../../libraries/timer';
import { Color } from '../../bliss/util/Color';
import { BACKGROUND_COLOR, capitalize, FOCUSED_COLOR, LINE_WIDTH, OUTLINE_COLOR, UNFOCUSED_COLOR } from '../theme/theme';
import { parseDialogue } from './DialogueParser';

export class DialogueBox extends Basic {
    public timer: Timer = Timer();

    _backgroundImage: Image;
    _arrow: Image = Images.get('assets/images/ui/arrow.png');
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
    speakerLeft?: string;
    speakerRight?: string;
    currentSpeaker?: string;
    speed: number = 0.02;

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

    public setSpeakerLeft(s?: string) {
        if (s === undefined) return;
        this.speakerLeft = capitalize(s);
    }

    public setSpeakerRight(s?: string) {
        if (s === undefined) return;
        this.speakerRight = capitalize(s);
    }

    public setCurrentSpeaker(s?: string) {
        if (s === undefined) return;
        this.currentSpeaker = capitalize(s);
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
        this.timer.every(this.speed, () => {
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

    alpha = 0.9;

    public override render(): void {
        const padding = 30;
        const marginTop = 0;
        love.graphics.setFont(this.font);

        // Use font:getWrap to compute wrapped lines
        const [_, lines] = this.font.getWrap(this.fullText, this.width - padding * 2); // returns array of lines

        // this.color.apply();
        // draw(this._backgroundImage, this.x, this.y, 0, 1, 1, this.width * this.anchorX, this.height * this.anchorY);
        setColor(1, 1, 1, this.alpha);
        BACKGROUND_COLOR.apply();
        // const [r, g, b, a] = getColor();
        // setColor(r, g, b, this.alpha);
        rectangle('fill', this.x - this.width * this.anchorX, this.y - this.height * this.anchorY, this.width, this.height, 25, 25);
        setColor(1, 1, 1, 1);
        OUTLINE_COLOR.apply();
        setLineWidth(LINE_WIDTH);
        setLineStyle('smooth');
        rectangle('line', this.x - this.width * this.anchorX, this.y - this.height * this.anchorY, this.width, this.height, 25, 25);
        setLineWidth(1);

        // Draw each line manually
        setColor(0, 0, 0, 1);
        let y = this.y - this.height + 10; // starting y
        let remaining = this._idx; // number of chars to draw

        for (const line of lines) {
            if (remaining <= 0) break;

            const toDraw = line.substring(0, remaining);
            love.graphics.print(toDraw, this.x - this.width / 2 + padding + 10, y + padding + marginTop);

            remaining -= line.length;
            y += this.font.getHeight();
        }
        setColor(1, 1, 1, 1);

        //draw character labels
        const labelWidth = 200;
        const vMargin = 5;
        const labelHeight = this.font.getHeight() + vMargin;
        const spacing = -labelHeight / 2 + 0;

        const xx = this.x - this.width * this.anchorX + 30;
        const yy = this.y - this.height * this.anchorY - labelHeight - spacing;

        if (this.speakerLeft) {
            if (this.currentSpeaker == this.speakerLeft) FOCUSED_COLOR.apply();
            else UNFOCUSED_COLOR.apply();
            rectangle('fill', xx, yy, labelWidth, labelHeight, 25, 25);
            OUTLINE_COLOR.apply();
            setLineWidth(LINE_WIDTH);
            setLineStyle('smooth');
            rectangle('line', xx, yy, labelWidth, labelHeight, 25, 25);
            setLineWidth(1);
            love.graphics.print(this.speakerLeft, xx + labelWidth / 2 - this.font.getWidth(this.speakerLeft) / 2, yy + 1);
        }

        if (this.speakerRight) {
            const rx = this.width + labelWidth / 2 - 30;
            const ry = this.y - this.height * this.anchorY - labelHeight - spacing;
            if (this.currentSpeaker == this.speakerRight) FOCUSED_COLOR.apply();
            else UNFOCUSED_COLOR.apply();
            rectangle('fill', rx, yy, labelWidth, labelHeight, 25, 25);
            OUTLINE_COLOR.apply();
            setLineWidth(LINE_WIDTH);
            setLineStyle('smooth');
            rectangle('line', rx, yy, labelWidth, labelHeight, 25, 25);
            setLineWidth(1);
            love.graphics.print(this.speakerRight, rx + labelWidth / 2 - this.font.getWidth(this.speakerRight) / 2, yy + 1);
        }

        if (this.hasFinished()) {
            draw(this._arrow, this.x + this.width / 2 - padding * 2, this.y - padding * 2 - spacing, 0, 1, 1, this._arrow.getWidth() / 2, this._arrow.getHeight() / 2);
        }
    }
}
