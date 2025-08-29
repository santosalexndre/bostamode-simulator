import { clear } from 'love.event';
import type { Color } from '../bliss/util/Color';

declare module 'love.graphics' {
    function setColor(this: void, color: Color): void;
    function clear(this: void, color: Color): void;
}
