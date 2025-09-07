local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local __TS__ArraySplice = ____lualib.__TS__ArraySplice
local __TS__StringIncludes = ____lualib.__TS__StringIncludes
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local pop = ____love_2Egraphics.pop
local push = ____love_2Egraphics.push
local scale = ____love_2Egraphics.scale
local translate = ____love_2Egraphics.translate
local rotate = ____love_2Egraphics.rotate
local ____Viewport = require("bliss.Viewport")
local Viewport = ____Viewport.Viewport
local ViewportMode = ____Viewport.ViewportMode
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
local ____Entity = require("bliss.Entity")
local Entity = ____Entity.Entity
local ____mathx = require("libraries.mathx")
local clamp = ____mathx.clamp
local function lerp(self, a, b, t)
    return a + (b - a) * t
end
local function csnap(self, v, x)
    return math.ceil(v / x) * x - x / 2
end
local Shake = __TS__Class()
Shake.name = "Shake"
function Shake.prototype.____constructor(self, amplitude, duration, frequency)
    self.amplitude = amplitude
    self.duration = duration
    self.frequency = frequency
    self.samples = {}
    self.startTime = love.timer.getTime() * 1000
    self.t = 0
    self.shaking = true
    local sample_count = duration / 1000 * frequency
    for i = 1, sample_count do
        local ____self_samples_0 = self.samples
        ____self_samples_0[#____self_samples_0 + 1] = 2 * love.math.random() - 1
    end
end
function Shake.prototype.update(self, dt)
    self.t = love.timer.getTime() * 1000 - self.startTime
    if self.t > self.duration then
        self.shaking = false
    end
end
function Shake.prototype.shakeNoise(self, s)
    if s >= #self.samples then
        return 0
    end
    return self.samples[s + 1] or 0
end
function Shake.prototype.shakeDecay(self, t)
    if t > self.duration then
        return 0
    end
    return (self.duration - t) / self.duration
end
function Shake.prototype.getShakeAmplitude(self, t)
    if not t then
        if not self.shaking then
            return 0
        end
        t = self.t
    end
    local s = t / 1000 * self.frequency
    local s0 = math.floor(s)
    local s1 = s0 + 1
    local k = self:shakeDecay(t)
    return self.amplitude * (self:shakeNoise(s0) + (s - s0) * (self:shakeNoise(s1) - self:shakeNoise(s0))) * k
end
____exports.Camera = __TS__Class()
local Camera = ____exports.Camera
Camera.name = "Camera"
__TS__ClassExtends(Camera, Basic)
function Camera.prototype.____constructor(self, width, height, viewportMode)
    Basic.prototype.____constructor(self)
    self.x = 0
    self.y = 0
    self.scale = 1
    self.rotation = 0
    self.lerpAmount = 0.6
    self.targetX = 0
    self.targetY = 0
    self.scrollFactorX = 1
    self.scrollFactorY = 1
    self.offsetX = 0
    self.offsetY = 0
    self.horizontalShakes = {}
    self.verticalShakes = {}
    self.lastHorizontalShakeAmount = 0
    self.lastVerticalShakeAmount = 0
    self.deadzone = false
    self.deadzoneX = 0
    self.deadzoneY = 0
    self.deadzoneW = 0
    self.deadzoneH = 0
    self.drawDeadzone = false
    print("ola cmaera")
    self.width = width
    self.height = height
    self.viewport = __TS__New(Viewport, width, height, {mode = viewportMode or ViewportMode.CanvasItem})
    self.x = self.width / 2
    self.y = self.height / 2
end
function Camera.prototype.onResize(self, x, y)
    self.viewport:onResize(x, y)
end
function Camera.prototype.update(self, dt)
    local horizontalShakeAmount = 0
    local verticalShakeAmount = 0
    do
        local i = #self.horizontalShakes - 1
        while i >= 0 do
            self.horizontalShakes[i + 1]:update(dt)
            horizontalShakeAmount = horizontalShakeAmount + self.horizontalShakes[i + 1]:getShakeAmplitude()
            if not self.horizontalShakes[i + 1].shaking then
                __TS__ArraySplice(self.horizontalShakes, i, 1)
            end
            i = i - 1
        end
    end
    do
        local i = #self.verticalShakes - 1
        while i >= 0 do
            self.verticalShakes[i + 1]:update(dt)
            verticalShakeAmount = verticalShakeAmount + self.verticalShakes[i + 1]:getShakeAmplitude()
            if not self.verticalShakes[i + 1].shaking then
                __TS__ArraySplice(self.verticalShakes, i, 1)
            end
            i = i - 1
        end
    end
    self.offsetX = self.offsetX - self.lastHorizontalShakeAmount
    self.offsetY = self.offsetY - self.lastVerticalShakeAmount
    self.offsetX = self.offsetX + horizontalShakeAmount
    self.offsetY = self.offsetY + verticalShakeAmount
    self.lastHorizontalShakeAmount = horizontalShakeAmount
    self.lastVerticalShakeAmount = verticalShakeAmount
    if self.target ~= nil then
        self.targetX = self.target.position.x
        self.targetY = self.target.position.y
        self.x = self.targetX
        self.y = self.targetY
    end
    if not self.deadzone then
        return
    end
    self.x = clamp(self.x, self.deadzoneX + self.width / 2, self.deadzoneW - self.width / 2)
    self.y = clamp(self.y, self.deadzoneY + self.height / 2, self.deadzoneH - self.height / 2)
end
function Camera.prototype.follow(self, x, y)
    self.target = __TS__New(Entity)
    self.targetX = x
    self.targetY = y
end
function Camera.prototype.setDeadzone(self, x, y, w, h)
    self.deadzone = true
    self.deadzoneX = x
    self.deadzoneY = y
    self.deadzoneW = w
    self.deadzoneH = h
end
function Camera.prototype.move(self, dx, dy)
    self.x = self.x + dx
    self.y = self.y + dy
end
function Camera.prototype.setTarget(self, target)
    self.target = target
end
function Camera.prototype.attach(self)
    push()
    translate(self.width / 2 + self.offsetX, self.height / 2 + self.offsetY)
    scale(self.scale)
    rotate(self.rotation)
    translate((-self.x + self.offsetX) * self.scrollFactorX, (-self.y + self.offsetY) * self.scrollFactorY)
end
function Camera.prototype.detach(self)
    pop()
end
function Camera.prototype.checkVisibility(self, obj)
    local left = self.x - self.width / 2
    local right = self.x + self.width / 2
    local top = self.y - self.height / 2
    local bottom = self.y + self.height / 2
    local visible = obj.position.x + obj.width > left and obj.position.x < right and obj.position.y + obj.height > top and obj.position.y < bottom
    return visible
end
function Camera.prototype.toWorldCoords(self, x, y)
    local c = math.cos(self.rotation)
    local s = math.sin(self.rotation)
    local dx = (x - self.width / 2) / self.scale
    local dy = (y - self.height / 2) / self.scale
    local rx = c * dx + s * dy
    local ry = -s * dx + c * dy
    return rx + self.x, ry + self.y
end
function Camera.prototype.toCameraCoords(self, x, y)
    local c = math.cos(self.rotation)
    local s = math.sin(self.rotation)
    local dx = x - self.x
    local dy = y - self.y
    local rx = c * dx - s * dy
    local ry = s * dx + c * dy
    return rx * self.scale + self.width / 2, ry * self.scale + self.height / 2
end
function Camera.prototype.getMousePosition(self)
    local x, y = love.mouse.getPosition()
    local mx, my = self.viewport:getMousePosition(x, y)
    return {self:toWorldCoords(mx, my)}
end
function Camera.prototype.shake(self, intensity, duration, frequency, axes)
    if axes == nil then
        axes = "XY"
    end
    if not axes then
        axes = "XY"
    end
    axes = string.upper(axes)
    if __TS__StringIncludes(axes, "X") then
        table.insert(
            self.horizontalShakes,
            __TS__New(Shake, intensity, duration * 1000, frequency)
        )
    end
    if __TS__StringIncludes(axes, "Y") then
        table.insert(
            self.verticalShakes,
            __TS__New(Shake, intensity, duration * 1000, frequency)
        )
    end
end
return ____exports
