export type KeyListener = (keyState: number) => void;

export class Keyboard {
    public keyStates = new Map<string, number>();
    public keyListeners = new Map<string, KeyListener>();

    public addListener(code: string, callBack: KeyListener) {
        this.keyListeners.set(code, callBack);
        this.keyStates.set(code, 0);
    }

    public listenTo(target: EventTarget) {
        const keyEvents = ['keydown', 'keyup'];
        keyEvents.forEach(eventName => {
            target.addEventListener(eventName, event => {
                this.handleEvent(event as KeyboardEvent);
            });
        });
    }

    private handleEvent(event: KeyboardEvent) {
        if (event.repeat) return;

        const listener = this.keyListeners.get(event.code);
        const keyState = event.type === 'keydown' ? 1 : 0;
        if (listener) {
            this.keyStates.set(event.code, keyState);
            listener(keyState);
            event.preventDefault();
        }
    }
}