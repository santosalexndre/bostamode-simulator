local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local newParticleSystem = ____love_2Egraphics.newParticleSystem
local ____nvec = require("libraries.nvec")
local vec = ____nvec.default
local Timer = require("libraries.timer")
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
local ____Resources = require("bliss.util.Resources")
local SpriteSheets = ____Resources.SpriteSheets
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
____exports.Emitter = __TS__Class()
local Emitter = ____exports.Emitter
Emitter.name = "Emitter"
__TS__ClassExtends(Emitter, Basic)
function Emitter.prototype.____constructor(self, x, y)
    Basic.prototype.____constructor(self)
    self.timer = Timer(nil)
    self.rotation = 0
    self._texture = SpriteSheets:load("images/bola.png", 16, 16)
    local amount = 5
    self._ps = newParticleSystem(self._texture.texture, amount)
    self._ps:setBufferSize(amount)
    self._ps:setSpread(math.pi * 2)
    self._ps:setEmissionArea("ellipse", 0, 0)
    self._ps:setQuads(self._texture.frames)
    self._ps:setColors(__TS__New(Color, "#ff13a48e"))
    self._ps:setParticleLifetime(0.3, 0.5)
    self._ps:setSpeed(-250, 250)
    self._ps:setLinearDamping(3, 5)
    self.position = vec(x, y)
    self._ps:emit(amount)
    self.timer:after(
        4,
        function() return self:kill() end
    )
end
function Emitter.prototype.update(self, dt)
    self.timer:update(dt)
    self._ps:update(dt)
end
function Emitter.prototype.destroy(self)
    Basic.prototype.destroy(self)
    self._ps:release()
end
function Emitter.prototype.render(self)
    draw(self._ps, self.position.x, self.position.y, self.rotation)
end
return ____exports
