local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__StringCharAt = ____lualib.__TS__StringCharAt
local ____exports = {}
local ____Animation = require("bliss.animation.Animation")
local Animation = ____Animation.Animation
local ____FrameCollection = require("bliss.animation.FrameCollection")
local FrameCollection = ____FrameCollection.FrameCollection
____exports.Images = __TS__Class()
local Images = ____exports.Images
Images.name = "Images"
function Images.prototype.____constructor(self)
end
function Images.get(self, path)
    local cache = ____exports.Images.cache[path]
    if cache ~= nil then
        return cache
    else
        local img = love.graphics.newImage(path)
        ____exports.Images.cache[path] = img
        return img
    end
end
Images.cache = {}
____exports.SpriteSheets = __TS__Class()
local SpriteSheets = ____exports.SpriteSheets
SpriteSheets.name = "SpriteSheets"
function SpriteSheets.prototype.____constructor(self)
end
function SpriteSheets.load(self, path, frameWidth, frameHeight)
    if frameWidth == nil or frameHeight == nil then
        local res = ____exports.SpriteSheets.cache[path]
        if res == nil then
            error(("SpriteSheet " .. path) .. " not found", 0)
        end
        return res
    end
    if not (____exports.SpriteSheets.cache[path] ~= nil) then
        ____exports.SpriteSheets.cache[path] = __TS__New(
            FrameCollection,
            ____exports.Images:get(path),
            frameWidth,
            frameHeight
        )
    end
    return ____exports.SpriteSheets.cache[path]
end
SpriteSheets.cache = {}
____exports.Animations = __TS__Class()
local Animations = ____exports.Animations
Animations.name = "Animations"
function Animations.prototype.____constructor(self)
end
function Animations.get(self, name)
    if not (self.cache[name] ~= nil) then
        error(("Animation " .. name) .. " not found", 0)
    end
    return ____exports.Animations.cache[name]
end
function Animations.load(self, animationName, frameSrc, frames, fps, loop)
    if loop == nil then
        loop = false
    end
    ____exports.Animations.cache[animationName] = __TS__New(
        Animation,
        frameSrc,
        frames,
        fps,
        loop
    )
end
Animations.cache = {}
____exports.Fonts = __TS__Class()
local Fonts = ____exports.Fonts
Fonts.name = "Fonts"
function Fonts.prototype.____constructor(self)
end
function Fonts.get(self, path, size)
    if size == nil then
        size = 12
    end
    local pathname = (path .. "-") .. tostring(size)
    local res = self.cache[pathname]
    if not res then
        error(("Font " .. pathname) .. " not found", 0)
    end
    return res
end
function Fonts.load(self, name, path, b)
    if type(b) == "number" then
        local pathname = (name .. "-") .. tostring(b)
        local res = love.graphics.newFont(path, b)
        self.cache[pathname] = res
    else
        local pathname = name .. "-12"
        local res = love.graphics.newImageFont(path, b)
        self.cache[pathname] = res
    end
end
function Fonts.loadMonospaceBitmap(self, name, path, width, height, glyphs)
    local font = ____exports.Fonts:createFromMonospaceBitmap(
        name,
        path,
        width,
        height,
        glyphs
    )
    self.cache[name .. "-12"] = font
end
function Fonts.createFromMonospaceBitmap(self, name, path, width, height, glyphs)
    local image = love.graphics.newImage(path)
    local chars = #glyphs
    local w = chars * (width + 1) + 1
    local canvas = love.graphics.newCanvas(w, height)
    local vs = image:getWidth() / width
    local hs = image:getHeight() / height
    local count = 0
    canvas:renderTo(function()
        love.graphics.setColor(1, 0, 0)
        love.graphics.line(1, 0, 1, height)
        love.graphics.setColor(1, 1, 1)
        love.graphics.push()
        love.graphics.translate(1, 0)
        do
            local y = 0
            while y < hs do
                do
                    local x = 0
                    while x < vs do
                        local char = __TS__StringCharAt(glyphs, count)
                        local quad = love.graphics.newQuad(
                            x * width,
                            y * height,
                            width,
                            height,
                            image:getWidth(),
                            image:getHeight()
                        )
                        love.graphics.draw(image, quad, count * (width + 1), 0)
                        love.graphics.setColor(1, 0, 0)
                        local lx = (count + 1) * (width + 1)
                        love.graphics.line(lx, 0, lx, height)
                        love.graphics.setColor(1, 1, 1)
                        count = count + 1
                        x = x + 1
                    end
                end
                y = y + 1
            end
        end
        love.graphics.pop()
    end)
    return love.graphics.newImageFont(
        canvas:newImageData(),
        glyphs
    )
end
Fonts.cache = {}
return ____exports
