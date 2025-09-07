local ____exports = {}
local args = arg
local IS_DEBUG = os.getenv("LOCAL_LUA_DEBUGGER_VSCODE") == "1" and args[2] == "debug"
if IS_DEBUG then
    require("lldebugger"):start()
    love.errorhandler = function(msg)
        error(msg, 2)
    end
end
love.conf = function(t)
    t.identity = "Boymoder Chronicles"
    t.window.width = 1280
    t.window.height = 720
    t.window.resizable = true
    t.window.title = "Boymoder Chronicles"
end
return ____exports
