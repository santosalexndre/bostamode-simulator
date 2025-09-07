local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__StringCharAt = ____lualib.__TS__StringCharAt
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local circle = ____love_2Egraphics.circle
local pop = ____love_2Egraphics.pop
local push = ____love_2Egraphics.push
local setColor = ____love_2Egraphics.setColor
local setFont = ____love_2Egraphics.setFont
local translate = ____love_2Egraphics.translate
local ____Entity = require("bliss.Entity")
local Entity = ____Entity.Entity
____exports.StealthMeme = __TS__Class()
local StealthMeme = ____exports.StealthMeme
StealthMeme.name = "StealthMeme"
__TS__ClassExtends(StealthMeme, Entity)
function StealthMeme.prototype.____constructor(self, x, y)
    Entity.prototype.____constructor(self, x, y)
    self.text = "STEALTH INCREASED TO 100"
    self.idx = 0
    self.fadeCount = 16
    self.font = love.graphics.getFont()
    self.timer:every(
        0.04,
        function()
            self.idx = self.idx + 1
            if self.idx > #self.text + self.fadeCount then
                return false
            end
        end
    )
    self.width = self.font:getWidth(self.text)
end
function StealthMeme.prototype.render(self)
    local w = 0
    setFont(self.font)
    local font = love.graphics.getFont()
    local length = #self.text
    push()
    translate(self.position.x - self.width / 2, self.position.y)
    for i = 0, self.idx do
        local char = __TS__StringCharAt(self.text, i)
        local startFade = self.idx - self.fadeCount
        local t = (i - startFade) / (self.fadeCount - 1)
        local alpha = 1 - t
        setColor(1, 1, 1, alpha)
        love.graphics.print(char, w, 10)
        w = w + font:getWidth(char)
    end
    setColor(1, 1, 1)
    pop()
    circle("fill", self.position.x, self.position.y, 2)
end
return ____exports
