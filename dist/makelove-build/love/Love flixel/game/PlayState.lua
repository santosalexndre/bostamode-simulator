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
local ____Input = require("bliss.Input")
local input = ____Input.input
local ____SceneManager = require("game.SceneManager")
local SceneManager = ____SceneManager.SceneManager
local ____PauseMenu = require("game.states.PauseMenu")
local PauseMenu = ____PauseMenu.PauseMenu
____exports.PlayState = __TS__Class()
local PlayState = ____exports.PlayState
PlayState.name = "PlayState"
__TS__ClassExtends(PlayState, State)
function PlayState.prototype.____constructor(self, ...)
    State.prototype.____constructor(self, ...)
    self.main = __TS__New(Group)
    self.ui = __TS__New(Group)
    self.particles = __TS__New(Group)
    self.props = __TS__New(Group)
    self.paused = false
end
function PlayState.prototype.enter(self)
end
function PlayState.prototype.update(self, dt)
    self.main:update(dt)
    if self.paused then
        self.pauseScene:update(dt)
    else
        local ____opt_0 = SceneManager.currentScene
        if ____opt_0 ~= nil then
            ____opt_0:update(dt)
        end
        if input:pressed("fire2") then
            self:pause()
        end
    end
end
function PlayState.prototype.pause(self)
    self.paused = true
    self.pauseScene = __TS__New(PauseMenu)
    self.pauseScene:enter()
    self.pauseScene.onClose:connect(function()
        self.paused = false
        self.pauseScene = nil
        print("OI")
    end)
end
function PlayState.prototype.render(self)
    State.prototype.render(self)
    main.camera.viewport:renderTo(function()
        main.camera:attach()
        self.main:render()
        if self.paused then
            self.pauseScene:render()
        else
            local ____opt_2 = SceneManager.currentScene
            if ____opt_2 ~= nil then
                ____opt_2:render()
            end
        end
        self.particles:render()
        self.props:render()
        main.camera:detach()
        self.ui:render()
    end)
end
return ____exports
