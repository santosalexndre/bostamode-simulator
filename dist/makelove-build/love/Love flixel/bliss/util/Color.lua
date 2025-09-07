local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local getColor = ____love_2Egraphics.getColor
local setColor = ____love_2Egraphics.setColor
____exports.Color = __TS__Class()
local Color = ____exports.Color
Color.name = "Color"
function Color.prototype.____constructor(self, r, g, b, a)
    if a == nil then
        a = 1
    end
    if type(r) == "string" then
        local hex = string.gsub(r, "#", "")
        self[1] = tonumber("0x" .. string.sub(hex, 1, 2)) / 255
        self[2] = tonumber("0x" .. string.sub(hex, 3, 4)) / 255
        self[3] = tonumber("0x" .. string.sub(hex, 5, 6)) / 255
        self[4] = #hex == 8 and tonumber("0x" .. string.sub(hex, 7, 8)) / 255 or 1
    else
        if g == nil or b == nil then
            error(
                __TS__New(Error, "If the first argument is a number, the second and third must also be numbers."),
                0
            )
        elseif r > 1 or g > 1 or b > 1 then
            self[1] = r / 255
            self[2] = g / 255
            self[3] = b / 255
            self[4] = a or 1
        else
            self[1] = r
            self[2] = g
            self[3] = b
            self[4] = a or 1
        end
    end
end
function Color.fromHex(self, hex)
    if ____exports.Color.database[hex] then
        return ____exports.Color.database[hex]
    else
        local ____TS__New_result_0 = __TS__New(____exports.Color, hex)
        ____exports.Color.database[hex] = ____TS__New_result_0
        return ____TS__New_result_0
    end
end
function Color.prototype.apply(self)
    local r, g, b, a = getColor()
    setColor(self[1], self[2], self[3], a)
end
function Color.prototype.clone(self)
    return __TS__New(
        ____exports.Color,
        self[1],
        self[2],
        self[3],
        self[4]
    )
end
function Color.prototype.darken(self, amount)
    if amount == nil then
        amount = 0.1
    end
    self[1] = math.max(0, self[1] - amount)
    self[2] = math.max(0, self[2] - amount)
    self[3] = math.max(0, self[3] - amount)
    return self
end
function Color.prototype.interpolate(self, to, amount)
    amount = math.max(
        0,
        math.min(1, amount)
    )
    self[1] = self[1] + (to[1] - self[1]) * amount
    self[2] = self[2] + (to[2] - self[2]) * amount
    self[3] = self[3] + (to[3] - self[3]) * amount
    self[4] = self[4] + (to[4] - self[4]) * amount
    return self
end
function Color.prototype.__tostring(self)
    return ((((((("Color(r: " .. tostring(self[1] * 255)) .. ", g: ") .. tostring(self[2] * 255)) .. ", b: ") .. tostring(self[3] * 255)) .. ", a: ") .. tostring(self[4])) .. ")"
end
Color.WHITE = __TS__New(____exports.Color, "#ffffff")
Color.BLACK = __TS__New(____exports.Color, "#000000")
Color.RED = __TS__New(____exports.Color, "#ff0000")
Color.GREEN = __TS__New(____exports.Color, "#00ff00")
Color.BLUE = __TS__New(____exports.Color, "#0000ff")
Color.YELLOW = __TS__New(____exports.Color, "#ffff00")
Color.CYAN = __TS__New(____exports.Color, "#00ffff")
Color.MAGENTA = __TS__New(____exports.Color, "#ff00ff")
Color.GRAY = __TS__New(____exports.Color, "#808080")
Color.DARK_GRAY = __TS__New(____exports.Color, "#404040")
Color.LIGHT_GRAY = __TS__New(____exports.Color, "#c0c0c0")
Color.database = {}
__TS__SetDescriptor(
    Color.prototype,
    "r",
    {get = function(self)
        return self[1]
    end},
    true
)
__TS__SetDescriptor(
    Color.prototype,
    "g",
    {get = function(self)
        return self[2]
    end},
    true
)
__TS__SetDescriptor(
    Color.prototype,
    "b",
    {get = function(self)
        return self[3]
    end},
    true
)
__TS__SetDescriptor(
    Color.prototype,
    "a",
    {get = function(self)
        return self[4]
    end},
    true
)
return ____exports
