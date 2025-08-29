import { Camera } from './Camera';
import { main } from './Main';
import { State } from './State';
import { Viewport, ViewportMode } from './Viewport';

export class Game {
    private state: State;

    constructor(initial: new () => State, width: number = 320, height: number = 240, viewportMode: ViewportMode = ViewportMode.CanvasItem) {
        main.width = width;
        main.height = height;
        main.camera = new Camera(width, height, viewportMode);
        main.switchStateEvent.connect(state => this.switchState(state));

        this.switchState(initial);
    }

    private switchState(state: new () => State): void {
        const s = new state();
        s.enter();
        this.state = s;
    }

    private update(dt: number): void {
        const [mx, my] = love.mouse.getPosition();
        const [smx, smy] = main.camera.viewport.getMousePosition(mx, my);
        const [gmx, gmy] = main.camera.toWorldCoords(smx, smy);

        main.mouse.windowX = mx;
        main.mouse.windowY = my;
        main.mouse.viewportX = smx;
        main.mouse.viewportY = smy;
        main.mouse.x = gmx;
        main.mouse.y = gmy;

        this.state.update(dt);
        main.camera.update(dt);
    }

    private render(): void {
        this.state.render();
    }
}
