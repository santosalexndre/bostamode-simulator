local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local newQuad = ____love_2Egraphics.newQuad
--- TODO: Im not really using this the same way as before so is hould probalbly
-- clean this up a bit, like, remove the texture field adn other redudant information
____exports.FrameCollection = __TS__Class()
local FrameCollection = ____exports.FrameCollection
FrameCollection.name = "FrameCollection"
function FrameCollection.prototype.____constructor(self, texture, width, height)
    self.frames = {}
    local w, h = texture:getDimensions()
    local vslices = math.ceil(w / width)
    local hslices = math.ceil(h / height)
    local fw = width
    local fh = height
    do
        local y = 0
        while y < hslices do
            do
                local x = 0
                while x < vslices do
                    local ____self_frames_0 = self.frames
                    ____self_frames_0[#____self_frames_0 + 1] = newQuad(
                        x * fw,
                        y * fh,
                        fw,
                        fh,
                        w,
                        h
                    )
                    x = x + 1
                end
            end
            y = y + 1
        end
    end
    self.texture = texture
    self.frameWidth = fw
    self.frameHeight = fh
end
function FrameCollection.prototype.getDimensions(self)
    return self.frameWidth, self.frameHeight
end
return ____exports
