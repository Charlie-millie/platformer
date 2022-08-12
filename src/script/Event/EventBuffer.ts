type Event = {
    name: string | symbol;
    args: any[]
};

export class EventBuffer {
    private events: Event[] = [];

    public emit(name: string | symbol, ...args: any[]) {
        this.events.push({
            name,
            args
        });
    }

    public process(name: string | symbol, callBack: (...args: any[]) => void) {
        for (const event of this.events) {
            if (event.name === name) {
                callBack(...event.args);
            }
        }
    }

    public clear() {
        this.events.length = 0;
    }

}