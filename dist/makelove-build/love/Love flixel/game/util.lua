local ____lualib = require("lualib_bundle")
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local ____exports = {}
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____global = require("game.global")
local globalState = ____global.globalState
____exports.handleEffects = function(____, effects, timer)
    if effects == nil then
        return
    end
    __TS__ArrayForEach(
        effects,
        function(____, effect)
            if effect.shake then
                local shake = effect.shake
                main.camera:shake(shake[1], shake[2], shake[3], shake[4])
                timer:every(
                    0.659340659,
                    function() return main.camera:shake(shake[1], shake[2], shake[3], shake[4]) end
                )
            end
            if effect.set then
                for key, value in pairs(effect.set) do
                    globalState[key] = value
                end
            end
        end
    )
end
return ____exports
