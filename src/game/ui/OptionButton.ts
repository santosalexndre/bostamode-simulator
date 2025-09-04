import { draw, Image, rectangle, setColor, setLineJoin, setLineStyle, setLineWidth } from 'love.graphics';
import { Clickable } from './Clickable';
import { input } from '../../bliss/Input';
import { Images } from '../../bliss/util/Resources';
import { Label, OutlineMode } from '../../bliss/ui/Label';
import vec from '../../libraries/nvec';
import { Color } from '../../bliss/util/Color';
import { FOCUSED_COLOR, LINE_WIDTH, SELECTED_COLOR, UNFOCUSED_COLOR } from '../theme/theme';
import { main } from '../../bliss/Main';

export class OptionButton extends Clickable {
    // public clicked: Image = Images.get('assets/images/ui/button-clicked.png');
    // public unfocused: Image = Images.get('assets/images/ui/button-unfocused.png');
    // public focused: Image = Images.get('assets/images/ui/button-focused.png');

    private _currentImage: Image;

    public label: Label;
    backgroundColor: Color = Color.fromHex('#f5dcf3ff');
    outlineColor: Color = Color.fromHex('#000000');

    clickedColor: Color = SELECTED_COLOR;
    unfocusedColor: Color = UNFOCUSED_COLOR;
    focusedColor: Color = FOCUSED_COLOR;
    wait: boolean = false;

    constructor(text: string, onClick: () => void, x: number, y: number) {
        super(0, 0, 0, 0);

        this.w = 512;
        this.h = 60;

        this.onButtonReleased.connect(onClick);
        this.label = new Label(text);
        this.label.anchor(0.5, 0.5);
        this.label.setColor(Color.fromHex('#000000'));
        this.setPosition(x, y);

        if (this.overlaps(main.mouse.x, main.mouse.y, 3, 3)) {
            this.wait = true;
        }
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.label.position = vec(this.x, this.y);
    }

    public override update(dt: number): void {
        super.update(dt);

        const mousedown = input.down('fire1');

        if (!this.hovered) this.wait = false;

        if (mousedown && this.hovered && !this.wait) this.backgroundColor = this.clickedColor;
        else if (this.hovered) this.backgroundColor = this.focusedColor;
        else this.backgroundColor = this.unfocusedColor;
    }

    public override render(): void {
        this.backgroundColor.apply();
        rectangle('fill', this.x - this.w / 2, this.y - this.h / 2, this.w, this.h, 25, 25);
        this.outlineColor.apply();
        setLineWidth(LINE_WIDTH);
        setLineStyle('smooth');
        rectangle('line', this.x - this.w / 2, this.y - this.h / 2, this.w, this.h, 25, 25);
        setColor(1, 1, 1);
        // draw(this._currentImage, this.x, this.y, 0, 1, 1, this.w / 2, this.h / 2);
        this.label.render();
    }
}
