local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__StringTrim = ____lualib.__TS__StringTrim
local __TS__StringSplit = ____lualib.__TS__StringSplit
local __TS__Number = ____lualib.__TS__Number
local __TS__ArrayMap = ____lualib.__TS__ArrayMap
local __TS__ArrayFlatMap = ____lualib.__TS__ArrayFlatMap
local ____exports = {}
____exports.FlxCSVLoader = __TS__Class()
local FlxCSVLoader = ____exports.FlxCSVLoader
FlxCSVLoader.name = "FlxCSVLoader"
function FlxCSVLoader.prototype.____constructor(self, tileset)
    self.mapData = {
        width = 0,
        height = 0,
        layers = {},
        objects = {},
        tileset = ""
    }
    self.mapData.tileset = tileset
end
function FlxCSVLoader.prototype.parseLayerName(self, file)
    local layerName = string.match(file, ".*/[^_]+_(.+)%.csv$")
    return layerName or ""
end
function FlxCSVLoader.prototype.load(self, files, objectLayer)
    local maxWidth = 0
    local maxHeight = 0
    for ____, file in ipairs(files) do
        local content, size = love.filesystem.read(file)
        if type(size) == "string" then
            error(size)
        end
        local rows = __TS__StringSplit(
            __TS__StringTrim(content),
            "\n"
        )
        local width = #__TS__StringSplit(rows[1], ",")
        local height = #rows
        maxWidth = math.max(maxWidth, width)
        maxHeight = math.max(maxHeight, height)
        local name = self:parseLayerName(file)
        local tileData = __TS__ArrayFlatMap(
            rows,
            function(____, row) return __TS__ArrayMap(
                __TS__StringSplit(row, ","),
                function(____, col) return __TS__Number(col) + 1 end
            ) end
        )
        local ____self_mapData_layers_0 = self.mapData.layers
        ____self_mapData_layers_0[#____self_mapData_layers_0 + 1] = {name = name, tileData = tileData}
    end
    self.mapData.width = maxWidth
    self.mapData.height = maxHeight
end
return ____exports
