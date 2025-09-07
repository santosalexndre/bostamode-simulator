local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____Engine = require("bliss.Engine")
local Engine = ____Engine.Engine
local ____Game = require("bliss.Game")
local Game = ____Game.Game
local ____Resources = require("bliss.util.Resources")
local Fonts = ____Resources.Fonts
local SpriteSheets = ____Resources.SpriteSheets
local Animations = ____Resources.Animations
local ____Viewport = require("bliss.Viewport")
local ViewportMode = ____Viewport.ViewportMode
local ____MenuState = require("game.MenuState")
local MenuState = ____MenuState.MenuState
____exports.Index = __TS__Class()
local Index = ____exports.Index
Index.name = "Index"
__TS__ClassExtends(Index, Engine)
function Index.prototype.____constructor(self)
    Engine.prototype.____constructor(self)
    Fonts:load("comicsans", "assets/fonts/comicneue.ttf", 28)
    local girlPng = SpriteSheets:load("assets/images/player/player.png", 90, 200)
    Animations:load(
        "girl/idle",
        girlPng,
        {0},
        3,
        true
    )
    Animations:load(
        "girl/hide",
        girlPng,
        {1},
        3,
        true
    )
    self:init(__TS__New(
        Game,
        MenuState,
        1920,
        1080,
        ViewportMode.Viewport
    ))
end
return ____exports
