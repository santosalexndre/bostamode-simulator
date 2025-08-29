import { Config } from 'love';

// @ts-expect-error
const args: string[] = arg;

const IS_DEBUG = os.getenv('LOCAL_LUA_DEBUGGER_VSCODE') === '1' && args[1] === 'debug';
if (IS_DEBUG)
{
    require('lldebugger').start();

    love.errorhandler = (msg: string) =>
    {
        error(msg, 2);
    };
}

love.conf = (t: Config) =>
{
    t.identity = 'Flixel';

    t.window.width = 960;
    t.window.height = 720;
    t.window.resizable = true;
    t.window.title = 'LÖVE FLX';
};
