// bump.d.ts
declare namespace bump {
    interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    type FilterResponse = 'cross' | 'bounce' | 'slide' | 'touch' | null;

    interface Collision {
        overlaps: boolean;
        ti: number;
        move: { x: number; y: number };
        normal: { x: number; y: number };
        touch: { x: number; y: number };
        itemRect: Rect;
        otherRect: Rect;
        item?: any;
        other?: any;
        type?: string;
        slide?: { x: number; y: number };
        bounce?: { x: number; y: number };
    }

    type Filter = (item: any, other: any) => string | false | undefined;

    type Response = (
        world: World,
        col: Collision,
        x: number,
        y: number,
        w: number,
        h: number,
        goalX: number,
        goalY: number,
        filter: Filter,
    ) => LuaMultiReturn<[number, number, Collision[], number]>;

    interface World {
        add(item: any, x: number, y: number, w: number, h: number): any;
        remove(item: any): void;
        update(item: any, x: number, y: number, w?: number, h?: number): void;
        move(item: any, goalX: number, goalY: number, filter?: Filter): LuaMultiReturn<[number, number, Collision[], number]>;
        check(item: any, goalX: number, goalY: number, filter?: Filter): LuaMultiReturn<[number, number, Collision[], number]>;
        project(item: any, x: number, y: number, w: number, h: number, goalX?: number, goalY?: number, filter?: Filter): LuaMultiReturn<[Collision[], number]>;
        queryRect(x: number, y: number, w: number, h: number, filter?: Filter): LuaMultiReturn<[any[], number]>;
        queryPoint(x: number, y: number, filter?: Filter): LuaMultiReturn<[any[], number]>;
        querySegment(x1: number, y1: number, x2: number, y2: number, filter?: Filter): LuaMultiReturn<[any[], number]>;
        querySegmentWithCoords(
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            filter?: Filter,
        ): LuaMultiReturn<[Array<{ item: any; ti1: number; ti2: number; x1: number; y1: number; x2: number; y2: number }>, number]>;
        getRect(item: any): LuaMultiReturn<[number, number, number, number]>;
        getItems(): LuaMultiReturn<[any[], number]>;
        countItems(): number;
        hasItem(item: any): boolean;
        countCells(): number;
        addResponse(name: string, response: Response): void;
        toWorld(cx: number, cy: number): LuaMultiReturn<[number, number]>;
        toCell(x: number, y: number): LuaMultiReturn<[number, number]>;
    }
}

interface Bump {
    _VERSION: string;
    _URL: string;
    _DESCRIPTION: string;
    _LICENSE: string;

    newWorld(this: void, cellSize?: number): bump.World;

    rect: {
        getNearestCorner(x: number, y: number, w: number, h: number, px: number, py: number): [number, number];
        getSegmentIntersectionIndices(
            x: number,
            y: number,
            w: number,
            h: number,
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            ti1?: number,
            ti2?: number,
        ): [number, number, number, number, number, number] | undefined;
        getDiff(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): [number, number, number, number];
        containsPoint(x: number, y: number, w: number, h: number, px: number, py: number): boolean;
        isIntersecting(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean;
        getSquareDistance(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): number;
        detectCollision(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number, goalX?: number, goalY?: number): bump.Collision | undefined;
    };

    responses: {
        touch: bump.Response;
        cross: bump.Response;
        slide: bump.Response;
        bounce: bump.Response;
    };
}

declare const bump: Bump;
export = bump;
