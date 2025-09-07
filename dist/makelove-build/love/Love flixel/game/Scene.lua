local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local __TS__StringStartsWith = ____lualib.__TS__StringStartsWith
local __TS__ArrayFilter = ____lualib.__TS__ArrayFilter
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local pop = ____love_2Egraphics.pop
local push = ____love_2Egraphics.push
local ____Group = require("bliss.group.Group")
local Group = ____Group.Group
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____Resources = require("bliss.util.Resources")
local Images = ____Resources.Images
local ____json = require("libraries.json.json")
local decode = ____json.decode
local ____Signal = require("bliss.util.Signal")
local Signal = ____Signal.Signal
local Timer = require("libraries.timer")
local ____util = require("game.util")
local handleEffects = ____util.handleEffects
local ____ClickableObject = require("game.ui.ClickableObject")
local ClickableObject = ____ClickableObject.ClickableObject
local ____MusicManager = require("game.MusicManager")
local MusicManager = ____MusicManager.MusicManager
local ____DialogueManager = require("game.dialogue.DialogueManager")
local DialogueManager = ____DialogueManager.DialogueManager
____exports.Scene = __TS__Class()
local Scene = ____exports.Scene
Scene.name = "Scene"
__TS__ClassExtends(Scene, Group)
function Scene.prototype.____constructor(self, path)
    Group.prototype.____constructor(self)
    self.switchRequest = __TS__New(Signal)
    self.dialogues = {}
    self.timer = Timer(nil)
    self.objects = __TS__New(Group)
    self.playerInDialogue = false
    self.whiteShader = love.graphics.newShader("assets/shaders/flash.frag")
    self.coisa = {}
    local file, _ = love.filesystem.read(("assets/data/scenes/" .. path) .. ".json")
    print(file, _)
    local data = decode(file)
    if data.music ~= nil then
        MusicManager:playMusic(data.music)
    end
    if data.background then
        self.background = Images:get(data.background)
    end
    self.manager = __TS__New(DialogueManager)
    self.manager.dialogueStarted:connect(function()
        self:deactivateObjects()
    end)
    self.manager.dialogueEnded:connect(function()
        self:activateObjects()
    end)
    self.manager.switchScene:connect(function(____, s)
        self.switchRequest:emit(s)
    end)
    if data.objects then
        for ____, obj in ipairs(data.objects) do
            local instance = __TS__New(ClickableObject, obj.sprite, obj.position[1], obj.position[2])
            instance.x = instance.x + instance.w / 2
            instance.y = instance.y + instance.h / 2
            instance.type = __TS__StringStartsWith(obj.id, "npc") and "npc" or "object"
            instance:deactivate()
            instance.onButtonReleased:connect(function()
                if not instance:canClick() then
                    return
                end
                if instance.type == "npc" then
                    instance.visible = false
                end
                if obj.dialogue then
                    self.manager:loadScript(obj.dialogue)
                end
                self.manager.dialogueEnded:connect(function()
                    if instance.type == "npc" then
                        instance.visible = true
                    end
                end)
            end)
            self.objects:add(instance)
        end
    end
    if data.start then
        self.manager:loadScript(data.start)
    end
    handleEffects(nil, data.effects, self.timer)
end
function Scene.prototype.deactivateObjects(self)
    self.objects:forEach(function(____, m)
        m.active = false
        return false
    end)
    self.objects:forEach(function(____, m) return m:deactivate() end)
end
function Scene.prototype.activateObjects(self)
    self.objects:forEach(function(____, m) return m:activate() end)
    self.objects:forEach(function(____, m)
        m.active = true
        return true
    end)
end
function Scene.prototype.update(self, dt)
    Group.prototype.update(self, dt)
    self.timer:update(dt)
    self.objects:forEach(function(____, o)
        o.turnoff = false
        return false
    end)
    local hovered = __TS__ArrayFilter(
        self.objects.members,
        function(____, o) return o.hovered end
    )
    do
        local i = 0
        while i < #hovered - 1 do
            local obj = hovered[i + 1]
            obj.turnoff = true
            i = i + 1
        end
    end
    self.objects:update(dt)
    love.graphics.setShader()
    self.manager:update(dt)
end
function Scene.prototype.render(self)
    push()
    if self.background then
        local scale = main.camera.viewport:getScreenScale()
        local w, h = self.background:getDimensions()
        local sw = w / main.width
        local sh = h / main.height
        draw(
            self.background,
            0,
            0,
            0,
            1 / sw,
            1 / sh
        )
    end
    Group.prototype.render(self)
    self.objects:render()
    self.manager:render()
    pop()
end
return ____exports
