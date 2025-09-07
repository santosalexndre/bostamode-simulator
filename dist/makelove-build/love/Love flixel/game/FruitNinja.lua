local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____Group = require("bliss.group.Group")
local Group = ____Group.Group
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____Sprite = require("bliss.Sprite")
local Sprite = ____Sprite.Sprite
local ____State = require("bliss.State")
local State = ____State.State
____exports.Cloth = __TS__Class()
local Cloth = ____exports.Cloth
Cloth.name = "Cloth"
__TS__ClassExtends(Cloth, Sprite)
function Cloth.prototype.____constructor(self, x, y, ____type)
    Sprite.prototype.____constructor(self, x, y)
    self.angularVelocity = 0
    self.angularVelocity = love.math.random() * 180 + 180
    self.type = ____type
    if ____type == "girl" then
        self:loadGraphic("images/dress.png")
    else
        self:loadGraphic("images/suit.png")
    end
end
function Cloth.prototype.update(self, dt)
    Sprite.prototype.update(self, dt)
    self.rotation = self.rotation + dt * self.angularVelocity
    local ____self_velocity_0, ____y_1 = self.velocity, "y"
    ____self_velocity_0[____y_1] = ____self_velocity_0[____y_1] + 98 * dt
end
____exports.FruitNinja = __TS__Class()
local FruitNinja = ____exports.FruitNinja
FruitNinja.name = "FruitNinja"
__TS__ClassExtends(FruitNinja, State)
function FruitNinja.prototype.____constructor(self)
    State.prototype.____constructor(self)
    self.main = __TS__New(Group)
    self.timer:script(function(wait)
        do
            while true do
                local rand = love.math.random(1, 2)
                local c = __TS__New(
                    ____exports.Cloth,
                    love.math.random() * (main.width + 400) - 200,
                    main.height,
                    rand == 1 and "girl" or "boy"
                )
                c.velocity.x = love.math.random(-150, 150)
                c.velocity.y = love.math.random(-300, -100)
                self.main:add(c)
                wait(love.math.random() * 1 + 0.2)
            end
        end
    end)
end
function FruitNinja.prototype.update(self, dt)
    State.prototype.update(self, dt)
    self.main:update(dt)
end
function FruitNinja.prototype.render(self)
    State.prototype.render(self)
    main.camera.viewport:renderTo(function()
        main.camera:attach()
        self.main:render()
        main.camera:detach()
    end)
end
return ____exports
