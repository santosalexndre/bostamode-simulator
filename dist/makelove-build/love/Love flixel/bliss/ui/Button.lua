local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local circle = ____love_2Egraphics.circle
local rectangle = ____love_2Egraphics.rectangle
local setColor = ____love_2Egraphics.setColor
local ____nvec = require("libraries.nvec")
local vec = ____nvec.default
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____Label = require("bliss.ui.Label")
local Label = ____Label.Label
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
local ____Input = require("bliss.Input")
local input = ____Input.input
local ____UiElement = require("bliss.ui.UiElement")
local UiElement = ____UiElement.UiElement
____exports.Button = __TS__Class()
local Button = ____exports.Button
Button.name = "Button"
__TS__ClassExtends(Button, UiElement)
function Button.prototype.____constructor(self, text, onClick)
    UiElement.prototype.____constructor(self)
    self.backgroundColor = Color.LIGHT_GRAY
    self.label = __TS__New(Label, text)
    self.label:anchor(self.anchorX, self.anchorY)
    self.width = self.label.width
    self.height = self.label.height
    if onClick ~= nil then
        self.onClick:connect(onClick)
    end
end
function Button.prototype.setHitbox(self, left, top, right, bottom)
    self.left = left + self.x
    self.right = right + self.x
    self.top = top + self.y
    self.bottom = bottom + self.y
end
function Button.prototype.setSize(self, width, height)
    local w = self.label.width
    local h = self.label.height
    self.width = math.max(width, w)
    self.height = math.max(height, h)
end
function Button.prototype.setPosition(self, x, y)
    self.label.position = vec(x + self.width * self.label._anchorX, y + self.height * self.label._anchorY)
    self.x = x
    self.y = y
end
function Button.prototype.update(self, dt)
    self.timer:update(dt)
    if self:overlaps(main.mouse.x, main.mouse.y, 2, 2) then
        if not self.hovered then
            self.hovered = true
            self.onHover:emit()
        end
        if input:pressed("fire1") then
            self.onClick:emit()
        end
        if input:released("fire1") then
            self.onClickReleased:emit()
        end
    else
        if self.hovered then
            self.onLeave:emit()
        end
        self.hovered = false
    end
end
function Button.prototype.render(self)
    setColor(self.backgroundColor)
    rectangle(
        "fill",
        self.x,
        self.y,
        self.width,
        self.height
    )
    setColor(1, 1, 1)
    self.label:render()
    setColor(1, 0, 0)
    rectangle(
        "line",
        self.left,
        self.top,
        self.right - self.left,
        self.bottom - self.top
    )
    circle("fill", self.x, self.y, 2)
end
return ____exports
