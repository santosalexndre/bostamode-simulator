import { circle, Font, pop, push, setColor, setFont, translate } from 'love.graphics';
import { Entity } from '../bliss/Entity';
import { Fonts } from '../bliss/util/Resources';

export class StealthMeme extends Entity {
    public text: string = 'STEALTH INCREASED TO 100';

    private idx: number = 0;
    font: Font;
    fadeCount = 16;
    constructor(x: number, y: number) {
        super(x, y);
        // Fonts.load('PixelOperator', 'assets/fonts/PixelOperator.ttf', 32);
        // this.font = Fonts.get('PixelOperator', 32);
        this.font = love.graphics.getFont()!;
        this.timer.every(0.04, () => {
            this.idx++;
            if (this.idx > this.text.length + this.fadeCount) return false;
        });

        this.width = this.font.getWidth(this.text);
    }

    override render(): void {
        let w = 0;
        setFont(this.font);
        const font = love.graphics.getFont()!;
        const length = this.text.length;
        push();
        translate(this.position.x - this.width / 2, this.position.y);
        for (const i of $range(0, this.idx)) {
            const char = this.text.charAt(i);
            const startFade = this.idx - this.fadeCount;
            const t = (i - startFade) / (this.fadeCount - 1);
            let alpha = 1 - t;
            setColor(1, 1, 1, alpha);
            love.graphics.print(char, w, 10);

            w += font.getWidth(char);
        }
        setColor(1, 1, 1);
        pop();
        circle('fill', this.position.x, this.position.y, 2);
    }
}
