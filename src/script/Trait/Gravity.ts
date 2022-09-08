import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {GameContext} from "../context";
import {Level} from "../Level";

export class Gravity extends Trait {
    public update(entity: Entity, {deltaTime}: GameContext, level: Level) {
        entity.vel.y += level.gravity * deltaTime;
    }
}