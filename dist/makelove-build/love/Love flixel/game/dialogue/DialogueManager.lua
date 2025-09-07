local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local __TS__StringStartsWith = ____lualib.__TS__StringStartsWith
local __TS__StringTrim = ____lualib.__TS__StringTrim
local __TS__ArrayFilter = ____lualib.__TS__ArrayFilter
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local ____exports = {}
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
local ____Input = require("bliss.Input")
local input = ____Input.input
local ____Sprite = require("bliss.Sprite")
local Sprite = ____Sprite.Sprite
local ____DialogueParser = require("game.dialogue.DialogueParser")
local evaluateCondition = ____DialogueParser.evaluateCondition
local parseDialogue = ____DialogueParser.parseDialogue
local ____global = require("game.global")
local globalState = ____global.globalState
local ____DialogueBox = require("game.dialogue.DialogueBox")
local DialogueBox = ____DialogueBox.DialogueBox
local ____OptionButton = require("game.ui.OptionButton")
local OptionButton = ____OptionButton.OptionButton
local ____Main = require("bliss.Main")
local main = ____Main.main
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local origin = ____love_2Egraphics.origin
local pop = ____love_2Egraphics.pop
local push = ____love_2Egraphics.push
local rectangle = ____love_2Egraphics.rectangle
local scale = ____love_2Egraphics.scale
local setColor = ____love_2Egraphics.setColor
local translate = ____love_2Egraphics.translate
local ____theme = require("game.theme.theme")
local capitalize = ____theme.capitalize
local getSprite = ____theme.getSprite
local ____nvec = require("libraries.nvec")
local vec = ____nvec.default
local Timer = require("libraries.timer")
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
local ____Signal = require("bliss.util.Signal")
local Signal = ____Signal.Signal
local ____Resources = require("bliss.util.Resources")
local Images = ____Resources.Images
local ____MusicManager = require("game.MusicManager")
local MusicManager = ____MusicManager.MusicManager
____exports.DialogueManager = __TS__Class()
local DialogueManager = ____exports.DialogueManager
DialogueManager.name = "DialogueManager"
__TS__ClassExtends(DialogueManager, Basic)
function DialogueManager.prototype.____constructor(self)
    Basic.prototype.____constructor(self)
    self.currentId = "default"
    self.currentLine = 0
    self.stack = {}
    self.buttons = {}
    self.finishedScript = false
    self.switchScene = __TS__New(Signal)
    self.dialogueEnded = __TS__New(Signal)
    self.dialogueStarted = __TS__New(Signal)
    self.timer = Timer(nil)
end
function DialogueManager.prototype.loadScript(self, filename)
    self.dialogueBox = nil
    self.currentLine = 0
    self.currentId = "default"
    self.stack = {}
    self.buttons = {}
    self.speakerLeft = nil
    self.speakerLeftSpr = nil
    self.speakerRight = nil
    self.speakerRightSpr = nil
    self.currentSpeaker = nil
    self.timer:clear()
    self.finishedScript = false
    self.fullScript = parseDialogue(nil, "assets/data/dialogues/" .. filename)
    self:nextEntry()
    self.dialogueStarted:emit()
    local y = self.dialogueBox.y
    self.dialogueBox.y = main.height
    if not self.finishedScript then
        self.timer:tween(0.5, self.dialogueBox, {y = y}, "out-cubic")
    end
end
function DialogueManager.prototype.applyEffects(self, effects)
    if not effects then
        return
    end
    for ____, eff in ipairs(effects) do
        repeat
            local ____switch8 = eff.name
            local ____type, color, image
            local ____cond8 = ____switch8 == "set"
            if ____cond8 then
                do
                    local varName, op, valueStr = string.match(eff.args, "(%w+)%s*([%+%-=]+)%s*(\"?%w+\"?)")
                    local value = tonumber(valueStr)
                    if op == "-=" then
                        if value == nil then
                            error("Invalid operator for " .. tostring(value))
                        end
                        local ____globalState_1 = globalState
                        local ____varName_2 = varName
                        local ____globalState_varName_0 = globalState[varName]
                        if ____globalState_varName_0 == nil then
                            ____globalState_varName_0 = 0
                        end
                        ____globalState_1[____varName_2] = ____globalState_varName_0 - value
                    elseif op == "+=" then
                        if value == nil then
                            error("Invalid operator for " .. tostring(value))
                        end
                        local ____globalState_4 = globalState
                        local ____varName_5 = varName
                        local ____globalState_varName_3 = globalState[varName]
                        if ____globalState_varName_3 == nil then
                            ____globalState_varName_3 = 0
                        end
                        ____globalState_4[____varName_5] = ____globalState_varName_3 + value
                    elseif op == "=" then
                        if valueStr == "true" then
                            globalState[varName] = true
                        elseif valueStr == "false" then
                            globalState[varName] = false
                        elseif value == nil then
                            globalState[varName] = valueStr
                        else
                            globalState[varName] = value
                        end
                    end
                    break
                end
            end
            ____cond8 = ____cond8 or ____switch8 == "shake"
            if ____cond8 then
                print("Shake screen with args: " .. eff.args)
                break
            end
            ____cond8 = ____cond8 or ____switch8 == "overlay"
            if ____cond8 then
                if eff.args == "nil" then
                    self.overlay = nil
                    break
                end
                ____type = __TS__StringStartsWith(eff.args, "#") and "color" or "image"
                color = ____type == "color" and Color:fromHex(eff.args) or nil
                image = ____type == "image" and Images:get(eff.args) or nil
                self.overlay = {type = ____type, color = color, image = image}
                break
            end
            ____cond8 = ____cond8 or ____switch8 == "music"
            if ____cond8 then
                MusicManager:playMusic(__TS__StringTrim(eff.args))
                break
            end
            ____cond8 = ____cond8 or ____switch8 == "sound"
            if ____cond8 then
                MusicManager:playSound(__TS__StringTrim(eff.args))
                break
            end
        until true
    end
end
function DialogueManager.prototype.playEntry(self, entry)
    local ____opt_6 = self.dialogueBox
    if ____opt_6 ~= nil then
        ____opt_6:kill()
    end
    self.dialogueBox = __TS__New(DialogueBox, self.currentEntry.text or "serjao berranteiro mais conehcido como matador de onça")
    local ____self_10 = self.dialogueBox
    local ____self_10_setSpeakerLeft_11 = ____self_10.setSpeakerLeft
    local ____opt_8 = entry.speakers
    ____self_10_setSpeakerLeft_11(____self_10, ____opt_8 and ____opt_8.left)
    local ____self_14 = self.dialogueBox
    local ____self_14_setSpeakerRight_15 = ____self_14.setSpeakerRight
    local ____opt_12 = entry.speakers
    ____self_14_setSpeakerRight_15(____self_14, ____opt_12 and ____opt_12.right)
    local ____self_18 = self.dialogueBox
    local ____self_18_setCurrentSpeaker_19 = ____self_18.setCurrentSpeaker
    local ____opt_16 = entry.speakers
    ____self_18_setCurrentSpeaker_19(____self_18, ____opt_16 and ____opt_16.current)
    local ____opt_20 = entry.speakers
    local ____temp_24 = (____opt_20 and ____opt_20.current) == nil
    if ____temp_24 then
        local ____opt_22 = entry.speakers
        ____temp_24 = ____opt_22 and ____opt_22.left
    end
    if ____temp_24 then
        self.dialogueBox.currentSpeaker = capitalize(nil, entry.speakers.left)
    end
    local ____opt_29 = entry.speakers
    local ____opt_25 = ____opt_29 and ____opt_29.left
    if ____opt_25 ~= nil then
        local ____opt_26 = entry.speakers
        ____opt_25 = string.lower(____opt_26 and ____opt_26.left)
    end
    if ____opt_25 ~= "you" then
        self.dialogueBox.speakerLeft = nil
        if entry.speakers then
            self.dialogueBox:setSpeakerRight(entry.speakers.left)
        end
    end
    if entry.speakers == nil then
        self.speakerLeft = nil
        self.speakerRight = nil
        self.dialogueBox.speakerLeft = nil
        self.dialogueBox.speakerRight = nil
        self.dialogueBox.currentSpeaker = nil
    end
    self:setSpeakerLeft(self.dialogueBox.speakerLeft)
    self:setSpeakerRight(self.dialogueBox.speakerRight)
    self:setCurrentSpeaker(self.dialogueBox.currentSpeaker)
    self:applyEffects(entry.effects)
end
function DialogueManager.prototype.setCurrentSpeaker(self, s)
    if s == self.currentSpeaker then
        return
    end
    if s == self.speakerRight then
        if self.speakerLeftSpr ~= nil then
            self.speakerLeftSpr.tint = Color:fromHex("#8d8d8dff")
        end
        if self.speakerLeftSpr then
            self:animateBack(self.speakerLeftSpr, 1)
        end
        if self.speakerRightSpr then
            self:animateBack(self.speakerRightSpr, 1)
        end
        if self.speakerRightSpr then
            self.speakerRightSpr.tint = Color:fromHex("#ffffff")
        end
    elseif s == self.speakerLeft then
        if self.speakerRightSpr ~= nil then
            self.speakerRightSpr.tint = Color:fromHex("#8d8d8dff")
        end
        if self.speakerLeftSpr ~= nil then
            self.speakerLeftSpr.tint = Color:fromHex("#ffffff")
        end
        if self.speakerRightSpr then
            self:animateBack(self.speakerRightSpr, -1)
        end
        if self.speakerLeftSpr then
            self:animateBack(self.speakerLeftSpr, -1)
        end
    end
    self.currentSpeaker = s
end
function DialogueManager.prototype.animateBack(self, spr, dir)
    self.timer:tween(0.3, spr.position, {x = spr.position.x - 30 * dir}, "out-cubic")
end
function DialogueManager.prototype.setSpeakerRight(self, s)
    if s == nil then
        if self.speakerRightSpr then
            self:animateClose(self.speakerRightSpr, main.width)
        end
        self.speakerRight = nil
        return
    end
    if self.speakerRight == s then
        return
    end
    self.speakerRight = s
    local spr = __TS__New(Sprite)
    spr:loadGraphic(getSprite(nil, s))
    spr:anchor(0.5, 1)
    spr.scale.x = -1
    spr.position = vec(main.width * 0.8, main.height + 100)
    spr.alpha = 0
    spr.timer:tween(0.7, spr.position, {x = main.width * 0.75}, "out-cubic")
    spr.timer:tween(0.5, spr, {alpha = 1}, "linear")
    self.speakerRightSpr = spr
end
function DialogueManager.prototype.setSpeakerLeft(self, s)
    if s == nil then
        if self.speakerLeftSpr then
            self:animateClose(self.speakerLeftSpr, 0)
        end
        self.speakerLeft = nil
        return
    end
    if self.speakerLeft == s then
        return
    end
    self.speakerLeft = s
    local spr = __TS__New(Sprite)
    spr:loadGraphic(getSprite(nil, s))
    spr:anchor(0.5, 1)
    spr.position = vec(main.width * 0.17, main.height + 100)
    spr.alpha = 0
    spr.timer:tween(0.7, spr.position, {x = main.width * 0.2}, "out-cubic")
    spr.timer:tween(0.5, spr, {alpha = 1}, "linear")
    self.speakerLeftSpr = spr
end
function DialogueManager.prototype.animateClose(self, spr, x)
    spr.timer:tween(0.5, spr.position, {x = x}, "out-cubic")
    spr.timer:tween(0.2, spr, {alpha = 0}, "linear")
end
function DialogueManager.prototype.animateOpen(self, sprite)
end
function DialogueManager.prototype.stop(self)
    self.finishedScript = true
    self.dialogueEnded:emit()
    self:closeAnimation()
end
function DialogueManager.prototype.closeAnimation(self)
    if self.speakerRightSpr then
        self.timer:tween(
            0.5,
            self.speakerRightSpr.position,
            {x = main.width},
            "linear",
            function()
                self.speakerRightSpr = nil
                return nil
            end
        )
        self.timer:tween(0.2, self.speakerRightSpr, {alpha = 0})
    end
    if self.speakerLeftSpr then
        self.timer:tween(
            0.5,
            self.speakerLeftSpr.position,
            {x = 0},
            "linear",
            function()
                self.speakerLeftSpr = nil
                return nil
            end
        )
        self.timer:tween(0.2, self.speakerLeftSpr, {alpha = 0})
    end
    if self.dialogueBox then
        self.timer:tween(
            0.5,
            self.dialogueBox,
            {y = main.height + self.dialogueBox.height + 100, alpha = 0},
            "out-cubic",
            function()
                local ____opt_31 = self.dialogueBox
                if ____opt_31 ~= nil then
                    ____opt_31:kill()
                end
                self.dialogueBox = nil
            end
        )
    end
end
function DialogueManager.prototype.nextEntry(self)
    if __TS__StringStartsWith(self.currentId, "scene") then
        self.switchScene:emit((string.gsub(self.currentId, "scene_", "")))
        return
    end
    if __TS__StringStartsWith(self.currentId, "break") then
        self:stop()
        return
    end
    local entry = self.fullScript[self.currentId]
    if not entry then
        error(("entry with #" .. self.currentId) .. " not found")
    end
    if self.currentLine >= #self.fullScript[self.currentId] then
        if #self.stack > 0 then
            while self.currentLine >= #self.fullScript[self.currentId] do
                if #self.stack <= 0 then
                    self:stop()
                    return
                end
                local prev = table.remove(self.stack)
                self.currentLine = prev.line
                self.currentId = prev.id
            end
        else
            self:stop()
            return
        end
    end
    if self.currentEntry and self.currentEntry.jumpTo and self.currentEntry.jumpTo.condition then
        local jump = self.currentEntry.jumpTo
        local valid = evaluateCondition(nil, self.currentEntry.jumpTo.condition, globalState)
        local ____self_stack_33 = self.stack
        ____self_stack_33[#____self_stack_33 + 1] = {id = self.currentId, line = self.currentLine}
        if valid then
            self.currentId = self.currentEntry.jumpTo["true"]
        else
            self.currentId = self.currentEntry.jumpTo.default
        end
        self.currentLine = 0
    end
    self.currentEntry = self.fullScript[self.currentId][self.currentLine + 1]
    if self.currentEntry.type == "pipe" then
        local jump = self.currentEntry.jumpTo
        if jump and jump.default then
            local valid = evaluateCondition(nil, self.currentEntry.conditions, globalState)
            if valid then
                local ____self_stack_34 = self.stack
                ____self_stack_34[#____self_stack_34 + 1] = {id = self.currentId, line = self.currentLine + 1}
                self.currentId = jump.default
                self.currentLine = 0
                self:nextEntry()
                return
            end
            self.currentLine = self.currentLine + 1
            self:nextEntry()
            return
        end
        if self.currentEntry.effects then
            self:applyEffects(self.currentEntry.effects)
            self.currentLine = self.currentLine + 1
            self:nextEntry()
            return
        end
    elseif self.currentEntry.type == "question" then
        local spacing = 20
        local buttonHeight = 60
        local ____opt_35 = self.currentEntry.options
        local visibleOptions = ____opt_35 and __TS__ArrayFilter(
            self.currentEntry.options,
            function(____, o) return not o.conditions or evaluateCondition(nil, o.conditions, globalState) end
        ) or ({})
        local totalHeight = #visibleOptions * buttonHeight + (#visibleOptions - 1) * spacing
        local startY = (main.height - totalHeight) / 2 - buttonHeight * 2
        self.answeringQuestion = true
        local ____opt_37 = visibleOptions
        if ____opt_37 ~= nil then
            __TS__ArrayForEach(
                visibleOptions,
                function(____, o, idx)
                    local y = startY + idx * (buttonHeight + spacing)
                    local btn
                    btn = __TS__New(
                        OptionButton,
                        o.text,
                        function()
                            if btn.wait then
                                return
                            end
                            self.answeringQuestion = false
                            self.buttons = {}
                            if o.jumpTo then
                                local ____self_stack_38 = self.stack
                                ____self_stack_38[#____self_stack_38 + 1] = {id = self.currentId, line = self.currentLine + 1}
                                self.currentId = o.jumpTo.default
                                self.currentLine = 0
                                self:nextEntry()
                            else
                                self:stop()
                            end
                        end,
                        main.width / 2,
                        y
                    )
                    local ____self_buttons_39 = self.buttons
                    ____self_buttons_39[#____self_buttons_39 + 1] = btn
                end
            )
        end
        self:playEntry(self.currentEntry)
        return
    end
    if self.currentEntry.conditions and not evaluateCondition(nil, self.currentEntry.conditions, globalState) then
        self.currentLine = self.currentLine + 1
        self:nextEntry()
        return
    end
    self:playEntry(self.currentEntry)
    self.currentLine = self.currentLine + 1
end
function DialogueManager.prototype.getEntry(self, id)
    local entry = self.fullScript[id]
    if not entry then
        error(("Dialogue #" .. id) .. " not found")
    end
    return entry
end
function DialogueManager.prototype.update(self, dt)
    Basic.prototype.update(self, dt)
    self.timer:update(dt)
    if input:pressed("fire1") and self.dialogueBox ~= nil then
        if not self.dialogueBox:hasFinished() then
            self.dialogueBox:skip()
        elseif not self.answeringQuestion then
            self:nextEntry()
        end
    end
    if self.speakerRightSpr ~= nil then
        self.speakerRightSpr:update(dt)
    end
    if self.speakerLeftSpr ~= nil then
        self.speakerLeftSpr:update(dt)
    end
    __TS__ArrayForEach(
        self.buttons,
        function(____, b) return b:update(dt) end
    )
    local ____opt_41 = self.dialogueBox
    if ____opt_41 ~= nil then
        ____opt_41:update(dt)
    end
end
function DialogueManager.prototype.render(self)
    Basic.prototype.render(self)
    push()
    origin()
    local dx, dy = main.camera.viewport:getScreenOffset()
    translate(dx, dy)
    scale(main.camera.viewport:getScreenScale())
    if self.speakerRightSpr ~= nil then
        self.speakerRightSpr:render()
    end
    if self.speakerLeftSpr ~= nil then
        self.speakerLeftSpr:render()
    end
    if self.overlay then
        if self.overlay.type == "color" then
            setColor(self.overlay.color)
            rectangle(
                "fill",
                0,
                0,
                main.width,
                main.height
            )
            setColor(1, 1, 1)
        end
        if self.overlay.type == "image" then
            draw(self.overlay.image, 0, 0)
        end
    end
    __TS__ArrayForEach(
        self.buttons,
        function(____, b) return b:render() end
    )
    local ____opt_43 = self.dialogueBox
    if ____opt_43 ~= nil then
        ____opt_43:render()
    end
    pop()
end
return ____exports
