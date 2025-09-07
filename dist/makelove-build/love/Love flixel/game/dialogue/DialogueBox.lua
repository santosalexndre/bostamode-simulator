local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__StringSubstring = ____lualib.__TS__StringSubstring
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local setColor = ____love_2Egraphics.setColor
local rectangle = ____love_2Egraphics.rectangle
local setLineWidth = ____love_2Egraphics.setLineWidth
local setLineStyle = ____love_2Egraphics.setLineStyle
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____Resources = require("bliss.util.Resources")
local Images = ____Resources.Images
local Timer = require("libraries.timer")
local ____theme = require("game.theme.theme")
local BACKGROUND_COLOR = ____theme.BACKGROUND_COLOR
local capitalize = ____theme.capitalize
local FOCUSED_COLOR = ____theme.FOCUSED_COLOR
local LINE_WIDTH = ____theme.LINE_WIDTH
local OUTLINE_COLOR = ____theme.OUTLINE_COLOR
local UNFOCUSED_COLOR = ____theme.UNFOCUSED_COLOR
____exports.DialogueBox = __TS__Class()
local DialogueBox = ____exports.DialogueBox
DialogueBox.name = "DialogueBox"
__TS__ClassExtends(DialogueBox, Basic)
function DialogueBox.prototype.____constructor(self, text)
    Basic.prototype.____constructor(self)
    self.timer = Timer(nil)
    self._arrow = Images:get("assets/images/ui/arrow.png")
    self.anchorX = 0.5
    self.anchorY = 1
    self._text = ""
    self._idx = 0
    self.speed = 0.02
    self.alpha = 0.9
    self.fullText = text
    self.font = love.graphics.getFont()
    self._backgroundImage = Images:get("assets/images/ui/dialogue-background.png")
    self.width = self._backgroundImage:getWidth()
    self.height = self._backgroundImage:getHeight()
    self.x = main.width / 2
    self.y = main.height - 40
    print(self.width)
    self:typewriter()
end
function DialogueBox.prototype.setSpeakerLeft(self, s)
    if s == nil then
        return
    end
    self.speakerLeft = capitalize(nil, s)
end
function DialogueBox.prototype.setSpeakerRight(self, s)
    if s == nil then
        return
    end
    self.speakerRight = capitalize(nil, s)
end
function DialogueBox.prototype.setCurrentSpeaker(self, s)
    if s == nil then
        return
    end
    self.currentSpeaker = capitalize(nil, s)
end
function DialogueBox.prototype.skip(self)
    self.timer:clear()
    self._idx = #self.fullText
    self._text = self.fullText
end
function DialogueBox.prototype.hasFinished(self)
    return #self._text >= #self.fullText
end
function DialogueBox.prototype.typewriter(self)
    self.timer:clear()
    self.timer:every(
        self.speed,
        function()
            self._idx = self._idx + 1
            self._text = __TS__StringSubstring(self.fullText, 0, self._idx)
            if #self._text >= #self.fullText then
                self.timer:clear()
                return false
            end
        end
    )
end
function DialogueBox.prototype.update(self, dt)
    Basic.prototype.update(self, dt)
    self.timer:update(dt)
end
function DialogueBox.prototype.render(self)
    local padding = 30
    local marginTop = 0
    love.graphics.setFont(self.font)
    local _, lines = self.font:getWrap(self.fullText, self.width - padding * 2)
    setColor(1, 1, 1, self.alpha)
    BACKGROUND_COLOR:apply()
    rectangle(
        "fill",
        self.x - self.width * self.anchorX,
        self.y - self.height * self.anchorY,
        self.width,
        self.height,
        25,
        25
    )
    setColor(1, 1, 1, 1)
    OUTLINE_COLOR:apply()
    setLineWidth(LINE_WIDTH)
    setLineStyle("smooth")
    rectangle(
        "line",
        self.x - self.width * self.anchorX,
        self.y - self.height * self.anchorY,
        self.width,
        self.height,
        25,
        25
    )
    setLineWidth(1)
    setColor(0, 0, 0, 1)
    local y = self.y - self.height + 10
    local remaining = self._idx
    for ____, line in ipairs(lines) do
        if remaining <= 0 then
            break
        end
        local toDraw = __TS__StringSubstring(line, 0, remaining)
        love.graphics.print(toDraw, self.x - self.width / 2 + padding, y + padding + marginTop)
        remaining = remaining - #line
        y = y + self.font:getHeight()
    end
    setColor(1, 1, 1, 1)
    local labelWidth = 200
    local vMargin = 5
    local labelHeight = self.font:getHeight() + vMargin
    local spacing = -labelHeight / 2 + 0
    local xx = self.x - self.width * self.anchorX + 30
    local yy = self.y - self.height * self.anchorY - labelHeight - spacing
    if self.speakerLeft then
        if self.currentSpeaker == self.speakerLeft then
            FOCUSED_COLOR:apply()
        else
            UNFOCUSED_COLOR:apply()
        end
        rectangle(
            "fill",
            xx,
            yy,
            labelWidth,
            labelHeight,
            25,
            25
        )
        OUTLINE_COLOR:apply()
        setLineWidth(LINE_WIDTH)
        setLineStyle("smooth")
        rectangle(
            "line",
            xx,
            yy,
            labelWidth,
            labelHeight,
            25,
            25
        )
        setLineWidth(1)
        love.graphics.print(
            self.speakerLeft,
            xx + labelWidth / 2 - self.font:getWidth(self.speakerLeft) / 2,
            yy + 1
        )
    end
    if self.speakerRight then
        local rx = self.width + labelWidth / 2 - 30
        local ry = self.y - self.height * self.anchorY - labelHeight - spacing
        if self.currentSpeaker == self.speakerRight then
            FOCUSED_COLOR:apply()
        else
            UNFOCUSED_COLOR:apply()
        end
        rectangle(
            "fill",
            rx,
            yy,
            labelWidth,
            labelHeight,
            25,
            25
        )
        OUTLINE_COLOR:apply()
        setLineWidth(LINE_WIDTH)
        setLineStyle("smooth")
        rectangle(
            "line",
            rx,
            yy,
            labelWidth,
            labelHeight,
            25,
            25
        )
        setLineWidth(1)
        love.graphics.print(
            self.speakerRight,
            rx + labelWidth / 2 - self.font:getWidth(self.speakerRight) / 2,
            yy + 1
        )
    end
    if self:hasFinished() then
        draw(
            self._arrow,
            self.x + self.width / 2 - padding * 2,
            self.y - padding * 2 - spacing,
            0,
            1,
            1,
            self._arrow:getWidth() / 2,
            self._arrow:getHeight() / 2
        )
    end
end
return ____exports
