local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__ArraySetLength = ____lualib.__TS__ArraySetLength
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local getBlendMode = ____love_2Egraphics.getBlendMode
local setBlendMode = ____love_2Egraphics.setBlendMode
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
local ____Main = require("bliss.Main")
local main = ____Main.main
____exports.Group = __TS__Class()
local Group = ____exports.Group
Group.name = "Group"
__TS__ClassExtends(Group, Basic)
function Group.prototype.____constructor(self, ...)
    Basic.prototype.____constructor(self, ...)
    self.members = {}
    self.blendMode = "alpha"
    self.blendAlphaMode = "alphamultiply"
end
function Group.prototype.add(self, o)
    local ____self_members_0 = self.members
    ____self_members_0[#____self_members_0 + 1] = o
    return o
end
function Group.prototype.count(self)
    return #self.members
end
function Group.prototype.clear(self)
    for ____, m in ipairs(self.members) do
        if m.body then
            main.world:remove(m.body)
        end
    end
    self.members = {}
    __TS__ArraySetLength(self.members, 0)
end
function Group.prototype.forEach(self, callback)
    for ____, m in ipairs(self.members) do
        callback(nil, m)
    end
end
function Group.prototype.forEachAlive(self, callback)
    for ____, m in ipairs(self.members) do
        if not m.dead then
            callback(nil, m)
        end
    end
end
function Group.prototype.update(self, dt)
    Basic.prototype.update(self, dt)
    for ____, m in ipairs(self.members) do
        if m.active then
            m:update(dt)
        end
    end
    for i = #self.members, 1, -1 do
        local m = self.members[i]
        if m.dead then
            if m.body then
                main.world:remove(m.body)
            end
            m:destroy()
            table.remove(self.members, i)
        end
    end
end
function Group.prototype.render(self)
    Basic.prototype.render(self)
    local blendMode, alphaMode = getBlendMode()
    setBlendMode(self.blendMode)
    for ____, m in ipairs(self.members) do
        if m.visible then
            m:render()
        end
    end
    setBlendMode(blendMode, alphaMode)
end
return ____exports
