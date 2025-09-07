local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local setShader = ____love_2Egraphics.setShader
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
local ____Resources = require("bliss.util.Resources")
local Images = ____Resources.Images
local ____ClickableSprite = require("game.ui.ClickableSprite")
local ClickableSprite = ____ClickableSprite.ClickableSprite
____exports.ClickableObject = __TS__Class()
local ClickableObject = ____exports.ClickableObject
ClickableObject.name = "ClickableObject"
__TS__ClassExtends(ClickableObject, ClickableSprite)
function ClickableObject.prototype.____constructor(self, spritePath, x, y)
    ClickableSprite.prototype.____constructor(
        self,
        Images:get(spritePath),
        x,
        y
    )
    self.sxx = 1
    self.syy = 1
    self.tint = Color:fromHex("#ffffff")
    self.whiteFactor = 0
    self.shader = love.graphics.newShader("assets/shaders/flash.frag")
    self.activated = true
    self.turnoff = false
    self.onMouseEnter:connect(function()
        if self:canClick() then
            self.whiteFactor = 0.7
        end
    end)
    self.onMouseLeave:connect(function()
        if not self.activated then
            self.activated = true
        end
        self.whiteFactor = 0
    end)
end
function ClickableObject.prototype.deactivate(self)
    self.activated = false
end
function ClickableObject.prototype.activate(self)
    if not self:overlaps(main.mouse.x, main.mouse.y, 3, 3) then
        self.activated = true
    end
end
function ClickableObject.prototype.canClick(self)
    return self.activated and not self.turnoff
end
function ClickableObject.prototype.update(self, dt)
    ClickableSprite.prototype.update(self, dt)
    self.sx = self.sxx + self.spring.value
    self.sy = self.syy + self.spring.value
end
function ClickableObject.prototype.render(self)
    setShader(self.shader)
    self.shader:send(
        "WhiteFactor",
        self:canClick() and self.whiteFactor or 0
    )
    self.shader:send("texture_size", {self.w, self.h})
    ClickableSprite.prototype.render(self)
    setShader()
end
return ____exports
