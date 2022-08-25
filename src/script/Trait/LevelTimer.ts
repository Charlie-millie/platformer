import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {GameContext} from "../context";
import {Level} from "../Level";

export class LevelTimer extends Trait {
    static EVENT_TIMER_HURRY = Symbol('timer hurry');
    static EVENT_TIMER_OK = Symbol('timer ok');

    public totalTime = 300;
    public currentTime = this.totalTime;
    public hurryTime = 100;
    public hurryEmitted?: boolean;

    public update(entity: Entity, {deltaTime}: GameContext, level: Level) {
        this.currentTime -= deltaTime * 2;
        if (this.hurryEmitted !== true && this.currentTime < this.hurryTime) {
            level.events.emit(LevelTimer.EVENT_TIMER_HURRY);
            this.hurryEmitted = true;
        }

        if (this.hurryEmitted !== false && this.currentTime > this.hurryTime) {
            level.events.emit(LevelTimer.EVENT_TIMER_OK);
            this.hurryEmitted = false;
        }
    }
}