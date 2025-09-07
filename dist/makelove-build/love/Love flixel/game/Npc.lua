local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local pop = ____love_2Egraphics.pop
local push = ____love_2Egraphics.push
local scale = ____love_2Egraphics.scale
local translate = ____love_2Egraphics.translate
local ____Sprite = require("bliss.Sprite")
local Sprite = ____Sprite.Sprite
____exports.Npc = __TS__Class()
local Npc = ____exports.Npc
Npc.name = "Npc"
__TS__ClassExtends(Npc, Sprite)
function Npc.prototype.____constructor(self, x, y)
    Sprite.prototype.____constructor(self, x, y)
    self.state = "wander"
    self.dir = 1
    self.wanderTime = 1
    self.idleTime = 1
    self.animation:play("girl/idle")
    self:setHitbox(0, 0, 32, 128)
    self.polygon = {
        0,
        5,
        0,
        -5,
        150,
        -40,
        150,
        40
    }
end
function Npc.prototype.update(self, dt)
    Sprite.prototype.update(self, dt)
    if self.state == "wander" then
        self.wanderTime = self.wanderTime - dt
        self.velocity.x = self.dir * 100
        if self.wanderTime < 0 then
            self.state = "idle"
            self.idleTime = love.math.random() * 1 + 1
            self.flipX = self.dir
        end
    elseif self.state == "idle" then
        self.idleTime = self.idleTime - dt
        self.velocity.x = 0
        if self.idleTime < 0 then
            self.state = "wander"
            self.wanderTime = love.math.random() * 1 + 1
            self.dir = self.dir * -1
            self.flipX = self.dir
        end
    end
end
function Npc.prototype.render(self)
    Sprite.prototype.render(self)
    push()
    translate(self.position.x, self.position.y - self.height / 2 + 15)
    scale(self.flipX, 1)
    love.graphics.setColor(1, 0, 0, 0.2)
    love.graphics.polygon("fill", self.polygon)
    love.graphics.setColor(1, 1, 1)
    pop()
end
return ____exports
