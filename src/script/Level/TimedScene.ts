import {Scene} from "./Scene";
import {GameContext} from "../context";

export class TimedScene extends Scene {
    public countDown = 2;

    public update(gameContext: GameContext) {
        this.countDown -= gameContext.deltaTime;
        if (this.countDown <= 0) {
            this.events.emit(Scene.EVENT_COMPLETE);
        }
    }
}