local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__StringTrim = ____lualib.__TS__StringTrim
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local pop = ____love_2Egraphics.pop
local push = ____love_2Egraphics.push
local rectangle = ____love_2Egraphics.rectangle
local setColor = ____love_2Egraphics.setColor
local setLineWidth = ____love_2Egraphics.setLineWidth
local translate = ____love_2Egraphics.translate
local ____Group = require("bliss.group.Group")
local Group = ____Group.Group
local ____State = require("bliss.State")
local State = ____State.State
local ____Clickable = require("game.ui.Clickable")
local Clickable = ____Clickable.Clickable
local ____theme = require("game.theme.theme")
local BACKGROUND_COLOR = ____theme.BACKGROUND_COLOR
local FOCUSED_COLOR = ____theme.FOCUSED_COLOR
local LINE_WIDTH = ____theme.LINE_WIDTH
local OUTLINE_COLOR = ____theme.OUTLINE_COLOR
local ____Resources = require("bliss.util.Resources")
local Fonts = ____Resources.Fonts
local Images = ____Resources.Images
local ____Input = require("bliss.Input")
local input = ____Input.input
local ____json = require("libraries.json.json")
local decode = ____json.decode
local encode = ____json.encode
local ____global = require("game.global")
local globalState = ____global.globalState
local bw = 128 * 2.5
local bh = 72 * 2.5
local SaveButton = __TS__Class()
SaveButton.name = "SaveButton"
__TS__ClassExtends(SaveButton, Clickable)
function SaveButton.prototype.____constructor(self, x, y)
    Clickable.prototype.____constructor(
        self,
        x,
        y,
        bw,
        bh
    )
    self._backgroundImage = Images:get("assets/images/bedroom1.png")
    self._font = Fonts:get("comicsans", 28)
    self.w = bw
    self.h = bh
    self._date = __TS__StringTrim(os.date("%d/%m-%H:%M:%S"))
    self.onButtonPress:connect(function()
        if self._saveFile == "undefined" then
            local path = ((("saves-save-" .. tostring(self.gridY)) .. "-") .. tostring(self.gridX)) .. ".json"
            local data = encode(globalState)
            print(data)
            local ok, message = love.filesystem.write(path, data)
            if not ok then
                error("CU")
            end
            self._saveFile = path
            print("gravandoooo??")
        else
            local file = love.filesystem.read(self._saveFile)
            print("arquivo", file)
            print("cuzinho", self._saveFile)
            local data = decode(file)
            for k, v in pairs(data) do
                globalState[k] = v
            end
            print("crregando??")
        end
    end)
end
function SaveButton.prototype.update(self, dt)
    Clickable.prototype.update(self, dt)
end
function SaveButton.prototype.render(self)
    push()
    translate(-self.w / 2, -self.h / 2)
    if self.hovered then
        FOCUSED_COLOR:apply()
    else
        BACKGROUND_COLOR:apply()
    end
    rectangle(
        "fill",
        self.x,
        self.y,
        self.w,
        self.h,
        25,
        25
    )
    if not self.hovered then
        setColor(0.5, 0.5, 0.5)
    else
        setColor(1, 1, 1)
    end
    local sx = self.w / self._backgroundImage:getWidth()
    local sy = self.h / self._backgroundImage:getHeight()
    OUTLINE_COLOR:apply()
    setLineWidth(LINE_WIDTH)
    rectangle(
        "line",
        self.x,
        self.y,
        self.w,
        self.h,
        25,
        25
    )
    setColor(0, 0, 0, 1)
    local font = love.graphics.getFont()
    love.graphics.setFont(self._font)
    local w = self._font:getWidth(self._date)
    love.graphics.print(self._date, self.x - w / 2 + bw / 2, self.y + bh)
    setColor(1, 1, 1, 1)
    love.graphics.setFont(font)
    pop()
end
____exports.PauseMenu = __TS__Class()
local PauseMenu = ____exports.PauseMenu
PauseMenu.name = "PauseMenu"
__TS__ClassExtends(PauseMenu, State)
function PauseMenu.prototype.____constructor(self)
    State.prototype.____constructor(self)
    self.main = __TS__New(Group)
    self._background = Images:get("assets/backgrounds/outside.png")
    self.saveFiles = {}
    do
        local y = 0
        while y < 3 do
            self.saveFiles[y + 1] = {}
            do
                local x = 0
                while x < 4 do
                    local path = ((("saves-save-" .. tostring(y)) .. "-") .. tostring(x)) .. ".json"
                    local exists = love.filesystem.getInfo(path)
                    if exists then
                        local ____self_saveFiles_index_0 = self.saveFiles[y + 1]
                        ____self_saveFiles_index_0[#____self_saveFiles_index_0 + 1] = path
                    else
                        local ____self_saveFiles_index_1 = self.saveFiles[y + 1]
                        ____self_saveFiles_index_1[#____self_saveFiles_index_1 + 1] = "undefined"
                    end
                    x = x + 1
                end
            end
            y = y + 1
        end
    end
end
function PauseMenu.prototype.enter(self)
    State.prototype.enter(self)
    local margin = 25
    local side = 25
    local bottom = love.graphics.getFont():getHeight()
    local wid = bw + margin + side
    local hei = bh + margin + bottom
    local fullw = 4 * wid
    local fullh = 3 * hei
    local startx = fullw / 2 - wid * 1.33333
    local starty = fullh / 2 - hei
    do
        local y = 0
        while y < 3 do
            do
                local x = 0
                while x < 4 do
                    local saveButton = __TS__New(SaveButton, startx + x * (bw + margin + side) + bw / 2, starty + y * (bh + margin + bottom) + bh / 2)
                    saveButton.gridX = x
                    saveButton.gridY = y
                    saveButton._saveFile = self.saveFiles[y + 1][x + 1]
                    self.main:add(saveButton)
                    x = x + 1
                end
            end
            y = y + 1
        end
    end
end
function PauseMenu.prototype.update(self, dt)
    State.prototype.update(self, dt)
    self.main:update(dt)
    if input:pressed("fire2") then
        self.onClose:emit()
        self:kill()
    end
end
function PauseMenu.prototype.render(self)
    State.prototype.render(self)
    draw(self._background, 0, 0)
    self.main:render()
end
return ____exports
