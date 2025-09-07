local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local bump = require("libraries.bump")
local ____Signal = require("bliss.util.Signal")
local Signal = ____Signal.Signal
____exports.main = __TS__Class()
local main = ____exports.main
main.name = "main"
function main.prototype.____constructor(self)
end
function main.switchState(self, state)
    ____exports.main.switchStateEvent:emit(state)
end
main.mouse = {
    x = 0,
    y = 0,
    viewportX = 0,
    viewportY = 0,
    windowX = 0,
    windowY = 0
}
main.world = bump.newWorld(32)
main.switchStateEvent = __TS__New(Signal)
return ____exports
