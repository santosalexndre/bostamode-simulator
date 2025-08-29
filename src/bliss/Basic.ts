export class Basic {
    public visible: boolean = true;
    public active: boolean = true;
    public dead: boolean = false;

    private static count: number = 0;
    private static idEnumerator: number = 0;
    public id: number = Basic.idEnumerator++;

    constructor() {
        Basic.count++;
    }

    update(dt: number): void {}

    render(): void {}

    kill(): void {
        this.dead = true;
        this.active = false;
        this.visible = false;
    }

    destroy(): void {
        this.dead = true;
        this.active = false;
        this.visible = false;
        Basic.count--;
    }
}
