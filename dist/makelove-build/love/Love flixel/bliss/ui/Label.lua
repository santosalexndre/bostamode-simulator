local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local getFont = ____love_2Egraphics.getFont
local newText = ____love_2Egraphics.newText
local ____Entity = require("bliss.Entity")
local Entity = ____Entity.Entity
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
____exports.OutlineMode = OutlineMode or ({})
____exports.OutlineMode.None = 0
____exports.OutlineMode[____exports.OutlineMode.None] = "None"
____exports.OutlineMode.DropShadow = 1
____exports.OutlineMode[____exports.OutlineMode.DropShadow] = "DropShadow"
____exports.OutlineMode.Outline = 2
____exports.OutlineMode[____exports.OutlineMode.Outline] = "Outline"
____exports.Label = __TS__Class()
local Label = ____exports.Label
Label.name = "Label"
__TS__ClassExtends(Label, Entity)
function Label.prototype.____constructor(self, text, outlineMode, font)
    if outlineMode == nil then
        outlineMode = ____exports.OutlineMode.None
    end
    if font == nil then
        font = getFont()
    end
    Entity.prototype.____constructor(self)
    self.outlineMode = ____exports.OutlineMode.None
    self.color = Color.WHITE
    self.outlineColor = Color.BLACK
    self.shadowOffsetX = 0
    self.shadowOffsetY = 1
    self._textObj = newText(font)
    self.outlineMode = outlineMode
    if not text then
        return
    end
    self.text = text
    self:setText(text)
end
function Label.prototype.setText(self, text)
    self.text = text
    self:_updateTextObject()
    local ____temp_0 = {self._textObj:getDimensions()}
    self.width = ____temp_0[1]
    self.height = ____temp_0[2]
end
function Label.prototype._updateTextObject(self)
    self._textObj:clear()
    if self.outlineMode == ____exports.OutlineMode.DropShadow then
        self._textObj:add({self.outlineColor, self.text}, self.shadowOffsetX, self.shadowOffsetY)
        self._textObj:add({self.color, self.text}, 0, 0)
    elseif self.outlineMode == ____exports.OutlineMode.Outline then
        local outlineText = {self.outlineColor, self.text}
        self._textObj:add(outlineText, 1, 0)
        self._textObj:add(outlineText, -1, 0)
        self._textObj:add(outlineText, 0, 1)
        self._textObj:add(outlineText, 0, -1)
        self._textObj:add({self.color, self.text}, 0, 0)
    else
        self._textObj:add({self.color, self.text}, 0, 0)
    end
end
function Label.prototype.setColor(self, color, secondaryColor)
    self.color = color
    self.outlineColor = secondaryColor or Color.BLACK
    self:_updateTextObject()
end
function Label.prototype.render(self)
    local offx = self.width * self._anchorX
    local offy = self.height * self._anchorY
    draw(
        self._textObj,
        self.position.x,
        self.position.y,
        self.rotation,
        self.scale.x,
        self.scale.y,
        offx,
        offy
    )
end
return ____exports
