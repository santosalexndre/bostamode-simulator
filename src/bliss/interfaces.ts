import { Dialogue } from '../game/Dialogue';
import * as bump from '../libraries/bump';
import type { State } from './State';

export interface IUpdatable {
    update(dt: number): void;
}

export interface IRenderable {
    render(): void;
}

export interface IObject extends IUpdatable, IRenderable {}

export interface ICollision extends bump.Collision {
    tags: Set<string>;
}

export interface Maplayer {
    name: string;
    tileData: number[];
}

export type StateConstructor = new (...args: any[]) => State;

export interface MapObject {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    name?: string;
}

export interface MapData {
    layers: Maplayer[];
    objects: MapObject[];
    tileset: string;
    width: number;
    height: number;
}
export interface MapLoader {
    mapData: MapData;
    load(path: string | string[], objectLayer?: string): void; // jsut testing stuff for now>.
}

export interface IViewport {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TimerHandle {
    time: number;
    limit: number;
    count: number;
    during: (dt: number, remaining: number) => void;
    after: (self?: any) => void | boolean;
}
