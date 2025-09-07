local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local circle = ____love_2Egraphics.circle
local rectangle = ____love_2Egraphics.rectangle
local setColor = ____love_2Egraphics.setColor
local ____Sprite = require("bliss.Sprite")
local Sprite = ____Sprite.Sprite
____exports.Prop = __TS__Class()
local Prop = ____exports.Prop
Prop.name = "Prop"
__TS__ClassExtends(Prop, Sprite)
function Prop.prototype.____constructor(self, x, y, state)
    Sprite.prototype.____constructor(self, x, y)
    self.state = state
    self.playerNearby = false
    self:setHitbox(0, 0, 20, 20)
end
function Prop.prototype.showDialogue(self)
end
function Prop.prototype.update(self, dt)
    Sprite.prototype.update(self, dt)
end
function Prop.prototype.render(self)
    Sprite.prototype.render(self)
    if self.playerNearby then
        setColor(1, 0, 0)
        circle("fill", self.position.x, self.position.y - self.height, 4)
        setColor(1, 1, 1)
    end
    rectangle(
        "fill",
        self.position.x,
        self.position.y,
        self.width,
        self.height
    )
end
return ____exports
