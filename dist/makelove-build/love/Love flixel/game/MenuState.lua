local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____Camera = require("bliss.Camera")
local Camera = ____Camera.Camera
local ____Group = require("bliss.group.Group")
local Group = ____Group.Group
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____State = require("bliss.State")
local State = ____State.State
local ____Label = require("bliss.ui.Label")
local Label = ____Label.Label
local OutlineMode = ____Label.OutlineMode
local ____nvec = require("libraries.nvec")
local vec = ____nvec.default
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
local ____Button = require("bliss.ui.Button")
local Button = ____Button.Button
local ____PlayState = require("game.PlayState")
local PlayState = ____PlayState.PlayState
local ____SceneManager = require("game.SceneManager")
local SceneManager = ____SceneManager.SceneManager
____exports.MenuState = __TS__Class()
local MenuState = ____exports.MenuState
MenuState.name = "MenuState"
__TS__ClassExtends(MenuState, State)
function MenuState.prototype.____constructor(self, ...)
    State.prototype.____constructor(self, ...)
    self.camera = __TS__New(Camera, main.width, main.height)
    self.main = __TS__New(Group)
end
function MenuState.prototype.enter(self)
    local label = __TS__New(Label, "- BOYMODER CHRONICLES -", OutlineMode.DropShadow)
    label:anchor(0.5, 0.5)
    label:setColor(
        __TS__New(Color, "#cf9b9bff"),
        __TS__New(Color, "#520303ff")
    )
    label.position = vec(main.width / 2, 90)
    self.main:add(label)
    do
        local y = 0
        while y < 1 do
            local button = __TS__New(
                Button,
                "play",
                function()
                    main:switchState(PlayState)
                    SceneManager:switchScene("bedroom1")
                end
            )
            button:anchor(0.5, 0.5)
            button.label:anchor(0.5, 0.5)
            button:setSize(100, 10)
            button.backgroundColor = Color:fromHex("#d1c0c018")
            button:setPosition(main.width / 2 - button.width / 2, main.height / 2 + y * 25 - button.height / 2)
            button.onHover:connect(function()
                button.backgroundColor = Color:fromHex("#000000")
            end)
            button.onLeave:connect(function()
                button.backgroundColor = Color:fromHex("#d1c0c018")
            end)
            button:setHitbox(0, 0, button.width, button.height)
            self.main:add(button)
            y = y + 1
        end
    end
end
function MenuState.prototype.update(self, dt)
    State.prototype.update(self, dt)
    self.main:update(dt)
    self.camera:update(dt)
end
function MenuState.prototype.render(self)
    State.prototype.render(self)
    main.camera.viewport:renderTo(function()
        main.camera:attach()
        self.main:render()
        main.camera:detach()
    end)
end
return ____exports
