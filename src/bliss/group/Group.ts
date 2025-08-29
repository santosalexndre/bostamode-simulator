import { BlendAlphaMode, BlendMode, getBlendMode, setBlendMode } from 'love.graphics';
import { Basic } from '../Basic';
import { main } from '../Main';

export class Group<T extends Basic = Basic> extends Basic {
    protected members: T[] = [];

    /**
     * The blend mode to use when drawing the group
     * You should prefer this instead of manually setting blendmode per object
     * because it breaks spritebatching
     * @see [BlendMode - love wiki](https://love2d.org/wiki/love.graphics.setBlendMode)
     * @default 'alpha'
     */
    public blendMode: BlendMode = 'alpha';

    /**
     * The alpha blend mode to use when drawing the group
     */
    public blendAlphaMode: BlendAlphaMode = 'alphamultiply';

    public add<U extends T>(o: U): U {
        this.members.push(o);
        return o;
    }

    public count(): number {
        return this.members.length;
    }

    public clear() {
        for (const m of this.members) {
            if ((m as any).body) main.world.remove((m as any).body);
        }
        this.members = [];
        this.members.length = 0;
    }

    public forEach(callback: (o: T) => void) {
        for (const m of this.members) callback(m);
    }

    public forEachAlive(callback: (o: T) => void) {
        for (const m of this.members) if (!m.dead) callback(m);
    }

    public override update(dt: number) {
        super.update(dt);

        for (const m of this.members) {
            if (m.active) m.update(dt);
        }

        for (const i of $range(this.members.length, 1, -1)) {
            const m = this.members[i - 1];
            if (m.dead) {
                if ((m as any).body) main.world.remove((m as any).body);
                m.destroy();
                table.remove(this.members, i);
            }
        }
    }

    public override render() {
        super.render();
        const [blendMode, alphaMode] = getBlendMode();

        setBlendMode(this.blendMode);

        for (const m of this.members) {
            if (m.visible) m.render();
        }
        setBlendMode(blendMode, alphaMode);
    }
}
