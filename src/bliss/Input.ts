import * as baton from '../libraries/baton';

export const input = baton.init({
    controls: {
        left: ['key:left', 'key:a'],
        right: ['key:right', 'key:d'],
        down: ['key:down', 'key:s'],
        up: ['key:up', 'key:w'],
        attack: ['key:x'],
        fire1: ['mouse:1'],
        fire2: ['mouse:2'],
        interact: ['key:e'],
        skill: ['key:g'],
        run: ['key:lshift'],
        jump: ['key:space', 'key:z'],
        inventory: ['key:escape', 'key:tab', 'key:b'],
    },
    pairs: {
        move: ['left', 'right', 'up', 'down'],
    },
});
