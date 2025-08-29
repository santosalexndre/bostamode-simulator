// Represents a Tiled map exported in Lua (or JSON with same schema)
export interface TiledMap {
    version: string;
    luaversion?: string;
    tiledversion: string;
    class: string;
    orientation: 'orthogonal' | 'isometric' | 'staggered' | 'hexagonal';
    renderorder: 'right-down' | 'right-up' | 'left-down' | 'left-up';
    width: number; // map width in tiles
    height: number; // map height in tiles
    tilewidth: number; // tile width in pixels
    tileheight: number; // tile height in pixels
    nextlayerid: number;
    nextobjectid: number;
    properties: Record<string, any>;
    tilesets: TiledTileset[];
    layers: TiledLayer[];
}

export interface TiledTileset {
    name: string;
    firstgid: number;
    class: string;
    tilewidth: number;
    tileheight: number;
    spacing: number;
    margin: number;
    columns: number;
    image: string;
    imagewidth: number;
    imageheight: number;
    objectalignment: string;
    tilerendersize: string;
    fillmode: string;
    tileoffset: {
        x: number;
        y: number;
    };
    grid: {
        orientation: string;
        width: number;
        height: number;
    };
    properties: Record<string, any>;
    wangsets: any[];
    tilecount: number;
    tiles: Record<string, any>;
}

export type TiledLayer = TiledTileLayer | TiledObjectLayer | TiledImageLayer | TiledGroupLayer;

export interface TiledTileLayer {
    type: 'tilelayer';
    id: number;
    name: string;
    class: string;
    x: number;
    y: number;
    width: number; // in tiles
    height: number; // in tiles
    visible: boolean;
    opacity: number;
    offsetx: number;
    offsety: number;
    parallaxx: number;
    parallaxy: number;
    properties: Record<string, any>;
    encoding?: 'lua' | 'csv' | 'base64';
    data: number[]; // tile IDs (0 = empty)
}

export interface TiledObjectLayer {
    type: 'objectgroup';
    id: number;
    name: string;
    class: string;
    visible: boolean;
    opacity: number;
    offsetx: number;
    offsety: number;
    parallaxx: number;
    parallaxy: number;
    properties: Record<string, any>;
    draworder: 'topdown' | 'index';
    objects: TiledObject[];
}

export interface TiledObject {
    id: number;
    name: string;
    class: string;
    type?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    visible: boolean;
    properties: Record<string, any>;
}

export interface TiledImageLayer {
    type: 'imagelayer';
    id: number;
    name: string;
    class: string;
    visible: boolean;
    opacity: number;
    offsetx: number;
    offsety: number;
    parallaxx: number;
    parallaxy: number;
    properties: Record<string, any>;
    image: string;
}

export interface TiledGroupLayer {
    type: 'group';
    id: number;
    name: string;
    class: string;
    visible: boolean;
    opacity: number;
    offsetx: number;
    offsety: number;
    parallaxx: number;
    parallaxy: number;
    properties: Record<string, any>;
    layers: TiledLayer[];
}
