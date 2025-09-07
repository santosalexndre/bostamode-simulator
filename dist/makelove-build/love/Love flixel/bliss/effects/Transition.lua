local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local rectangle = ____love_2Egraphics.rectangle
local Timer = require("libraries.timer")
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
local ____Signal = require("bliss.util.Signal")
local Signal = ____Signal.Signal
local ____Main = require("bliss.Main")
local main = ____Main.main
____exports.Transition = __TS__Class()
local Transition = ____exports.Transition
Transition.name = "Transition"
__TS__ClassExtends(Transition, Basic)
function Transition.prototype.____constructor(self)
    local ____ = 1
    Basic.prototype.____constructor(self)
    self.timer = Timer(nil)
    self.onFinished = __TS__New(Signal)
end
function Transition.prototype.update(self, dt)
    Basic.prototype.update(self, dt)
    self.timer:update(dt)
end
____exports.FadeInOut = __TS__Class()
local FadeInOut = ____exports.FadeInOut
FadeInOut.name = "FadeInOut"
__TS__ClassExtends(FadeInOut, ____exports.Transition)
function FadeInOut.prototype.____constructor(self)
    FadeInOut.____super.prototype.____constructor(self)
end
function FadeInOut.prototype.render(self)
    rectangle(
        "fill",
        0,
        0,
        main.width,
        main.height
    )
end
return ____exports
