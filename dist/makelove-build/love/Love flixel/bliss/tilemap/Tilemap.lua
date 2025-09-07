local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ArrayFill = ____lualib.__TS__ArrayFill
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____love_2Egraphics = require("love.graphics")
local draw = ____love_2Egraphics.draw
local newSpriteBatch = ____love_2Egraphics.newSpriteBatch
local ____Basic = require("bliss.Basic")
local Basic = ____Basic.Basic
local ____Main = require("bliss.Main")
local main = ____Main.main
local Chunk = __TS__Class()
Chunk.name = "Chunk"
function Chunk.prototype.____constructor(self, x, y, width, height, tileWidth, tileHeight, tileset)
    self.x = x
    self.y = y
    self.width = width
    self.height = height
    self.tileWidth = tileWidth
    self.tileHeight = tileHeight
    self.tileset = tileset
    self.tiles = {}
    self.batchIds = {}
    self.dirty = true
    __TS__ArrayFill(self.tiles, #self.tileset.frames - 1, 0, width * height)
    __TS__ArrayFill(self.batchIds, 0, 0, width * height)
    self.batch = newSpriteBatch(self.tileset.texture)
end
function Chunk.prototype.getTile(self, x, y)
    local id = x + y * self.width
    return self.tiles[id + 1]
end
function Chunk.prototype.setTile(self, tile, x, y)
    local id = x + y * self.width
    if tile == 0 then
        tile = #self.tileset.frames - 1
    end
    if self.tiles[id + 1] == tile then
        return
    end
    self.tiles[id + 1] = tile
    self.batch:set(self.batchIds[id + 1], self.tileset.frames[tile], x * self.tileWidth, y * self.tileHeight)
end
function Chunk.prototype.removeTile(self, x, y)
    local id = x + y * self.width
    self.tiles[id + 1] = 0
    self.batch:set(self.batchIds[id + 1], self.tileset.frames[1], x * self.tileWidth, y * self.tileHeight)
end
function Chunk.prototype.updateBatch(self)
    self.batch:clear()
    local count = self.width * self.height
    do
        local i = 0
        while i < count do
            local x = i % self.width
            local y = math.floor(i / self.width)
            local tile = self.tiles[i + 1]
            self.batchIds[i + 1] = self.batch:add(self.tileset.frames[tile], x * self.tileWidth, y * self.tileHeight)
            i = i + 1
        end
    end
    self.dirty = false
end
function Chunk.prototype.render(self)
    draw(self.batch, self.x, self.y)
end
____exports.TileLayer = __TS__Class()
local TileLayer = ____exports.TileLayer
TileLayer.name = "TileLayer"
__TS__ClassExtends(TileLayer, Basic)
function TileLayer.prototype.____constructor(self, tileset, mapData, chunkWidth, chunkHeight, viewport)
    if chunkWidth == nil then
        chunkWidth = 64
    end
    if chunkHeight == nil then
        chunkHeight = 64
    end
    if viewport == nil then
        viewport = main.camera
    end
    Basic.prototype.____constructor(self)
    self.chunkWidth = chunkWidth
    self.chunkHeight = chunkHeight
    self.viewport = viewport
    self.chunks = {}
    self.startX = 0
    self.startY = 0
    self.endX = 0
    self.endY = 0
    self.tileset = tileset
    self.tileWidth = tileset.frameWidth
    self.tileHeight = tileset.frameHeight
end
function TileLayer.prototype.setSize(self, width, height)
    self.width = width
    self.height = height
    self.chunksX = math.ceil(self.width / self.chunkWidth)
    self.chunksY = math.ceil(self.height / self.chunkHeight)
    do
        local x = 0
        while x < self.chunksX do
            self.chunks[x + 1] = {}
            do
                local y = 0
                while y < self.chunksY do
                    self.chunks[x + 1][y + 1] = __TS__New(
                        Chunk,
                        x * self.chunkWidth * self.tileWidth,
                        y * self.chunkHeight * self.tileHeight,
                        self.chunkWidth,
                        self.chunkHeight,
                        self.tileWidth,
                        self.tileHeight,
                        self.tileset
                    )
                    y = y + 1
                end
            end
            x = x + 1
        end
    end
end
function TileLayer.prototype.loadTileArray(self, tileData)
    self.chunksX = math.ceil(self.width / self.chunkWidth)
    self.chunksY = math.ceil(self.height / self.chunkHeight)
    do
        local x = 0
        while x < self.chunksX do
            self.chunks[x + 1] = {}
            do
                local y = 0
                while y < self.chunksY do
                    self.chunks[x + 1][y + 1] = __TS__New(
                        Chunk,
                        x * self.chunkWidth * self.tileWidth,
                        y * self.chunkHeight * self.tileHeight,
                        self.chunkWidth,
                        self.chunkHeight,
                        self.tileWidth,
                        self.tileHeight,
                        self.tileset
                    )
                    y = y + 1
                end
            end
            x = x + 1
        end
    end
    do
        local i = 0
        while i < #tileData do
            self:setTile(
                tileData[i + 1],
                i % self.width * self.tileWidth,
                math.floor(i / self.width) * self.tileHeight
            )
            i = i + 1
        end
    end
end
function TileLayer.prototype.setTile(self, tile, x, y, layer)
    if layer == nil then
        layer = 0
    end
    local chunk = self:getChunkAt(x, y)
    if not chunk then
        return
    end
    local chunkX = x - chunk.x
    local chunkY = y - chunk.y
    local tileX = math.floor(chunkX / self.tileWidth)
    local tileY = math.floor(chunkY / self.tileHeight)
    chunk:setTile(tile, tileX, tileY)
end
function TileLayer.prototype.getChunkAt(self, x, y)
    local chunkX = math.floor(x / (self.chunkWidth * self.tileWidth))
    local chunkY = math.floor(y / (self.chunkHeight * self.tileHeight))
    if chunkX > self.chunksX - 1 or chunkY > self.chunksY - 1 or chunkX < 0 or chunkY < 0 then
        return
    end
    return self.chunks[chunkX + 1][chunkY + 1]
end
function TileLayer.prototype.update(self, dt)
    Basic.prototype.update(self, dt)
    local chunkPixelWidth = self.chunkWidth * self.tileWidth
    local chunkPixelHeight = self.chunkHeight * self.tileHeight
    local camLeft = math.floor((self.viewport.x - self.viewport.width) / chunkPixelWidth)
    local camTop = math.floor((self.viewport.y - self.viewport.height) / chunkPixelHeight)
    local camRight = math.ceil((self.viewport.x + self.viewport.width) / chunkPixelWidth)
    local camBottom = math.ceil((self.viewport.y + self.viewport.height) / chunkPixelHeight)
    self.startX = math.max(0, camLeft)
    self.startY = math.max(0, camTop)
    self.endX = math.min(self.chunksX, camRight)
    self.endY = math.min(self.chunksY, camBottom)
    do
        local x = self.startX
        while x < self.endX do
            do
                local y = self.startY
                while y < self.endY do
                    local chunk = self.chunks[x + 1][y + 1]
                    if chunk.dirty then
                        chunk:updateBatch()
                    end
                    y = y + 1
                end
            end
            x = x + 1
        end
    end
end
function TileLayer.prototype.render(self)
    Basic.prototype.render(self)
    do
        local x = self.startX
        while x < self.endX do
            do
                local y = self.startY
                while y < self.endY do
                    local chunk = self.chunks[x + 1][y + 1]
                    if chunk ~= nil then
                        chunk:render()
                    end
                    y = y + 1
                end
            end
            x = x + 1
        end
    end
    love.graphics.setColor(1, 1, 1, 1)
end
return ____exports
