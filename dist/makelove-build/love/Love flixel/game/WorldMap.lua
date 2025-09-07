local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____Group = require("bliss.group.Group")
local Group = ____Group.Group
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____State = require("bliss.State")
local State = ____State.State
local ____ClickableObject = require("game.ui.ClickableObject")
local ClickableObject = ____ClickableObject.ClickableObject
local ____SceneManager = require("game.SceneManager")
local SceneManager = ____SceneManager.SceneManager
local ____PlayState = require("game.PlayState")
local PlayState = ____PlayState.PlayState
____exports.WorldMap = __TS__Class()
local WorldMap = ____exports.WorldMap
WorldMap.name = "WorldMap"
__TS__ClassExtends(WorldMap, State)
function WorldMap.prototype.____constructor(self)
    State.prototype.____constructor(self)
    self.main = __TS__New(Group)
end
function WorldMap.prototype.enter(self)
    State.prototype.enter(self)
    local location = __TS__New(ClickableObject, "assets/images/dress.png", 100, 100)
    location.onButtonReleased:connect(function()
        main:switchState(PlayState)
        SceneManager:switchScene("bedroom1")
    end)
    self.main:add(location)
end
function WorldMap.prototype.update(self, dt)
    State.prototype.update(self, dt)
    self.main:update(dt)
end
function WorldMap.prototype.render(self)
    State.prototype.render(self)
    main.camera.viewport:renderTo(function()
        main.camera:attach()
        self.main:render()
        main.camera:detach()
    end)
end
return ____exports
