local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____Scene = require("game.Scene")
local Scene = ____Scene.Scene
____exports.SceneManager = __TS__Class()
local SceneManager = ____exports.SceneManager
SceneManager.name = "SceneManager"
function SceneManager.prototype.____constructor(self)
end
function SceneManager.switchScene(self, path)
    self.currentScene = __TS__New(Scene, path)
    self.currentScene.switchRequest:connect(function(____, newScene)
        ____exports.SceneManager:switchScene(newScene)
    end)
end
return ____exports
