local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local Timer = require("libraries.timer")
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
local ____Signal = require("bliss.util.Signal")
local Signal = ____Signal.Signal
____exports.UiElement = __TS__Class()
local UiElement = ____exports.UiElement
UiElement.name = "UiElement"
__TS__ClassExtends(UiElement, Basic)
function UiElement.prototype.____constructor(self)
    Basic.prototype.____constructor(self)
    self.x = 0
    self.y = 0
    self.anchorX = 0
    self.anchorY = 0
    self.left = 0
    self.right = 0
    self.top = 0
    self.bottom = 0
    self.width = 0
    self.height = 0
    self.hovered = false
    self.timer = Timer(nil)
    self.onHover = __TS__New(Signal)
    self.onLeave = __TS__New(Signal)
    self.onClick = __TS__New(Signal)
    self.onClickReleased = __TS__New(Signal)
end
function UiElement.prototype.overlaps(self, x, y, w, h)
    local ax1 = self.left
    local ay1 = self.top
    local ax2 = self.right
    local ay2 = self.bottom
    local bx1 = x
    local by1 = y
    local bx2 = x + w
    local by2 = y + h
    return ax1 < bx2 and ax2 > bx1 and ay1 < by2 and ay2 > by1
end
function UiElement.prototype.anchor(self, x, y)
    self.anchorX = x
    self.anchorY = y
end
return ____exports
