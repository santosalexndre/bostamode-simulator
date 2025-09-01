import { KeyConstant, Scancode } from 'love.keyboard';
import { input } from './Input';
import { main } from './Main';

export class Engine {
    private static game: any;

    constructor() {
        love.graphics.setDefaultFilter('nearest', 'nearest');
        love.graphics.setLineStyle('rough');
        const defaultFont = love.graphics.newFont('assets/fonts/PixelOperator.ttf', 16);
        defaultFont.setFilter('nearest');
        love.graphics.setFont(defaultFont);

        love.update = dt => {
            input.update();
            Engine.game.update(dt);
        };
        love.draw = () => {
            Engine.game.render();
        };

        love.keypressed = (key, scancode, isrepeat) => {
            if ((love.keyboard.isDown('lalt') && key === 'return') || key == 'f') {
                love.window.setFullscreen(!love.window.getFullscreen()[0]);
            }
        };
        love.keyreleased = (key, scancode) => {};

        love.resize = (_w, _h) => {
            const [w, h] = love.graphics.getDimensions(); // workaround because of a love2d bug
            main.camera.viewport.onResize(w, h);
        };
    }

    public init(o: any) {
        Engine.game = o;
    }
}
