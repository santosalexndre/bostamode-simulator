local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local setLineWidth = ____love_2Egraphics.setLineWidth
local setColor = ____love_2Egraphics.setColor
local line = ____love_2Egraphics.line
local ____Entity = require("bliss.Entity")
local Entity = ____Entity.Entity
____exports.Trail = __TS__Class()
local Trail = ____exports.Trail
Trail.name = "Trail"
__TS__ClassExtends(Trail, Entity)
function Trail.prototype.____constructor(self, parent)
    Entity.prototype.____constructor(self, parent.position.x, parent.position.y)
    self.points = {}
    self.maxLength = 30
    self.trailDuration = 1
    self.trailMaxWidth = 8
    self.updateRate = 1 / 60
    self.updateTimer = 0
    self.trailTimer = 0
    self.parent = parent
end
function Trail.prototype.update(self, dt)
    Entity.prototype.update(self, dt)
    self.position = self.parent.position
    if #self.points > 2 then
        self.trailTimer = self.trailTimer + dt
        while self.trailTimer > self.trailDuration do
            self.trailTimer = self.trailTimer - self.trailDuration
            self.points[#self.points] = nil
            self.points[#self.points] = nil
        end
    end
    table.insert(self.points, 1, self.y)
    table.insert(self.points, 1, self.x)
    if #self.points > self.maxLength * 2 then
        do
            local i = #self.points
            while i >= self.maxLength * 2 + 1 do
                self.points[i] = nil
                i = i - 1
            end
        end
    end
end
function Trail.prototype.getTrailWidth(self, i)
    return (#self.points - (i + 1)) / #self.points
end
function Trail.prototype.render(self)
    Entity.prototype.render(self)
    if self.points[1] then
        local w = self.trailMaxWidth * self:getTrailWidth(1)
    end
    do
        local i = #self.points - 1
        while i >= 3 do
            local c = self:getTrailWidth(i)
            local w = self.trailMaxWidth * c
            setLineWidth(w)
            setColor(c, c, c)
            line(self.points[i - 2], self.points[i - 1], self.points[i], self.points[i + 1])
            i = i - 2
        end
    end
    setLineWidth(1)
    setColor(1, 1, 1)
end
return ____exports
