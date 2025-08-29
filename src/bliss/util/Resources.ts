import { Font, Image } from 'love.graphics';
import { Animation } from '../animation/Animation';
import { FrameCollection } from '../animation/FrameCollection';

export class Images {
    private static cache: LuaMap<string, Image> = new LuaMap();

    static get(path: string): Image {
        const cache = Images.cache.get(path);
        if (cache !== undefined) {
            return cache;
        } else {
            const img = love.graphics.newImage(`assets/${path}`);
            Images.cache.set(path, img);
            return img;
        }
    }
}

export class SpriteSheets {
    private static cache: LuaMap<string, FrameCollection> = new LuaMap();

    static load(path: string, frameWidth?: number, frameHeight?: number): FrameCollection {
        if (frameWidth === undefined || frameHeight == undefined) {
            const res = SpriteSheets.cache.get(path);
            if (res === undefined) throw `SpriteSheet ${path} not found`;
            return res;
        }

        if (!SpriteSheets.cache.has(path)) {
            SpriteSheets.cache.set(path, new FrameCollection(Images.get(path), frameWidth, frameHeight));
        }

        return SpriteSheets.cache.get(path)!;
    }
}

export class Animations {
    private static cache: LuaMap<string, Animation> = new LuaMap();

    static get(name: string): Animation {
        if (!this.cache.has(name)) throw `Animation ${name} not found`;
        return Animations.cache.get(name)!;
    }

    static load(animationName: string, frameSrc: FrameCollection, frames: number[], fps: number, loop: boolean = false): void {
        Animations.cache.set(animationName, new Animation(frameSrc, frames, fps, loop));
    }
}

export class Fonts {
    private static cache: LuaMap<string, Font> = new LuaMap();

    static get(path: string, size: number = 12): Font {
        const pathname = path + '-' + size;
        const res = this.cache.get(pathname);
        if (!res) throw `Font ${pathname} not found`;
        return res;
    }

    // TODO: i think this resource think is not the best tbh T_T.......
    static load(name: string, path: string, glyphs: string): void;
    static load(name: string, path: string, size: number): void;
    static load(name: string, path: string, b: string | number): void {
        if (typeof b === 'number') {
            const pathname = name + '-' + b;
            const res = love.graphics.newFont(path, b);
            this.cache.set(pathname, res);
        } else {
            const pathname = name + '-12';
            const res = love.graphics.newImageFont(path, b);
            this.cache.set(pathname, res);
        }
    }

    static loadMonospaceBitmap(name: string, path: string, width: number, height: number, glyphs: string): void {
        const font = Fonts.createFromMonospaceBitmap(name, path, width, height, glyphs);
        this.cache.set(name + '-12', font);
    }

    private static createFromMonospaceBitmap(name: string, path: string, width: number, height: number, glyphs: string): Font {
        const image = love.graphics.newImage(path);
        const chars = glyphs.length;

        const w = chars * (width + 1) + 1;
        const canvas = love.graphics.newCanvas(w, height);

        const vs = image.getWidth() / width;
        const hs = image.getHeight() / height;

        let count = 0;
        canvas.renderTo(() => {
            love.graphics.setColor(1, 0, 0);
            love.graphics.line(1, 0, 1, height);
            love.graphics.setColor(1, 1, 1);
            love.graphics.push();
            love.graphics.translate(1, 0);
            for (let y = 0; y < hs; y++) {
                for (let x = 0; x < vs; x++) {
                    const char = glyphs.charAt(count);
                    const quad = love.graphics.newQuad(x * width, y * height, width, height, image.getWidth(), image.getHeight());

                    love.graphics.draw(image, quad, count * (width + 1), 0);
                    love.graphics.setColor(1, 0, 0);
                    const lx = (count + 1) * (width + 1);
                    love.graphics.line(lx, 0, lx, height);
                    love.graphics.setColor(1, 1, 1);
                    count++;
                }
            }
            love.graphics.pop();
        });

        // canvas.newImageData().encode('png', 'cuzinho');
        return love.graphics.newImageFont(canvas.newImageData(), glyphs);
    }
}
