local ____lualib = require("lualib_bundle")
local __TS__New = ____lualib.__TS__New
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____Sprite = require("bliss.Sprite")
local Sprite = ____Sprite.Sprite
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
local ____mathx = require("libraries.mathx")
local deg2rad = ____mathx.deg2rad
local color1 = __TS__New(Color, "#e7d5d565")
local color2 = __TS__New(Color, "#00f7ffff")
____exports.Bullet = __TS__Class()
local Bullet = ____exports.Bullet
Bullet.name = "Bullet"
__TS__ClassExtends(Bullet, Sprite)
function Bullet.prototype.____constructor(self, x, y)
    Sprite.prototype.____constructor(self, x, y)
    self:loadGraphic("images/bullet.png")
    self.tag = "bullet"
    self:setHitbox(0, 0, 12, 12)
    self:setCollisionFilters({player = "slide", bullet = "cross"})
end
function Bullet.prototype.update(self, dt)
    Sprite.prototype.update(self, dt)
    if self.lifetime > 2 then
        self:destroy()
    end
    self.velocity.x = math.cos(self.rotation * deg2rad) * 300
    self.velocity.y = math.sin(self.rotation * deg2rad) * 300
end
function Bullet.prototype.onCollision(self, col)
end
return ____exports
