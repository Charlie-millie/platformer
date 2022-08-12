
type CallBack = (...args: any[]) => void;
type Listener = {
    name: string| symbol;
    callBack: CallBack
};

export class EventEmitter {
    private listeners: Listener[] = [];

    public listen(name: string | symbol, callBack: CallBack) {
        this.listeners.push({
            name,
            callBack
        });
    }

    public emit(name: string | symbol, ...args: any[]) {
        this.listeners.filter(it => it.name === name).forEach(it => it.callBack(...args));
    }
}