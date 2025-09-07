local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.MusicManager = __TS__Class()
local MusicManager = ____exports.MusicManager
MusicManager.name = "MusicManager"
function MusicManager.prototype.____constructor(self)
end
function MusicManager.playMusic(self, path)
    if path == self.currentSong then
        return
    else
        if self.music ~= nil and self.music:isPlaying() then
            self.music:stop()
        end
    end
    local song = self.cache[path]
    if song == nil then
        song = love.audio.newSource(path, "stream")
        self.cache[path] = song
    end
    song:setVolume(0.6)
    song:setLooping(true)
    song:play()
    self.music = song
    self.currentSong = path
end
function MusicManager.playSound(self, path)
    local song = self.cache[path]
    if song == nil then
        song = love.audio.newSource(path, "static")
        self.cache[path] = song
    end
    song:setVolume(1)
    song:setLooping(false)
    song:play()
end
MusicManager.cache = {}
return ____exports
