local ____lualib = require("lualib_bundle")
local __TS__StringTrim = ____lualib.__TS__StringTrim
local __TS__StringEndsWith = ____lualib.__TS__StringEndsWith
local __TS__StringStartsWith = ____lualib.__TS__StringStartsWith
local ____exports = {}
local ____inspect = require("libraries.inspect")
local trace = ____inspect.trace
____exports.evaluateCondition = function(____, expr, context)
    if expr == nil then
        return true
    end
    local luaExpr
    luaExpr = string.gsub(expr, "&&", " and ")
    luaExpr = string.gsub(luaExpr, "%|%|", " or ")
    luaExpr = string.gsub(luaExpr, "!=", "~= ")
    luaExpr = string.gsub(luaExpr, "!%s", "not ")
    luaExpr = string.gsub(luaExpr, "==%s*true", "== true")
    luaExpr = string.gsub(luaExpr, "==%s*false", "== false")
    for varName in string.gmatch(expr, "[%a_][%w_]*") do
        if not (context[varName] ~= nil) and varName ~= "true" and varName ~= "false" then
            local pattern = varName
            luaExpr = string.gsub(luaExpr, pattern, "false")
        end
    end
    for key, value in pairs(context) do
        local pattern = tostring(key)
        if type(value) == "string" then
            luaExpr = string.gsub(
                luaExpr,
                pattern,
                ("\"" .. tostring(value)) .. "\""
            )
        else
            luaExpr = string.gsub(
                luaExpr,
                pattern,
                tostring(value)
            )
        end
    end
    local tmpFile = {love.filesystem.write("condition.lua", "return " .. luaExpr)}
    local fn = love.filesystem.load("condition.lua")
    if not fn then
        return false
    end
    local ok, result = pcall(fn)
    if not ok then
        return false
    end
    return result or false
end
local function parseGoto(____, s)
    if s == nil then
        return
    end
    local parts = string.match(s, "%-%>%s*(.+)$")
    local result = {}
    if parts ~= nil then
        for gotostr in string.gmatch(parts, "[^;]+") do
            local cond, id = string.match(gotostr, "!?(.-)!%s*#([%w_]+)")
            if id ~= nil then
                result.condition = cond ~= "" and cond or nil
                result["true"] = id
            else
                local simpleId = string.match(gotostr, "#([%w_]+)")
                if simpleId ~= "" then
                    result.default = simpleId
                else
                    result["true"] = simpleId
                end
            end
        end
    end
    return result
end
local function parseEffects(____, s)
    if s == nil then
        return
    end
    local inside = string.match(s, "{(.-)}")
    local effects = {}
    if inside == nil then
        return
    end
    for fx in string.gmatch(inside, "[^,]+") do
        fx = string.match(fx, "^%s*(.-)%s*$")
        local name, args = string.match(fx, "^(%S+)%s*(.*)$")
        if name then
            table.insert(effects, {name = name, args = args})
        end
    end
    return effects
end
local function parseText(____, s)
    if s == nil then
        return
    end
    local beforegoto = string.match(s, "^(.-)%-%>")
    local text = ""
    if beforegoto ~= nil and beforegoto ~= "" then
        text = string.match(beforegoto, ":(.*)$")
    else
        text = string.match(s, ":(.*)$")
    end
    if text ~= nil then
        return __TS__StringTrim(text)
    end
end
local function parseSpeakers(____, s)
    if s == nil then
        return
    end
    local content = string.match(s, "%((.-)%)")
    if content == nil then
        return
    end
    local values = {}
    local current
    for v in string.gmatch(content, "[^,]+") do
        local value = __TS__StringTrim(v)
        if __TS__StringEndsWith(value, "*") then
            value = __TS__StringTrim(string.sub(value, 1, -2))
            current = value
        end
        if value ~= "" then
            values[#values + 1] = value
        end
    end
    if #values == 1 then
        return {left = values[1], current = current}
    elseif #values == 2 then
        return {left = values[1], right = values[2], current = current}
    else
        return {current = current}
    end
end
____exports.parseConditions = function(____, s)
    if s == nil then
        return
    end
    local cond = string.match(s, "^%s*!%s*(.-)%s*!")
    if cond then
        return cond
    end
    local beforeGoto = string.match(s, "^(.-)%-%>")
    if beforeGoto then
        cond = string.match(beforeGoto, "!(.-)!")
        if cond then
            return cond
        end
    end
    local beforeColon = string.match(s, "^(.-):")
    if beforeColon then
        cond = string.match(beforeColon, "!(.-)!")
        if cond then
            return cond
        end
    end
    return nil
end
local function parseLine(____, line)
end
____exports.parseDialogue = function(____, filePath)
    local entries = {}
    local state = "lines"
    local jumpId = ""
    local currentEntry = {}
    entries.default = {}
    local entryId = ""
    local function addEntry(____, entry)
        local ____temp_3
        if entryId ~= "" then
            local ____entries_0, ____entryId_1 = entries, entryId
            if ____entries_0[____entryId_1] == nil then
                ____entries_0[____entryId_1] = {}
            end
            ____temp_3 = entries[entryId]
        else
            ____temp_3 = entries.default
        end
        local bucket = ____temp_3
        table.insert(bucket, entry)
    end
    local function handleEnd()
        entryId = ""
    end
    local function handleSection(____, line)
        entryId = __TS__StringTrim((string.gsub(line, "#", "")))
    end
    local function handleQuestionStart(____, speakers, text, condition, effects)
        currentEntry = {}
        currentEntry.speakers = speakers
        currentEntry.text = text
        currentEntry.type = "question"
        currentEntry.options = {}
        currentEntry.conditions = condition
        currentEntry.effects = effects
        state = "question"
    end
    local function handleQuestionEnd()
        state = "lines"
        addEntry(nil, currentEntry)
    end
    local function handleQuestionOption(____, buttonText, condition, go_to, effects)
        table.insert(currentEntry.options, {text = buttonText, conditions = condition, jumpTo = go_to, effects = effects})
    end
    local function handleLine(____, speakers, text, condition, effects, go_to)
        currentEntry = {}
        currentEntry.speakers = speakers
        currentEntry.text = text
        currentEntry.type = text ~= nil and "lines" or "pipe"
        currentEntry.conditions = condition
        currentEntry.effects = effects
        currentEntry.jumpTo = go_to
        addEntry(nil, currentEntry)
    end
    for line in love.filesystem.lines(filePath) do
        local trimmed = __TS__StringTrim(line)
        if trimmed ~= "" and not __TS__StringStartsWith(line, "//") then
            if trimmed == "#end" then
                handleEnd(nil)
            elseif __TS__StringStartsWith(line, "#") then
                handleSection(nil, line)
            else
                local go_to = parseGoto(nil, line)
                local effects = parseEffects(nil, line)
                local condition = ____exports.parseConditions(nil, line)
                local speakers = parseSpeakers(nil, line)
                local text = parseText(nil, line)
                local buttonText = string.match(line, "%[(.-)%]")
                trace(condition)
                if __TS__StringStartsWith(line, "<question>") then
                    handleQuestionStart(
                        nil,
                        speakers,
                        text,
                        condition,
                        effects
                    )
                elseif __TS__StringStartsWith(line, "</question>") then
                    handleQuestionEnd(nil)
                elseif state == "question" then
                    handleQuestionOption(
                        nil,
                        buttonText,
                        condition,
                        go_to,
                        effects
                    )
                elseif state == "lines" then
                    handleLine(
                        nil,
                        speakers,
                        text,
                        condition,
                        effects,
                        go_to
                    )
                end
            end
        end
    end
    return entries
end
return ____exports
