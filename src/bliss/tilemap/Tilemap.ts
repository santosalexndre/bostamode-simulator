import { draw, newSpriteBatch, SpriteBatch } from 'love.graphics';
import { SpriteSheets } from '../util/Resources';
import { IViewport, MapData } from '../interfaces';
import { FrameCollection } from '../animation/FrameCollection';
import { Basic } from '../Basic';
import { main } from '../Main';

class Chunk {
    public tiles: number[] = [];
    public batchIds: number[] = [];
    public dirty: boolean = true;
    private batch: SpriteBatch;

    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        private tileWidth: number,
        private tileHeight: number,
        private tileset: FrameCollection,
    ) {
        this.tiles.fill(this.tileset.frames.length - 1, 0, width * height);
        this.batchIds.fill(0, 0, width * height);
        this.batch = newSpriteBatch(this.tileset.texture);
    }

    /**
     *
     * @param x X in tile coordinates local to the chunk
     * @param y y in tile coordinates local to the chunk
     * @returns
     */
    public getTile(x: number, y: number) {
        const id = x + y * this.width;

        return this.tiles[id];
    }

    public setTile(tile: number, x: number, y: number) {
        const id = x + y * this.width;

        if (tile === 0) tile = this.tileset.frames.length - 1;

        if (this.tiles[id] === tile) return;

        this.tiles[id] = tile;
        this.batch.set(this.batchIds[id], this.tileset.frames[tile - 1], x * this.tileWidth, y * this.tileHeight);
    }

    public removeTile(x: number, y: number) {
        const id = x + y * this.width;

        this.tiles[id] = 0;
        this.batch.set(this.batchIds[id], this.tileset.frames[0], x * this.tileWidth, y * this.tileHeight);
    }

    public updateBatch() {
        this.batch.clear();

        const count = this.width * this.height;
        for (let i = 0; i < count; i++) {
            const x = i % this.width;
            const y = math.floor(i / this.width);
            const tile = this.tiles[i];
            this.batchIds[i] = this.batch.add(this.tileset.frames[tile - 1], x * this.tileWidth, y * this.tileHeight);
        }
        this.dirty = false;
    }

    public render() {
        draw(this.batch, this.x, this.y);
    }
}

// TODO: Pool the sprite batches
export class TileLayer extends Basic {
    private width: number;
    private height: number;
    private tileWidth: number;
    private tileHeight: number;
    private chunksX: number;
    private chunksY: number;
    private chunks: Chunk[][] = [];

    private startX: number = 0;
    private startY: number = 0;
    private endX: number = 0;
    private endY: number = 0;
    private tileset: FrameCollection;

    constructor(
        tileset: FrameCollection,
        mapData?: MapData,
        private chunkWidth: number = 64,
        private chunkHeight: number = 64,
        private viewport: IViewport = main.camera,
    ) {
        super();
        this.tileset = tileset;
        this.tileWidth = tileset.frameWidth;
        this.tileHeight = tileset.frameHeight;
        // if (layerName && mapData) {
        //     this.tileset = SpriteSheets.load(mapData.tileset, 16, 16);
        //     this.width = mapData.width;
        //     this.height = mapData.height;
        //     this.tilewidth = this.tileset.frameWidth;
        //     this.tileheight = this.tileset.frameHeight;

        //     const layer = mapData.layers.find(layer => layer.name === layerName);
        //     if (layer === undefined) throw `Layer ${layerName} not found.`;

        //     this.loadTileArray(layer.tileData);
        // }
    }

    public setSize(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.chunksX = math.ceil(this.width / this.chunkWidth);
        this.chunksY = math.ceil(this.height / this.chunkHeight);

        for (let x = 0; x < this.chunksX; x++) {
            this.chunks[x] = [];
            for (let y = 0; y < this.chunksY; y++) {
                this.chunks[x][y] = new Chunk(
                    x * this.chunkWidth * this.tileWidth,
                    y * this.chunkHeight * this.tileHeight,
                    this.chunkWidth,
                    this.chunkHeight,
                    this.tileWidth,
                    this.tileHeight,
                    this.tileset,
                );
            }
        }
    }

    public loadTileArray(tileData: number[]) {
        this.chunksX = math.ceil(this.width / this.chunkWidth);
        this.chunksY = math.ceil(this.height / this.chunkHeight);

        for (let x = 0; x < this.chunksX; x++) {
            this.chunks[x] = [];
            for (let y = 0; y < this.chunksY; y++) {
                this.chunks[x][y] = new Chunk(
                    x * this.chunkWidth * this.tileWidth,
                    y * this.chunkHeight * this.tileHeight,
                    this.chunkWidth,
                    this.chunkHeight,
                    this.tileWidth,
                    this.tileHeight,
                    this.tileset,
                );
            }
        }

        for (let i = 0; i < tileData.length; i++) {
            this.setTile(tileData[i], (i % this.width) * this.tileWidth, math.floor(i / this.width) * this.tileHeight);
        }
    }

    public setTile(tile: number, x: number, y: number, layer: number = 0) {
        let chunk = this.getChunkAt(x, y);
        if (!chunk) return;
        const chunkX = x - chunk.x;
        const chunkY = y - chunk.y;

        const tileX = math.floor(chunkX / this.tileWidth);
        const tileY = math.floor(chunkY / this.tileHeight);

        chunk.setTile(tile, tileX, tileY);
    }

    public getChunkAt(x: number, y: number) {
        const chunkX = Math.floor(x / (this.chunkWidth * this.tileWidth));
        const chunkY = Math.floor(y / (this.chunkHeight * this.tileHeight));

        if (chunkX > this.chunksX - 1 || chunkY > this.chunksY - 1 || chunkX < 0 || chunkY < 0) return;
        return this.chunks[chunkX][chunkY];
    }

    public override update(dt: number): void {
        super.update(dt);
        const chunkPixelWidth = this.chunkWidth * this.tileWidth;
        const chunkPixelHeight = this.chunkHeight * this.tileHeight;

        const camLeft = Math.floor((this.viewport.x - this.viewport.width) / chunkPixelWidth);
        const camTop = Math.floor((this.viewport.y - this.viewport.height) / chunkPixelHeight);
        const camRight = Math.ceil((this.viewport.x + this.viewport.width) / chunkPixelWidth);
        const camBottom = Math.ceil((this.viewport.y + this.viewport.height) / chunkPixelHeight);

        this.startX = Math.max(0, camLeft);
        this.startY = Math.max(0, camTop);
        this.endX = Math.min(this.chunksX, camRight);
        this.endY = Math.min(this.chunksY, camBottom);

        for (let x = this.startX; x < this.endX; x++) {
            for (let y = this.startY; y < this.endY; y++) {
                const chunk = this.chunks[x][y];
                if (chunk.dirty) chunk.updateBatch();
            }
        }
    }

    public override render(): void {
        super.render();

        for (let x = this.startX; x < this.endX; x++) {
            for (let y = this.startY; y < this.endY; y++) {
                const chunk = this.chunks[x][y];
                chunk?.render();
            }
        }
        love.graphics.setColor(1, 1, 1, 1);
    }
}
