import {Compositor} from "../Layer/Compositor";
import {EventEmitter} from "../Event/EventEmitter";
import {GameContext} from "../context";
import {Camera} from "../Camera";

export class Scene {
    static EVENT_COMPLETE = Symbol('scene complete');

    public comp = new Compositor();
    public events = new EventEmitter();

    public draw(gameContext: GameContext) {
        this.comp.draw(gameContext.videoContext, new Camera());
    }

    public update(gameContext: GameContext) {}
    public pause() {}
}