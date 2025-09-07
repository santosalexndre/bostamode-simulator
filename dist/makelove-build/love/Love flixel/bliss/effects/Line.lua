local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local circle = ____love_2Egraphics.circle
local getLineWidth = ____love_2Egraphics.getLineWidth
local setLineWidth = ____love_2Egraphics.setLineWidth
local line = ____love_2Egraphics.line
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
____exports.LineJointMode = LineJointMode or ({})
____exports.LineJointMode.Round = 0
____exports.LineJointMode[____exports.LineJointMode.Round] = "Round"
____exports.LineJointMode.Flat = 1
____exports.LineJointMode[____exports.LineJointMode.Flat] = "Flat"
____exports.LineCapMode = LineCapMode or ({})
____exports.LineCapMode.Round = 0
____exports.LineCapMode[____exports.LineCapMode.Round] = "Round"
____exports.LineCapMode.Flat = 1
____exports.LineCapMode[____exports.LineCapMode.Flat] = "Flat"
____exports.Line = __TS__Class()
local Line = ____exports.Line
Line.name = "Line"
__TS__ClassExtends(Line, Basic)
function Line.prototype.____constructor(self, ...)
    Basic.prototype.____constructor(self, ...)
    self.points = {}
    self.capMode = ____exports.LineJointMode.Flat
    self.jointMode = ____exports.LineJointMode.Flat
    self.width = 1
    self.maxLength = 30
end
function Line.prototype.addPoint(self, x, y)
    table.insert(self.points, x)
    table.insert(self.points, y)
end
function Line.prototype.length(self)
    return #self.points / 2
end
function Line.prototype.removeFirst(self)
    if #self.points >= 2 then
        table.remove(self.points, 1)
        table.remove(self.points, 1)
    end
end
function Line.prototype.removeLast(self)
    if #self.points >= 2 then
        table.remove(self.points, #self.points)
        table.remove(self.points, #self.points)
    end
end
function Line.prototype.render(self)
    if #self.points < 4 then
        return
    end
    if self.capMode == ____exports.LineJointMode.Round then
        circle("fill", self.points[1], self.points[2], self.width / 2)
        circle("fill", self.points[#self.points - 2 + 1], self.points[#self.points], self.width / 2)
    end
    if self.jointMode == ____exports.LineJointMode.Round then
        do
            local i = 0
            while i < #self.points - 2 do
                circle("fill", self.points[i + 1], self.points[i + 1 + 1], self.width / 2)
                i = i + 2
            end
        end
    end
    local lw = getLineWidth()
    setLineWidth(self.width)
    line(self.points)
    setLineWidth(lw)
end
return ____exports
