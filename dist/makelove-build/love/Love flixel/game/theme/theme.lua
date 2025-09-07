local ____lualib = require("lualib_bundle")
local __TS__StringAccess = ____lualib.__TS__StringAccess
local ____exports = {}
local ____Color = require("bliss.util.Color")
local Color = ____Color.Color
____exports.OUTLINE_COLOR = Color:fromHex("#000000ff")
____exports.BACKGROUND_COLOR = Color:fromHex("#f5dcf3ff")
____exports.LINE_WIDTH = 5
____exports.SELECTED_COLOR = Color:fromHex("#ff00aaff")
____exports.UNFOCUSED_COLOR = Color:fromHex("#f5dcf3ff")
____exports.FOCUSED_COLOR = Color:fromHex("#ff7cd3ff")
____exports.spriteMap = {you = {default = "assets/images/npcs/boymoder.png"}, dad = {default = "assets/images/npcs/dad.png"}, brother = {default = "assets/images/npcs/brother.png"}, uncle = {default = "assets/images/npcs/uncle.png"}}
____exports.capitalize = function(____, s) return string.upper(__TS__StringAccess(s, 0)) .. string.sub(s, 2) end
____exports.getSprite = function(____, name, version)
    if version == nil then
        version = "default"
    end
    local assets = ____exports.spriteMap[string.lower(name)]
    if assets == nil then
        return "assets/images/npcs/missing.png"
    end
    local image = assets[version]
    if image == nil then
        return "assets/images/npcs/missing.png"
    end
    return image
end
return ____exports
