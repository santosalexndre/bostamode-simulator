local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local newQuad = ____love_2Egraphics.newQuad
____exports.NineSlice = __TS__Class()
local NineSlice = ____exports.NineSlice
NineSlice.name = "NineSlice"
function NineSlice.prototype.____constructor(self, image, left, top, right, bottom)
    self.image = image
    self.left = left
    self.top = top
    self.right = right
    self.bottom = bottom
    self.imgWidth = self.image:getWidth()
    self.imgHeight = self.image:getHeight()
    self.quads = self:buildQuads()
end
function NineSlice.prototype.buildQuads(self)
    local iw = self.imgWidth
    local ih = self.imgHeight
    local l = self.left
    local r = self.right
    local t = self.top
    local b = self.bottom
    local middleW = iw - l - r
    local middleH = ih - t - b
    return {
        {
            newQuad(
                0,
                0,
                l,
                t,
                iw,
                ih
            ),
            newQuad(
                l,
                0,
                middleW,
                t,
                iw,
                ih
            ),
            newQuad(
                iw - r,
                0,
                r,
                t,
                iw,
                ih
            )
        },
        {
            newQuad(
                0,
                t,
                l,
                middleH,
                iw,
                ih
            ),
            newQuad(
                l,
                t,
                middleW,
                middleH,
                iw,
                ih
            ),
            newQuad(
                iw - r,
                t,
                r,
                middleH,
                iw,
                ih
            )
        },
        {
            newQuad(
                0,
                ih - b,
                l,
                b,
                iw,
                ih
            ),
            newQuad(
                l,
                ih - b,
                middleW,
                b,
                iw,
                ih
            ),
            newQuad(
                iw - r,
                ih - b,
                r,
                b,
                iw,
                ih
            )
        }
    }
end
function NineSlice.prototype.render(self, x, y, w, h)
    local l = self.left
    local r = self.right
    local t = self.top
    local b = self.bottom
    local middleW = w - l - r
    local middleH = h - t - b
    local positions = {{{x = x, y = y, w = l, h = t}, {x = x + l, y = y, w = middleW, h = t}, {x = x + l + middleW, y = y, w = r, h = t}}, {{x = x, y = y + t, w = l, h = middleH}, {x = x + l, y = y + t, w = middleW, h = middleH}, {x = x + l + middleW, y = y + t, w = r, h = middleH}}, {{x = x, y = y + t + middleH, w = l, h = b}, {x = x + l, y = y + t + middleH, w = middleW, h = b}, {x = x + l + middleW, y = y + t + middleH, w = r, h = b}}}
    do
        local row = 0
        while row < 3 do
            do
                local col = 0
                while col < 3 do
                    local quad = self.quads[row + 1][col + 1]
                    local pos = positions[row + 1][col + 1]
                    draw(
                        self.image,
                        quad,
                        pos.x,
                        pos.y,
                        0,
                        pos.w / select(
                            3,
                            quad:getViewport()
                        ),
                        pos.h / select(
                            4,
                            quad:getViewport()
                        )
                    )
                    col = col + 1
                end
            end
            row = row + 1
        end
    end
end
return ____exports
