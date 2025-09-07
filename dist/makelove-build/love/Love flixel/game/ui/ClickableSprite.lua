local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local ____Clickable = require("game.ui.Clickable")
local Clickable = ____Clickable.Clickable
local ____Spring = require("bliss.effects.Spring")
local Spring = ____Spring.Spring
local Timer = require("libraries.timer")
____exports.ClickableSprite = __TS__Class()
local ClickableSprite = ____exports.ClickableSprite
ClickableSprite.name = "ClickableSprite"
__TS__ClassExtends(ClickableSprite, Clickable)
function ClickableSprite.prototype.____constructor(self, sprite, x, y)
    Clickable.prototype.____constructor(
        self,
        x,
        y,
        sprite:getWidth(),
        sprite:getHeight()
    )
    self.sprite = sprite
    self.spring = __TS__New(Spring)
    self.timer = Timer(nil)
end
function ClickableSprite.prototype.update(self, dt)
    Clickable.prototype.update(self, dt)
    self.timer:update(dt)
    self.spring:update(dt)
end
function ClickableSprite.prototype.render(self)
    draw(
        self.sprite,
        self.x,
        self.y,
        self.rotation,
        self.sx,
        self.sy,
        self.w / 2,
        self.h / 2
    )
end
return ____exports
