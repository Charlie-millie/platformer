import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {GameContext} from "../context";
import {Level} from "../Level";

export class Physics extends Trait {
    public update(entity: Entity, gameContext: GameContext, level: Level) {
        entity.pos.x += entity.vel.x * gameContext.deltaTime;
        level.tileCollider.checkX(entity, gameContext, level);

        entity.pos.y += entity.vel.y * gameContext.deltaTime;
        level.tileCollider.checkY(entity, gameContext, level);

        entity.vel.y += level.gravity * gameContext.deltaTime;
    }
}