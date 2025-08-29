import { trace } from '../../libraries/inspect';
import { Basic } from '../Basic';

export class SimpleDebugger {
    private static objects: LuaTable<any, string[]> = new LuaTable();

    public static register(obj: Basic, property: string) {
        if (SimpleDebugger.objects.get(obj) === undefined) SimpleDebugger.objects.set(obj, []);
        SimpleDebugger.objects.get(obj).push(property);
    }

    public static render(x: number, y: number) {
        let yy = y;
        const fontHeight = love.graphics.getFont()?.getHeight() || 8;
        // trace(SimpleDebugger.objects);
        for (const [obj, props] of SimpleDebugger.objects) {
            love.graphics.print(`${obj.constructor.name}`, x, yy);
            for (const prop of props) {
                yy += fontHeight;
                love.graphics.print(`${prop.toUpperCase()}: ${obj[prop]}`, x + 16, yy);
            }
        }
    }
}
