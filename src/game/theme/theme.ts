import { Color } from '../../bliss/util/Color';

// export const OUTLINE_COLOR = Color.fromHex('#000000');
// export const BACKGROUND_COLOR = Color.fromHex('#f5dcf3ff');
// export const LINE_WIDTH = 5;
// export const SELECTED_COLOR = Color.fromHex('#ff00aaff');
// export const UNFOCUSED_COLOR = Color.fromHex('#f5dcf3ff');
// export const FOCUSED_COLOR = Color.fromHex('#ff7cd3ff');

export const OUTLINE_COLOR = Color.fromHex('#000000ff');
export const BACKGROUND_COLOR = Color.fromHex('#f5dcf3ff');
export const LINE_WIDTH = 5;
export const SELECTED_COLOR = Color.fromHex('#ff00aaff');
export const UNFOCUSED_COLOR = Color.fromHex('#f5dcf3ff');
export const FOCUSED_COLOR = Color.fromHex('#ff7cd3ff');

export const spriteMap: Record<string, Record<string, string>> = {
    ['you']: {
        default: 'assets/images/npcs/boymoder.png',
    },
    ['dad']: {
        default: 'assets/images/npcs/dad.png',
    },
};

export const capitalize = <T extends string>(s: T) => (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

export const getSprite = (name: string, version: string = 'default'): string => {
    const assets = spriteMap[name.toLowerCase()];
    if (assets === undefined) return 'assets/images/npcs/missing.png';

    const image = assets[version];
    if (image === undefined) return 'assets/images/npcs/missing.png';

    return image;
};
