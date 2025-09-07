local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.NineSlice = __TS__Class()
local NineSlice = ____exports.NineSlice
NineSlice.name = "NineSlice"
function NineSlice.prototype.____constructor(self, texture, left, right, top, bottom)
    self.texture = texture
    self.left = left
    self.right = right
    self.top = top
    self.bottom = bottom
    error("not implemented yet x-x", 0)
end
function NineSlice.prototype.render(self, x, y, w, h)
end
return ____exports
