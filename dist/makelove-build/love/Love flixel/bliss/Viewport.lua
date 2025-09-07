local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local getColor = ____love_2Egraphics.getColor
local getHeight = ____love_2Egraphics.getHeight
local getWidth = ____love_2Egraphics.getWidth
local newCanvas = ____love_2Egraphics.newCanvas
local pop = ____love_2Egraphics.pop
local push = ____love_2Egraphics.push
local scale = ____love_2Egraphics.scale
local setCanvas = ____love_2Egraphics.setCanvas
local setColor = ____love_2Egraphics.setColor
local setScissor = ____love_2Egraphics.setScissor
local translate = ____love_2Egraphics.translate
local clear = ____love_2Egraphics.clear
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
____exports.ViewportMode = ViewportMode or ({})
____exports.ViewportMode.CanvasItem = 0
____exports.ViewportMode[____exports.ViewportMode.CanvasItem] = "CanvasItem"
____exports.ViewportMode.Viewport = 1
____exports.ViewportMode[____exports.ViewportMode.Viewport] = "Viewport"
____exports.ViewportMode.PixelPerfect = 2
____exports.ViewportMode[____exports.ViewportMode.PixelPerfect] = "PixelPerfect"
____exports.ViewportMode.Disabled = 3
____exports.ViewportMode[____exports.ViewportMode.Disabled] = "Disabled"
____exports.Viewport = __TS__Class()
local Viewport = ____exports.Viewport
Viewport.name = "Viewport"
function Viewport.prototype.____constructor(self, width, height, viewportOptions)
    if viewportOptions == nil then
        viewportOptions = {}
    end
    self.width = 0
    self.height = 0
    self.windowWidth = getWidth()
    self.windowHeight = getHeight()
    self.width = width
    self.height = height
    self.mode = viewportOptions.mode or ____exports.ViewportMode.CanvasItem
    self.bgColor = viewportOptions.bgColor or __TS__New(Color, "#111111ff")
    self.bgImage = viewportOptions.bgImage
    self.bgQuad = viewportOptions.bgQuad
    self.canvas = newCanvas(width, height)
end
function Viewport.prototype.getDimensions(self)
    return self.width, self.height
end
function Viewport.prototype.getWidth(self)
    return self.width
end
function Viewport.prototype.getHeight(self)
    return self.height
end
function Viewport.prototype.attach(self)
    local ratio = self:getScreenScale()
    local offx, offy = self:getScreenOffset()
    if self.mode == ____exports.ViewportMode.Viewport then
        translate(offx, offy)
        setScissor(offx, offy, self.width * ratio, self.height * ratio)
        push()
        scale(ratio, ratio)
        clear(self.bgColor)
    else
        push()
        setCanvas(self.canvas)
        clear(self.bgColor)
    end
end
function Viewport.prototype.detach(self)
    setCanvas()
    setScissor()
    pop()
end
function Viewport.prototype.renderViewport(self)
    local ratio = self:getScreenScale()
    local offx, offy = self:getScreenOffset()
    draw(
        self.canvas,
        offx,
        offy,
        0,
        ratio,
        ratio
    )
end
function Viewport.prototype.renderTo(self, fn)
    local ratio = self:getScreenScale()
    local offx, offy = self:getScreenOffset()
    if self.mode == ____exports.ViewportMode.CanvasItem or self.mode == ____exports.ViewportMode.PixelPerfect then
        setCanvas(self.canvas)
        local r, g, b, a = getColor()
        clear(self.bgColor)
        fn(nil)
        setColor(r, g, b, a)
        setCanvas()
        if self.bgImage then
            draw(
                self.bgImage,
                self.bgQuad,
                0,
                0,
                0,
                ratio,
                ratio,
                0,
                0,
                0,
                0
            )
        end
        draw(
            self.canvas,
            offx,
            offy,
            0,
            ratio,
            ratio
        )
    else
        translate(offx, offy)
        setScissor(offx, offy, self.width * ratio, self.height * ratio)
        push()
        scale(ratio, ratio)
        clear(self.bgColor)
        fn(nil)
        setScissor()
        setColor(1, 1, 1)
        pop()
    end
end
function Viewport.prototype.setBackgroundImage(self)
end
function Viewport.prototype.getMousePosition(self, x, y)
    local ratio = self:getScreenScale()
    local offx, offy = self:getScreenOffset()
    return (x - offx) / ratio, (y - offy) / ratio
end
function Viewport.prototype.setBackgroundColor(self, color)
end
function Viewport.prototype.getScreenScale(self)
    local sx = self.windowWidth / self.width
    local sy = self.windowHeight / self.height
    if self.mode == ____exports.ViewportMode.PixelPerfect then
        sx = math.floor(sx)
        sy = math.floor(sy)
    end
    return math.min(sx, sy)
end
function Viewport.prototype.getScreenOffset(self)
    local ratio = self:getScreenScale()
    local offx = math.max(0, (self.windowWidth - self.width * ratio) / 2)
    local offy = math.max(0, (self.windowHeight - self.height * ratio) / 2)
    return offx, offy
end
function Viewport.prototype.getViewportRect(self)
end
function Viewport.prototype.onResize(self, w, h)
    self.windowWidth = w
    self.windowHeight = h
end
return ____exports
