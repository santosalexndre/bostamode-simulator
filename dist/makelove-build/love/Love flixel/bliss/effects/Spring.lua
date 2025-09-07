local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.Spring = __TS__Class()
local Spring = ____exports.Spring
Spring.name = "Spring"
function Spring.prototype.____constructor(self)
    self.value = 0
    self.tension = 500
    self.damping = 20
    self.target = 0
    self.velocity = 0
end
function Spring.prototype.update(self, dt)
    local a = -self.tension * (self.value - self.target) - self.damping * self.velocity
    self.velocity = self.velocity + a * dt
    self.value = self.value + self.velocity * dt
end
function Spring.prototype.pull(self, force, tension, damp)
    if tension == nil then
        tension = 500
    end
    if damp == nil then
        damp = 20
    end
    self.tension = tension
    self.damping = damp
    self.velocity = self.velocity + force
end
return ____exports
