local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local rectangle = ____love_2Egraphics.rectangle
local setColor = ____love_2Egraphics.setColor
local setLineStyle = ____love_2Egraphics.setLineStyle
local setLineWidth = ____love_2Egraphics.setLineWidth
local ____Clickable = require("game.ui.Clickable")
local Clickable = ____Clickable.Clickable
local ____Input = require("bliss.Input")
local input = ____Input.input
local ____Label = require("bliss.ui.Label")
local Label = ____Label.Label
local ____nvec = require("libraries.nvec")
local vec = ____nvec.default
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
local ____theme = require("game.theme.theme")
local FOCUSED_COLOR = ____theme.FOCUSED_COLOR
local LINE_WIDTH = ____theme.LINE_WIDTH
local SELECTED_COLOR = ____theme.SELECTED_COLOR
local UNFOCUSED_COLOR = ____theme.UNFOCUSED_COLOR
local ____Main = require("bliss.Main")
local main = ____Main.main
____exports.OptionButton = __TS__Class()
local OptionButton = ____exports.OptionButton
OptionButton.name = "OptionButton"
__TS__ClassExtends(OptionButton, Clickable)
function OptionButton.prototype.____constructor(self, text, onClick, x, y)
    Clickable.prototype.____constructor(
        self,
        0,
        0,
        0,
        0
    )
    self.backgroundColor = Color:fromHex("#f5dcf3ff")
    self.outlineColor = Color:fromHex("#000000")
    self.clickedColor = SELECTED_COLOR
    self.unfocusedColor = UNFOCUSED_COLOR
    self.focusedColor = FOCUSED_COLOR
    self.wait = false
    self.w = 512
    self.h = 60
    self.onButtonReleased:connect(onClick)
    self.label = __TS__New(Label, text)
    self.label:anchor(0.5, 0.5)
    self.label:setColor(Color:fromHex("#000000"))
    self:setPosition(x, y)
    if self:overlaps(main.mouse.x, main.mouse.y, 3, 3) then
        self.wait = true
    end
end
function OptionButton.prototype.setPosition(self, x, y)
    self.x = x
    self.y = y
    self.label.position = vec(self.x, self.y)
end
function OptionButton.prototype.update(self, dt)
    Clickable.prototype.update(self, dt)
    local mousedown = input:down("fire1")
    if not self.hovered then
        self.wait = false
    end
    if mousedown and self.hovered and not self.wait then
        self.backgroundColor = self.clickedColor
    elseif self.hovered then
        self.backgroundColor = self.focusedColor
    else
        self.backgroundColor = self.unfocusedColor
    end
end
function OptionButton.prototype.render(self)
    self.backgroundColor:apply()
    rectangle(
        "fill",
        self.x - self.w / 2,
        self.y - self.h / 2,
        self.w,
        self.h,
        25,
        25
    )
    self.outlineColor:apply()
    setLineWidth(LINE_WIDTH)
    setLineStyle("smooth")
    rectangle(
        "line",
        self.x - self.w / 2,
        self.y - self.h / 2,
        self.w,
        self.h,
        25,
        25
    )
    setColor(1, 1, 1)
    self.label:render()
end
return ____exports
