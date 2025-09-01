class Subscription<T> {
    private event: Signal<T>;
    private callback: (payload: T) => void;

    constructor(event: Signal<T>, callback: (payload: T) => void) {
        this.event = event;
        this.callback = callback;
    }

    public disconnect(): void {
        this.event.disconnect(this);
    }

    public emit(payload: T): void {
        this.callback(payload);
    }
}

export class Signal<T = void> {
    private subscriptions: Subscription<T>[];

    constructor() {
        this.subscriptions = [];
    }

    public connect(callback: (payload: T) => void) {
        const subscription = new Subscription<T>(this, callback);
        this.subscriptions.push(subscription);
    }

    public disconnect(subscription: Subscription<T>) {
        this.subscriptions = this.subscriptions.filter(x => x !== subscription);
    }

    public clear() {
        this.subscriptions = [];
    }

    public emit(payload: T): void {
        const subscriptions = [...this.subscriptions];
        for (const subscription of subscriptions) {
            subscription.emit(payload);
        }
    }
}
