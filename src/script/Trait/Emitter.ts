import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {GameContext} from "../context";
import {Level} from "../Level";

type EmitterFn = (entity: Entity, gameContext: GameContext, level: Level) => void;
export class Emitter extends Trait {
    public interval = 2;
    public coolDown = this.interval;
    public emitters: EmitterFn[] = [];

    public update(entity: Entity, gameContext: GameContext, level: Level) {
        this.coolDown -= gameContext.deltaTime;
        if (this.coolDown <= 0) {

        }
    }

    public emit(entity: Entity, gameContext: GameContext, level: Level) {
        for (const emitter of this.emitters) {
            emitter(entity, gameContext, level);
        }
    }
}