local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local newQuad = ____love_2Egraphics.newQuad
local draw = ____love_2Egraphics.draw
____exports.ThreeSlice = __TS__Class()
local ThreeSlice = ____exports.ThreeSlice
ThreeSlice.name = "ThreeSlice"
function ThreeSlice.prototype.____constructor(self, image, start, ____end, orientation)
    self.image = image
    self.start = start
    self["end"] = ____end
    self.orientation = orientation
    self.imgWidth = self.image:getWidth()
    self.imgHeight = self.image:getHeight()
    self.quads = self:buildQuads()
end
function ThreeSlice.prototype.buildQuads(self)
    local iw = self.imgWidth
    local ih = self.imgHeight
    if self.orientation == "horizontal" then
        local middleW = iw - self.start - self["end"]
        return {
            newQuad(
                0,
                0,
                self.start,
                ih,
                iw,
                ih
            ),
            newQuad(
                self.start,
                0,
                middleW,
                ih,
                iw,
                ih
            ),
            newQuad(
                iw - self["end"],
                0,
                self["end"],
                ih,
                iw,
                ih
            )
        }
    else
        local middleH = ih - self.start - self["end"]
        return {
            newQuad(
                0,
                0,
                iw,
                self.start,
                iw,
                ih
            ),
            newQuad(
                0,
                self.start,
                iw,
                middleH,
                iw,
                ih
            ),
            newQuad(
                0,
                ih - self["end"],
                iw,
                self["end"],
                iw,
                ih
            )
        }
    end
end
function ThreeSlice.prototype.render(self, x, y, w, h)
    local quads = self.quads
    if self.orientation == "horizontal" then
        local middleW = w - self.start - self["end"]
        local positions = {{x = x, y = y, w = self.start, h = h}, {x = x + self.start, y = y, w = middleW, h = h}, {x = x + self.start + middleW, y = y, w = self["end"], h = h}}
        do
            local i = 0
            while i < 3 do
                local quad = quads[i + 1]
                local pos = positions[i + 1]
                local _, __, qw, qh = quad:getViewport()
                draw(
                    self.image,
                    quad,
                    pos.x,
                    pos.y,
                    0,
                    pos.w / qw,
                    pos.h / qh
                )
                i = i + 1
            end
        end
    else
        local middleH = h - self.start - self["end"]
        local positions = {{x = x, y = y, w = w, h = self.start}, {x = x, y = y + self.start, w = w, h = middleH}, {x = x, y = y + self.start + middleH, w = w, h = self["end"]}}
        do
            local i = 0
            while i < 3 do
                local quad = quads[i + 1]
                local pos = positions[i + 1]
                local _, __, qw, qh = quad:getViewport()
                draw(
                    self.image,
                    quad,
                    pos.x,
                    pos.y,
                    0,
                    pos.w / qw,
                    pos.h / qh
                )
                i = i + 1
            end
        end
    end
end
return ____exports
