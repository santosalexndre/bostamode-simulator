local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____Input = require("bliss.Input")
local input = ____Input.input
local ____Sprite = require("bliss.Sprite")
local Sprite = ____Sprite.Sprite
____exports.Player = __TS__Class()
local Player = ____exports.Player
Player.name = "Player"
__TS__ClassExtends(Player, Sprite)
function Player.prototype.____constructor(self, x, y, state)
    Sprite.prototype.____constructor(self, x, y)
    self.state = state
    self.moving = false
    self.rot = 0
    self.inDialogue = false
    self.hiding = false
    self:setHitbox(0, 0, 64, 70)
    self.animation:setPath("girl/")
    self.animation:play("idle")
end
function Player.prototype.update(self, dt)
    Sprite.prototype.update(self, dt)
    if self.state.props:count() > 0 then
        local closest = self.state.props.members[1]
        local cdist = closest.position:dist2(self.position)
        for ____, prop in ipairs(self.state.props.members) do
            local dist = prop.position:dist2(self.position)
            if dist < 16 * 16 then
                if dist < cdist then
                    closest = prop
                    cdist = dist
                end
            end
            prop.playerNearby = false
        end
        if cdist < 16 * 16 then
            self.closestProp = closest
            self.closestProp.playerNearby = true
        end
    end
    if self.closestProp ~= nil then
        if input:pressed("interact") then
            if self.hiding then
                self:unhide()
            elseif self.closestProp.interactMode == "dialogue" then
                self.closestProp:showDialogue()
                self.velocity.x = 0
                self.inDialogue = true
            elseif self.closestProp.interactMode == "hide" then
                self:hide()
            end
        end
    end
    self:handleMovement(dt)
    self.closestProp = nil
end
function Player.prototype.hide(self)
    self.animation:play("hide")
    self.position = self.closestProp.position:clone()
    self.velocity.x = 0
    self.hiding = true
end
function Player.prototype.unhide(self)
    self.animation:play("idle")
    self.hiding = false
end
function Player.prototype.handleMovement(self, dt)
    if self.hiding or self.inDialogue then
        return
    end
    local dx = 0
    local dy = 0
    if input:down("left") then
        dx = dx - 1
    end
    if input:down("right") then
        dx = dx + 1
    end
    if input:down("down") then
        dy = dy + 1
    end
    if input:down("up") then
        dy = dy - 1
    end
    self.velocity.x = dx * 60
end
function Player.prototype.render(self)
    Sprite.prototype.render(self)
end
function Player.prototype.onCollision(self, col)
end
return ____exports
