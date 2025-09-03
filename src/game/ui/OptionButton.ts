import { draw, Image } from 'love.graphics';
import { Clickable } from './Clickable';
import { input } from '../../bliss/Input';
import { Images } from '../../bliss/util/Resources';
import { Label, OutlineMode } from '../../bliss/ui/Label';
import vec from '../../libraries/nvec';
import { Color } from '../../bliss/util/Color';

export class OptionButton extends Clickable {
    public clicked: Image = Images.get('assets/images/ui/button-clicked.png');
    public unfocused: Image = Images.get('assets/images/ui/button-unfocused.png');
    public focused: Image = Images.get('assets/images/ui/button-focused.png');

    private _currentImage: Image;

    public label: Label;

    constructor(text: string, onClick: () => void) {
        super(0, 0, 0, 0);

        this.w = this.clicked.getWidth();
        this.h = this.clicked.getHeight();

        this.onButtonReleased.connect(onClick);
        this.label = new Label(text);
        this.label.anchor(0.5, 0.5);
        this.label.setColor(Color.fromHex('#000000'));
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.label.position = vec(this.x, this.y);
    }

    public override update(dt: number): void {
        super.update(dt);

        const mousedown = input.down('fire1');

        if (mousedown && this.hovered) this._currentImage = this.clicked;
        else if (this.hovered) this._currentImage = this.focused;
        else this._currentImage = this.unfocused;
    }

    public override render(): void {
        draw(this._currentImage, this.x, this.y, 0, 1, 1, this.w / 2, this.h / 2);
        this.label.render();
    }
}
