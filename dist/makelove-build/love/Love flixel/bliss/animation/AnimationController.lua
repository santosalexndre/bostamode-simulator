local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____Signal = require("bliss.util.Signal")
local Signal = ____Signal.Signal
local ____Resources = require("bliss.util.Resources")
local Animations = ____Resources.Animations
____exports.AnimationController = __TS__Class()
local AnimationController = ____exports.AnimationController
AnimationController.name = "AnimationController"
function AnimationController.prototype.____constructor(self)
    self._timer = 0
    self.playing = false
    self.loop = false
    self.loopCount = 0
    self.speed = 1
    self.animationFinished = __TS__New(Signal)
    self.animationLooped = __TS__New(Signal)
    self.animationChanged = __TS__New(Signal)
    self.path = ""
end
function AnimationController.prototype.setPath(self, path)
    self.path = path
end
function AnimationController.prototype.play(self, animation)
    if self.currentAnimation == animation then
        return
    end
    self.currentAnimation = animation
    self._current = Animations:get(self.path .. animation)
    self._animationLength = #self._current.frames
    self._texture = self._current.frameSrc.texture
    self.playing = true
    self.frameIndex = 0
    self.loop = self._current.loop
    local frame = self._current.frames[self.frameIndex + 1]
    self._currentQuad = self._current.frameSrc.frames[frame + 1]
    self.animationChanged:emit(self.currentAnimation)
end
function AnimationController.prototype.stop(self)
    self.playing = false
end
function AnimationController.prototype.update(self, dt)
    if not self.playing then
        return
    end
    self._timer = self._timer + dt * self.speed
    if self._timer > 1 / self._current.fps then
        self._timer = 0
        if self.frameIndex >= self._animationLength - 1 then
            if self.loop then
                self.frameIndex = 0
                self.loopCount = self.loopCount + 1
                self.animationLooped:emit(self.loopCount)
            else
                self.animationFinished:emit(self.currentAnimation)
            end
        else
            self.frameIndex = self.frameIndex + 1
        end
        local frame = self._current.frames[self.frameIndex + 1]
        self._currentQuad = self._current.frameSrc.frames[frame + 1]
    end
end
return ____exports
