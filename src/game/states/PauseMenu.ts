import { draw, Font, Image, pop, push, rectangle, setColor, setLineWidth, translate } from 'love.graphics';
import { Group } from '../../bliss/group/Group';
import { State } from '../../bliss/State';
import { Clickable } from '../ui/Clickable';
import { BACKGROUND_COLOR, FOCUSED_COLOR, LINE_WIDTH, OUTLINE_COLOR } from '../theme/theme';
import { Fonts, Images } from '../../bliss/util/Resources';
import { input } from '../../bliss/Input';
import { decode, encode } from '../../libraries/json/json';
import { globalState } from '../global';

const bw = 128 * 2.5;
const bh = 72 * 2.5;

class SaveButton extends Clickable {
    _backgroundImage: Image = Images.get('assets/images/bedroom1.png');
    _saveFile: string;
    _date: string;
    _font: Font = Fonts.get('comicsans', 28);
    gridX: number;
    gridY: number;

    constructor(x: number, y: number) {
        super(x, y, bw, bh);
        this.w = bw;
        this.h = bh;
        this._date = os.date('%d/%m-%H:%M:%S').trim();

        this.onButtonPress.connect(() => {
            if (this._saveFile === 'undefined') {
                const path = `saves-save-${this.gridY}-${this.gridX}.json`;
                const data = encode(globalState);
                print(data);
                const [ok, message] = love.filesystem.write(path, data);
                if (!ok) error('CU');
                this._saveFile = path;
                print('gravandoooo??');
            } else {
                // const path = `saves/save-${this.gridY}-${this.gridX}`;
                const [file] = love.filesystem.read(this._saveFile);
                print('arquivo', file);
                print('cuzinho', this._saveFile);
                const data = decode(file!);
                for (const [k, v] of pairs(data)) {
                    globalState.set(k, v);
                }
                print('crregando??');
                // love.filesystem.write(path, data);
            }
        });
    }

    override update(dt: number): void {
        super.update(dt);
    }

    override render(): void {
        push();
        translate(-this.w / 2, -this.h / 2);
        if (this.hovered) FOCUSED_COLOR.apply();
        else BACKGROUND_COLOR.apply();
        rectangle('fill', this.x, this.y, this.w, this.h, 25, 25);

        if (!this.hovered) setColor(0.5, 0.5, 0.5);
        else setColor(1, 1, 1);
        const sx = this.w / this._backgroundImage.getWidth();
        const sy = this.h / this._backgroundImage.getHeight();
        // if (this._backgroundImage) draw(this._backgroundImage, this.x, this.y, 0, sx, sy);

        OUTLINE_COLOR.apply();
        setLineWidth(LINE_WIDTH);
        rectangle('line', this.x, this.y, this.w, this.h, 25, 25);

        setColor(0, 0, 0, 1);
        const font = love.graphics.getFont();
        love.graphics.setFont(this._font);
        const w = this._font.getWidth(this._date);
        love.graphics.print(this._date, this.x - w / 2 + bw / 2, this.y + bh);
        setColor(1, 1, 1, 1);
        love.graphics.setFont(font!);
        pop();
    }
}

export class PauseMenu extends State {
    main: Group = new Group();
    _background: Image = Images.get('assets/backgrounds/outside.png');
    saveFiles: string[][] = [];

    constructor() {
        super();

        for (let y = 0; y < 3; y++) {
            this.saveFiles[y] = [];
            for (let x = 0; x < 4; x++) {
                const path = `saves-save-${y}-${x}.json`;
                const exists = love.filesystem.getInfo(path);
                if (exists) {
                    // const content = decode(path) as any;
                    this.saveFiles[y].push(path);
                } else {
                    this.saveFiles[y].push('undefined');
                }
            }
        }
    }

    public override enter(): void {
        super.enter();

        const margin = 25;
        const side = 25;
        const bottom = love.graphics.getFont()!.getHeight();

        const wid = bw + margin + side;
        const hei = bh + margin + bottom;
        const fullw = 4 * wid;
        const fullh = 3 * hei;
        const startx = fullw / 2 - wid * 1.33333;
        const starty = fullh / 2 - hei;

        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 4; x++) {
                const saveButton = new SaveButton(startx + x * (bw + margin + side) + bw / 2, starty + y * (bh + margin + bottom) + bh / 2);
                saveButton.gridX = x;
                saveButton.gridY = y;
                saveButton._saveFile = this.saveFiles[y][x];
                this.main.add(saveButton);
            }
        }
    }
    public override update(dt: number): void {
        super.update(dt);
        this.main.update(dt);
        if (input.pressed('fire2')) {
            this.onClose.emit();
            this.kill();
        }
    }

    public override render(): void {
        super.render();
        draw(this._background, 0, 0);
        this.main.render();
    }
}
