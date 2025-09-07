local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____nvec = require("libraries.nvec")
local vec = ____nvec.default
local Timer = require("libraries.timer")
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
local ____Main = require("bliss.Main")
local main = ____Main.main
____exports.Entity = __TS__Class()
local Entity = ____exports.Entity
Entity.name = "Entity"
__TS__ClassExtends(Entity, Basic)
function Entity.prototype.____constructor(self, x, y)
    if x == nil then
        x = 0
    end
    if y == nil then
        y = 0
    end
    Basic.prototype.____constructor(self)
    self.scale = vec(1, 1)
    self.rotation = 0
    self.velocity = vec(0, 0)
    self.alpha = 1
    self._anchorX = 0.5
    self._anchorY = 0.5
    self._anchorOffsetX = 0
    self._anchorOffsetY = 0
    self.width = 0
    self.height = 0
    self.top = 0
    self.left = 0
    self.right = 0
    self.bottom = 0
    self._hitboxOffsetX = 0
    self._hitboxOffsetY = 0
    self._filters = {}
    self.ignoreCollision = false
    self.timer = Timer(nil)
    self.lifetime = 0
    self.tag = self.tag or string.lower(self.constructor.name)
    self.position = vec(x, y)
end
function Entity.prototype.update(self, dt)
    self.timer:update(dt)
    self.lifetime = self.lifetime + dt
    self:move(dt)
end
function Entity.prototype.anchor(self, x, y)
    self._anchorX = x
    self._anchorY = y
end
function Entity.prototype.setCollisionFilters(self, filter)
    if not ____exports.Entity.filterDefs[self.constructor.name] then
        ____exports.Entity.filterDefs[self.constructor.name] = filter
    end
    self._filters = ____exports.Entity.filterDefs[self.constructor.name]
end
function Entity.filterFn(item, other)
    if item.ignoreCollision then
        return nil
    end
    return item._filters[other.tag]
end
function Entity.prototype.setHitbox(self, top, left, right, bottom)
    local width = right - left
    local height = bottom - top
    self.width = width
    self.height = height
    self.top = top
    self.left = left
    self.right = right
    self.bottom = bottom
    self.body = main.world:add(
        self,
        self.position.x,
        self.position.y,
        self.width,
        self.height
    )
    return self
end
function Entity.prototype.move(self, dt)
    local dx = self.velocity.x
    local dy = self.velocity.y
    if self.velocity == vec.zero then
        return
    end
    if self.body then
        local world = main.world
        local bx, by, cols, len = world:move(self, self.position.x + self.left + self._hitboxOffsetX + dx * dt, self.position.y + self.top + self._hitboxOffsetY + dy * dt, ____exports.Entity.filterFn)
        self.position.x = bx - self.left - self._hitboxOffsetX
        self.position.y = by - self.top - self._hitboxOffsetY
        if len > 0 then
            for ____, col in ipairs(cols) do
                col.tags = col.tags
                self:onCollision(col)
            end
        end
    else
        local ____self_position_0, ____x_1 = self.position, "x"
        ____self_position_0[____x_1] = ____self_position_0[____x_1] + dx * dt
        local ____self_position_2, ____y_3 = self.position, "y"
        ____self_position_2[____y_3] = ____self_position_2[____y_3] + dy * dt
    end
end
function Entity.prototype.onCollision(self, col)
end
Entity.filterDefs = {}
return ____exports
