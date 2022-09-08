import {Trait} from "./index";
import {GameContext} from "../context";
import {Entity} from "../entities/Entity";

export class Velocity extends Trait {
    public update(entity: Entity, {deltaTime}: GameContext) {
        entity.pos.x += entity.vel.x * deltaTime;
        entity.pos.y += entity.vel.y * deltaTime;
    }
}