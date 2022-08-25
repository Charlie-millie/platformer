import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {GameContext} from "../context";
import {Level} from "../Level";

type TriggerCondition = (entity: Entity, touches: Set<Entity>, gameContext: GameContext, level: Level) => void;

export class Trigger extends Trait {
    public touches = new Set<Entity>();
    public conditions: TriggerCondition[] = [];

    public collides(_: Entity, them: Entity) {
        this.touches.add(them);
    }

    public update(entity: Entity, gameContext: GameContext, level: Level) {
        if (this.touches.size > 0) {
            for (const condition of this.conditions) {
                condition(entity, this.touches, gameContext, level);
            }
            this.touches.clear();
        }
    }
}