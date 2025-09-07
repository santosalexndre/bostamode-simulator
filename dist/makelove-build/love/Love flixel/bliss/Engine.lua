local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
local ____Input = require("bliss.Input")
local input = ____Input.input
local ____Main = require("bliss.Main")
local main = ____Main.main
____exports.Engine = __TS__Class()
local Engine = ____exports.Engine
Engine.name = "Engine"
function Engine.prototype.____constructor(self)
    love.graphics.setDefaultFilter("linear", "linear")
    love.graphics.setLineStyle("smooth")
    local defaultFont = love.graphics.newFont("assets/fonts/comicneue.ttf", 36)
    defaultFont:setFilter("linear", "linear")
    love.graphics.setFont(defaultFont)
    love.update = function(dt)
        input:update()
        ____exports.Engine.game:update(dt)
    end
    love.draw = function()
        ____exports.Engine.game:render()
    end
    love.keypressed = function(key, scancode, isrepeat)
        if love.keyboard.isDown("lalt") and key == "return" or key == "f" then
            love.window.setFullscreen(not (love.window.getFullscreen()))
        end
    end
    love.keyreleased = function(key, scancode)
    end
    love.resize = function(_w, _h)
        local w, h = love.graphics.getDimensions()
        main.camera.viewport:onResize(w, h)
    end
end
function Engine.prototype.init(self, o)
    ____exports.Engine.game = o
end
return ____exports
