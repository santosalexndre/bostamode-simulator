local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.Animation = __TS__Class()
local Animation = ____exports.Animation
Animation.name = "Animation"
function Animation.prototype.____constructor(self, frameSrc, frames, fps, loop)
    if loop == nil then
        loop = false
    end
    self.frames = frames
    self.fps = fps
    self.frameSrc = frameSrc
    self.loop = loop
end
return ____exports
