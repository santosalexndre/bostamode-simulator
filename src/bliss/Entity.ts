import * as bump from '../libraries/bump';
import { trace } from '../libraries/inspect';
import vec, { Point } from '../libraries/nvec';
import * as Timer from '../libraries/timer';
import { Basic } from './Basic';
import { ICollision } from './interfaces';
import { main } from './Main';

export class Entity extends Basic {
    private static filterDefs: Record<string, Record<string, bump.FilterResponse>> = new LuaTable() as any;

    public position: Point;
    public scale: Point = vec(1, 1);
    /** Rotation in degrees */
    public rotation: number = 0;
    public velocity: Point = vec(0, 0);
    public alpha: number = 1;

    private _anchorX = 0.5;
    private _anchorY = 0.5;
    private _anchorOffsetX: number = 0;
    private _anchorOffsetY: number = 0;

    public width: number = 0;
    public height: number = 0;
    public top: number = 0;
    public left: number = 0;
    public right: number = 0;
    public bottom: number = 0;
    public body?: any;
    private _hitboxOffsetX: number = 0;
    private _hitboxOffsetY: number = 0;

    // Mask thing idk chat gpt did this was just testing stuff
    // private static _tags: Record<string, number> = new LuaTable() as any;
    // private static _nextBit = 0;
    public tag: string;
    private _filters: Record<string, bump.FilterResponse> = new LuaTable() as any;
    protected ignoreCollision: boolean = false;
    // private tagMask: number = 0;
    // private _maskSlide = 0;
    // private _maskBounce = 0;
    // private _maskCross = 0;
    // private _maskTouch = 0;
    // private _maskIgnore = 0;
    // private _interestMask = 0;

    public timer: Timer = Timer();
    public lifetime: number = 0;

    constructor(x: number = 0, y: number = 0) {
        super();
        this.tag = this.tag || this['constructor'].name.toLowerCase();
        this.position = vec(x, y);
    }

    override update(dt: number): void {
        this.timer.update(dt);
        this.lifetime += dt;

        this.move(dt);
    }

    public anchor(x: number, y: number) {
        this._anchorX = x;
        this._anchorY = y;
    }

    public setCollisionFilters(filter: Record<string, bump.FilterResponse>): void {
        if (!Entity.filterDefs[this['constructor'].name]) {
            Entity.filterDefs[this['constructor'].name] = filter;
        }
        this._filters = Entity.filterDefs[this['constructor'].name];
    }

    /** @noSelf */
    private static filterFn(item: Entity, other: Entity): bump.FilterResponse {
        if (item.ignoreCollision) return null;
        return item._filters[other.tag];
    }

    public setHitbox(top: number, left: number, right?: number, bottom?: number): Entity {
        // public setHitbox(a: number, b: number, c?: number, d?: number): FlxObject
        const width = right! - left;
        const height = bottom! - top;
        this.width = width;
        this.height = height;

        this.top = top;
        this.left = left;
        this.right = right!;
        this.bottom = bottom!;

        this.body = main.world.add(this, this.position.x, this.position.y, this.width, this.height);
        return this;
    }

    // private static getTag(tag: string) {
    //     tag = tag.toLowerCase();
    //     if (Entity._tags[tag] === undefined) {
    //         if (Entity._nextBit >= 32) throw 'Maximum of 32 tags exceeded';
    //         Entity._tags[tag] = 1 << Entity._nextBit;
    //         Entity._nextBit++;
    //     }
    //     return Entity._tags[tag];
    // }

    // public addTag(tag: string) {
    //     this.tagMask |= Entity.getTag(tag);
    // }

    // public removeTag(tag: string) {
    //     if (Entity._tags[tag] === undefined) throw `Tag '${tag}' does not exist`;
    //     this.tagMask &= ~Entity._tags[tag];
    // }

    // public hasTag(tag: string) {
    //     if (Entity._tags[tag] === undefined) return false;
    //     return (this.tagMask & Entity._tags[tag]) > 0;
    // }

    // debug function idk
    // public printTags() {
    //     let tags = [];
    //     for (const [name, b] of Entity._tags as any as LuaTable) {
    //         // print('cu', b);
    //         if ((b & this.tagMask) > 0) tags.push(name);
    //     }
    //     print(tags.join(', '));
    // }

    // // --- filter helpers ---
    // public setFilter(tag: string, resp: bump.FilterResponse | 'ignore') {
    //     // clear tagBit from all masks
    //     const tagBit = Entity.getTag(tag);
    //     this._maskSlide &= ~tagBit;
    //     this._maskBounce &= ~tagBit;
    //     this._maskCross &= ~tagBit;
    //     this._maskTouch &= ~tagBit;

    //     if (resp === 'ignore') this._maskIgnore |= tagBit;
    //     if (resp === 'slide') this._maskSlide |= tagBit;
    //     if (resp === 'bounce') this._maskBounce |= tagBit;
    //     if (resp === 'cross') this._maskCross |= tagBit;
    //     if (resp === 'touch') this._maskTouch |= tagBit;

    //     this._interestMask = this._maskSlide | this._maskBounce | this._maskCross | this._maskTouch | this._maskIgnore;
    // }
    // private static filterFn(item: Entity, other: Entity): bump.FilterResponse {
    //     const overlap = item._interestMask & other.tagMask;
    //     if (overlap === 0) return 'slide';

    //     if ((overlap & item._maskIgnore) > 0) return null;
    //     if ((overlap & item._maskSlide) > 0) return 'slide';
    //     if ((overlap & item._maskBounce) > 0) return 'bounce';
    //     if ((overlap & item._maskCross) > 0) return 'cross';
    //     if ((overlap & item._maskTouch) > 0) return 'touch';
    //     return null;
    // }

    public move(dt: number) {
        const dx = this.velocity.x;
        const dy = this.velocity.y;
        if (this.velocity === vec.zero) return;

        if (this.body) {
            const world = main.world;

            const [bx, by, cols, len] = world.move(
                this,
                this.position.x + this.left + this._hitboxOffsetX + dx * dt,
                this.position.y + this.top + this._hitboxOffsetY + dy * dt,
                Entity.filterFn as any,
            );

            this.position.x = bx - this.left - this._hitboxOffsetX;
            this.position.y = by - this.top - this._hitboxOffsetY;

            if (len > 0) {
                for (const col of cols) {
                    //@ts-expect-error
                    col.tags = col.tags;
                    this.onCollision(col as ICollision);
                }
            }
        } else {
            this.position.x += dx * dt;
            this.position.y += dy * dt;
        }
    }

    protected onCollision(col: ICollision): void {}
}
