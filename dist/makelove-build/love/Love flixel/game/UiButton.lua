local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local rectangle = ____love_2Egraphics.rectangle
local setColor = ____love_2Egraphics.setColor
local ____Button = require("bliss.ui.Button")
local Button = ____Button.Button
local ____nvec = require("libraries.nvec")
local vec = ____nvec.default
____exports.btn = __TS__Class()
local btn = ____exports.btn
btn.name = "btn"
__TS__ClassExtends(btn, Button)
function btn.prototype.____constructor(self, text, onClick)
    Button.prototype.____constructor(self, text, onClick)
    self.bgWidth = 200
    self.bgHeight = 20
    self.label.position = vec(self.x, self.y)
    self.label:anchor(0.5, 0.5)
end
function btn.prototype.update(self, dt)
    Button.prototype.update(self, dt)
end
function btn.prototype.render(self)
    setColor(self.backgroundColor)
    rectangle(
        "fill",
        self.x - self.bgWidth / 2 + self.width / 2,
        self.y - self.bgHeight / 2 + self.height / 2,
        self.bgWidth,
        self.bgHeight
    )
    setColor(1, 1, 1)
    self.label:render()
end
return ____exports
