import { MapLoader, MapData } from '../../interfaces';

export class FlxCSVLoader implements MapLoader {
    mapData: MapData = {
        width: 0,
        height: 0,
        layers: [],
        objects: [],
        tileset: '',
    };

    constructor(tileset: string) {
        this.mapData.tileset = tileset;
    }

    private parseLayerName(file: string): string {
        const [layerName] = string.match(file, '.*/[^_]+_(.+)%.csv$');
        return layerName || '';
    }

    public load(files: string[], objectLayer?: string): void {
        let maxWidth: number = 0;
        let maxHeight: number = 0;

        for (const file of files) {
            const [content, size] = love.filesystem.read(file);
            if (typeof size === 'string') error(size);

            const rows = content!.trim().split('\n');
            const width = rows[0].split(',').length;
            const height = rows.length;

            maxWidth = Math.max(maxWidth, width);
            maxHeight = Math.max(maxHeight, height);

            const name = this.parseLayerName(file);

            const tileData = rows.flatMap(row => row.split(',').map(col => Number(col) + 1));

            this.mapData.layers.push({ name, tileData });
        }

        this.mapData.width = maxWidth;
        this.mapData.height = maxHeight;
    }
}
