import { Engine } from '../bliss/Engine';
import { Game } from '../bliss/Game';
import { Fonts, SpriteSheets, Animations } from '../bliss/util/Resources';
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

        const _animFPS = 3;
        const playerPng = SpriteSheets.load('images/player.png', 16, 17);
        // TODO: create an animation mapping mechanicsm for each sprite instead of ding things globally here
        Animations.load('player/idle', playerPng, [0], _animFPS, true);
        Animations.load('player/hurt', playerPng, [2], _animFPS, false);
        Animations.load('player/aim', playerPng, [3], _animFPS, false);
        Animations.load('player/yay', playerPng, [4], _animFPS, false);
        Animations.load('player/pickup', playerPng, [5], _animFPS, false);
        Animations.load('player/divedown', playerPng, [6, 7], _animFPS, true);
        Animations.load('player/dive', playerPng, [1, 0], _animFPS, true);

        // const boymoder = SpriteSheets.load()
        // Animations.load('girl/idle', )

        Animations.load('pauseMenu', SpriteSheets.load('images/pause.png', 1, 1), [0], 1, true);

        const fish = SpriteSheets.load('images/fish1.png', 1, 1);
        Animations.load('player/fish1', fish, [0], 1, true);

        const tipArrow = SpriteSheets.load('images/tip_arrow.png', 16, 16);
        Animations.load('tip_arrow', tipArrow, [1], 1, true);

        this.init(new Game(MenuState, 480, 360));
    }
}
