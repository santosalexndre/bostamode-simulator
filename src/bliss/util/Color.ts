import { getColor, setColor } from 'love.graphics';

export class Color {
    private 1: number;
    private 2: number;
    private 3: number;
    private 4: number;

    public static WHITE = new Color('#ffffff');
    public static BLACK = new Color('#000000');
    public static RED = new Color('#ff0000');
    public static GREEN = new Color('#00ff00');
    public static BLUE = new Color('#0000ff');
    public static YELLOW = new Color('#ffff00');
    public static CYAN = new Color('#00ffff');
    public static MAGENTA = new Color('#ff00ff');
    public static GRAY = new Color('#808080');
    public static DARK_GRAY = new Color('#404040');
    public static LIGHT_GRAY = new Color('#c0c0c0');

    private static database: Record<string, Color> = new LuaTable() as any;

    public static fromHex(hex: string) {
        if (Color.database[hex]) return Color.database[hex];
        else return (Color.database[hex] = new Color(hex));
    }

    constructor(r: number, g: number, b: number, a?: number);
    constructor(r: string, a?: number);
    constructor(r: number);
    constructor(r: number | string, g?: number, b?: number, a: number = 1) {
        if (typeof r === 'string') {
            const [hex] = string.gsub(r, '#', '');
            this[1] = tonumber('0x' + string.sub(hex, 1, 2))! / 255;
            this[2] = tonumber('0x' + string.sub(hex, 3, 4))! / 255;
            this[3] = tonumber('0x' + string.sub(hex, 5, 6))! / 255;
            this[4] = hex.length === 8 ? tonumber('0x' + string.sub(hex, 7, 8))! / 255 : 1;
        } else {
            if (g === undefined || b === undefined) {
                throw new Error('If the first argument is a number, the second and third must also be numbers.');
            } else if (r > 1 || g > 1 || b > 1) {
                this[1] = r / 255;
                this[2] = g / 255;
                this[3] = b / 255;
                this[4] = a || 1;
            } else {
                this[1] = r;
                this[2] = g;
                this[3] = b;
                this[4] = a || 1;
            }
        }
    }

    public apply() {
        const [r, g, b, a] = getColor();
        setColor(this[1], this[2], this[3], a);
    }

    public clone(): Color {
        return new Color(this[1], this[2], this[3], this[4]);
    }

    public darken(amount: number = 0.1): Color {
        this[1] = Math.max(0, this[1] - amount);
        this[2] = Math.max(0, this[2] - amount);
        this[3] = Math.max(0, this[3] - amount);
        return this;
    }

    public interpolate(to: Color, amount: number): Color {
        // clamp amount between 0 and 1
        amount = Math.max(0, Math.min(1, amount));

        this[1] = this[1] + (to[1] - this[1]) * amount;
        this[2] = this[2] + (to[2] - this[2]) * amount;
        this[3] = this[3] + (to[3] - this[3]) * amount;
        this[4] = this[4] + (to[4] - this[4]) * amount;
        return this;
    }

    public get r(): number {
        return this[1];
    }
    public get g(): number {
        return this[2];
    }
    public get b(): number {
        return this[3];
    }
    public get a(): number {
        return this[4];
    }

    toString(): string {
        return `Color(r: ${this[1] * 255}, g: ${this[2] * 255}, b: ${this[3] * 255}, a: ${this[4]})`;
    }
}
