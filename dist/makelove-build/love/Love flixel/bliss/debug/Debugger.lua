local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.SimpleDebugger = __TS__Class()
local SimpleDebugger = ____exports.SimpleDebugger
SimpleDebugger.name = "SimpleDebugger"
function SimpleDebugger.prototype.____constructor(self)
end
function SimpleDebugger.register(self, obj, property)
    if ____exports.SimpleDebugger.objects[obj] == nil then
        ____exports.SimpleDebugger.objects[obj] = {}
    end
    local ____exports_SimpleDebugger_objects_obj_0 = ____exports.SimpleDebugger.objects[obj]
    ____exports_SimpleDebugger_objects_obj_0[#____exports_SimpleDebugger_objects_obj_0 + 1] = property
end
function SimpleDebugger.render(self, x, y)
    local yy = y
    local ____opt_1 = love.graphics.getFont()
    local fontHeight = ____opt_1 and ____opt_1:getHeight() or 8
    for obj, props in pairs(____exports.SimpleDebugger.objects) do
        love.graphics.print(
            tostring(obj.constructor.name),
            x,
            yy
        )
        for ____, prop in ipairs(props) do
            yy = yy + fontHeight
            love.graphics.print(
                (string.upper(prop) .. ": ") .. tostring(obj[prop]),
                x + 16,
                yy
            )
        end
    end
end
SimpleDebugger.objects = {}
return ____exports
