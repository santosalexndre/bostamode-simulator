local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.FlxFlicker = __TS__Class()
local FlxFlicker = ____exports.FlxFlicker
FlxFlicker.name = "FlxFlicker"
function FlxFlicker.prototype.____constructor(self)
end
function FlxFlicker.flicker(self, object, times, rate, after)
    object.timer:every(
        rate,
        function()
            object.visible = not object.visible
        end,
        rate
    )
    if after then
        object.timer:after(times * rate, after)
    end
end
return ____exports
