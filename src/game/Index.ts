import { Engine } from '../bliss/Engine';
import { Game } from '../bliss/Game';
import { Fonts, SpriteSheets, Animations } from '../bliss/util/Resources';
import { ViewportMode } from '../bliss/Viewport';
import { MenuState } from './MenuState';
import { PlayState } from './PlayState';

export class Index extends Engine {
    constructor() {
        super();

        // Fonts.loadMonospaceBitmap(
        //     'pixelFont',
        //     'assets/images/ATARIPL.png',
        //     8,
        //     8,
        //     ' !"ĆŁ%Ń\'()*+,-./0123456789:;<=>?' + // row 1
        //         'ŚABCDEFGHIJKLMNOPQRSTUVWXYZŹ\\Ż^_' + // row 2
        //         '♡ą|ć˧ę╱╲◢▗◣▝ł▔ńó♣┏━ś⬤▄▏┳ź▌ż␛↑↓←→' + // row 3
        //         '♦abcdefghijklmnopqrstuvwxyz♠┃' + // row 4
        //         '$', // row 5 (other))
        // );

        // TODO: create an animation mapping mechanicsm for each sprite instead of ding things globally here

        // const boymoder = SpriteSheets.load()
        // Animations.load('girl/idle', )

        const girlPng = SpriteSheets.load('assets/images/player/player.png', 90, 200);
        Animations.load('girl/idle', girlPng, [0], 3, true);
        Animations.load('girl/hide', girlPng, [1], 3, true);

        this.init(new Game(MenuState, 480, 270, ViewportMode.Viewport));
    }
}
