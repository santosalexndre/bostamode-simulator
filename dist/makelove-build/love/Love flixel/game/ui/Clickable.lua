local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
local ____Input = require("bliss.Input")
local input = ____Input.input
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____Signal = require("bliss.util.Signal")
local Signal = ____Signal.Signal
____exports.Clickable = __TS__Class()
local Clickable = ____exports.Clickable
Clickable.name = "Clickable"
__TS__ClassExtends(Clickable, Basic)
function Clickable.prototype.____constructor(self, x, y, w, h)
    Basic.prototype.____constructor(self)
    self.x = x
    self.y = y
    self.w = w
    self.h = h
    self.onButtonPress = __TS__New(Signal)
    self.onButtonReleased = __TS__New(Signal)
    self.onMouseEnter = __TS__New(Signal)
    self.onMouseLeave = __TS__New(Signal)
    self.hovered = false
end
function Clickable.prototype.overlaps(self, x, y, w, h)
    local ax1 = self.x - self.w / 2
    local ay1 = self.y - self.h / 2
    local ax2 = self.x + self.w / 2
    local ay2 = self.y + self.h / 2
    local bx1 = x
    local by1 = y
    local bx2 = x + w
    local by2 = y + h
    return ax1 < bx2 and ax2 > bx1 and ay1 < by2 and ay2 > by1
end
function Clickable.prototype.update(self, dt)
    local inside = self:overlaps(main.mouse.x, main.mouse.y, 3, 3)
    if inside then
        if input:released("fire1") then
            self.onButtonReleased:emit()
        end
        if input:pressed("fire1") then
            self.onButtonPress:emit()
        end
    end
    if inside and not self.hovered then
        self.hovered = true
        self.onMouseEnter:emit()
    elseif not inside and self.hovered then
        self.hovered = false
        self.onMouseLeave:emit()
    end
end
return ____exports
