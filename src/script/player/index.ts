import {Entity} from "../entities/Entity";
import {Player} from "../Trait/Player";
import {PlayerController} from "../Trait/PlayerController";

export function createPlayerEnv(playerEntity: Entity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController(playerEntity);
    playerControl.checkPoint.set(64, 64);
    playerEnv.addTrait(playerControl);
    return playerEnv;
}

export function* findPlayers(entities: Iterable<Entity>) {
    for (const entity of entities) {
        if (entity.getTrait(Player)) yield entity;
    }
}

export function makePlayer(entity: Entity, name: string) {
    const player = new Player();
    player.name = name;
    entity.addTrait(player);
}
