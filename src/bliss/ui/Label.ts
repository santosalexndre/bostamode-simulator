import { circle, draw, Font, getFont, newText, setColor, Text } from 'love.graphics';
import { Entity } from '../Entity';
import { Color } from '../util/Color';

export enum OutlineMode {
    None = 0,
    DropShadow = 1,
    Outline = 2,
}

export class Label extends Entity {
    private _textObj: Text;

    private text: string;
    public outlineMode: OutlineMode = OutlineMode.None;
    private color: Color = Color.WHITE;
    private outlineColor: Color = Color.BLACK;

    public shadowOffsetX: number = 0;
    public shadowOffsetY: number = 1;

    constructor(text?: string, outlineMode: OutlineMode = OutlineMode.None, font: Font = getFont()!) {
        super();
        this._textObj = newText(font);
        this.outlineMode = outlineMode;

        if (!text) return;

        this.text = text;
        this.setText(text);
    }

    public setText(text: string) {
        this.text = text;
        this._updateTextObject();
        [this.width, this.height] = this._textObj.getDimensions();
    }

    private _updateTextObject() {
        this._textObj.clear();
        if (this.outlineMode === OutlineMode.DropShadow) {
            this._textObj.add([this.outlineColor as any, this.text], this.shadowOffsetX, this.shadowOffsetY);
            this._textObj.add([this.color as any, this.text], 0, 0);
        } else if (this.outlineMode === OutlineMode.Outline) {
            const outlineText = [this.outlineColor as any, this.text];
            this._textObj.add(outlineText, 1, 0);
            this._textObj.add(outlineText, -1, 0);
            this._textObj.add(outlineText, 0, 1);
            this._textObj.add(outlineText, 0, -1);
            this._textObj.add([this.color as any, this.text], 0, 0);
        } else {
            this._textObj.add([this.color as any, this.text], 0, 0);
        }
    }

    public setColor(color: Color, secondaryColor?: Color) {
        this.color = color;
        this.outlineColor = secondaryColor || Color.BLACK;
        this._updateTextObject();
    }

    override render(): void {
        const offx = this.width * this['_anchorX'];
        const offy = this.height * this['_anchorY'];

        draw(this._textObj, this.position.x, this.position.y, this.rotation, this.scale.x, this.scale.y, offx, offy);
        // circle('fill', this.position.x, this.position.y, 2);
    }
}
