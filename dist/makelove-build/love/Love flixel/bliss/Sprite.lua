local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local getColor = ____love_2Egraphics.getColor
local pop = ____love_2Egraphics.pop
local push = ____love_2Egraphics.push
local rectangle = ____love_2Egraphics.rectangle
local rotate = ____love_2Egraphics.rotate
local setColor = ____love_2Egraphics.setColor
local translate = ____love_2Egraphics.translate
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
local ____Resources = require("bliss.util.Resources")
local Images = ____Resources.Images
local ____Entity = require("bliss.Entity")
local Entity = ____Entity.Entity
local ____AnimationController = require("bliss.animation.AnimationController")
local AnimationController = ____AnimationController.AnimationController
____exports.Sprite = __TS__Class()
local Sprite = ____exports.Sprite
Sprite.name = "Sprite"
__TS__ClassExtends(Sprite, Entity)
function Sprite.prototype.____constructor(self, x, y, defaultGraphic)
    Entity.prototype.____constructor(self, x, y)
    self.offsetX = 0
    self.offsetY = 0
    self.flipX = 1
    self.flipY = 1
    self.tint = Color.WHITE
    self.animation = __TS__New(AnimationController)
    self.animation.animationChanged:connect(function()
        self._currentTexture = self.animation._texture
        local w, h = self.animation._current.frameSrc:getDimensions()
        self:updateAnchor(w, h)
    end)
    if defaultGraphic then
        self:loadGraphic(defaultGraphic)
    end
end
function Sprite.prototype.loadGraphic(self, path)
    self._currentTexture = Images:get(path)
    self:updateAnchor(
        self._currentTexture:getWidth(),
        self._currentTexture:getHeight()
    )
end
function Sprite.prototype.anchor(self, x, y)
    Entity.prototype.anchor(self, x, y)
    local ____self_updateAnchor_5 = self.updateAnchor
    local ____opt_0 = self._currentTexture
    local ____temp_4 = ____opt_0 and ____opt_0:getWidth() or 0
    local ____opt_2 = self._currentTexture
    ____self_updateAnchor_5(
        self,
        ____temp_4,
        ____opt_2 and ____opt_2:getHeight() or 0
    )
end
function Sprite.prototype.updateAnchor(self, w, h)
    self._anchorOffsetX = self._anchorX * w
    self._anchorOffsetY = self._anchorY * h
    self._hitboxOffsetX = -self._anchorOffsetX
    self._hitboxOffsetY = -self._anchorOffsetY
end
function Sprite.prototype.update(self, dt)
    Entity.prototype.update(self, dt)
    self.animation:update(dt)
end
function Sprite.prototype.render(self)
    Entity.prototype.render(self)
    local deg2rad = math.pi / 180
    setColor(self.tint)
    local offx = self._anchorOffsetX
    local offy = self._anchorOffsetY
    if self.animation.playing then
        draw(
            self._currentTexture,
            self.animation._currentQuad,
            self.position.x,
            self.position.y,
            self.rotation * deg2rad,
            self.scale.x * self.flipX,
            self.scale.y * self.flipY,
            self.offsetX + offx,
            self.offsetY + offy
        )
    elseif self._graphicColor then
        self._graphicColor:apply()
        push()
        translate(self.position.x - self.offsetX + offx, self.position.y - self.offsetY + offy)
        rotate(self.rotation * deg2rad)
        rectangle(
            "fill",
            self.position.x - self.offsetX + offx,
            self.position.y - self.offsetY + offy,
            self.width,
            self.height
        )
        pop()
        setColor(1, 1, 1)
    elseif self._currentTexture ~= nil then
        local r, g, b, a = getColor()
        setColor(r, g, b, self.alpha)
        draw(
            self._currentTexture,
            self.position.x,
            self.position.y,
            self.rotation * deg2rad,
            self.scale.x * self.flipX,
            self.scale.y * self.flipY,
            self.offsetX + offx,
            self.offsetY + offy
        )
        setColor(r, g, b, a)
    end
end
function Sprite.prototype.makeGraphic(self, w, h, color)
    self._graphicColor = color
    self.width = w
    self.height = h
end
function Sprite.prototype.destroy(self)
    Entity.prototype.destroy(self)
    self.timer:clear()
end
return ____exports
