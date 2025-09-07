local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____Camera = require("bliss.Camera")
local Camera = ____Camera.Camera
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____Viewport = require("bliss.Viewport")
local ViewportMode = ____Viewport.ViewportMode
____exports.Game = __TS__Class()
local Game = ____exports.Game
Game.name = "Game"
function Game.prototype.____constructor(self, initial, width, height, viewportMode)
    if width == nil then
        width = 320
    end
    if height == nil then
        height = 240
    end
    if viewportMode == nil then
        viewportMode = ViewportMode.CanvasItem
    end
    main.width = width
    main.height = height
    main.camera = __TS__New(Camera, width, height, viewportMode)
    main.switchStateEvent:connect(function(____, state) return self:switchState(state) end)
    self:switchState(initial)
end
function Game.prototype.switchState(self, state)
    local s = __TS__New(state)
    s:enter()
    self.state = s
end
function Game.prototype.update(self, dt)
    local mx, my = love.mouse.getPosition()
    local smx, smy = main.camera.viewport:getMousePosition(mx, my)
    local gmx, gmy = main.camera:toWorldCoords(smx, smy)
    main.mouse.windowX = mx
    main.mouse.windowY = my
    main.mouse.viewportX = smx
    main.mouse.viewportY = smy
    main.mouse.x = gmx
    main.mouse.y = gmy
    self.state:update(dt)
    main.camera:update(dt)
end
function Game.prototype.render(self)
    self.state:render()
end
return ____exports
