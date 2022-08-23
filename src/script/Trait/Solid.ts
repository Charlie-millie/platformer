import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {Side} from "../constant";
import {TileResolverMatch} from "../tiles/TileResolverMatch";

export class Solid extends Trait {
    public obstructs = true;

    public obstruct(entity: Entity, side: Side, match: TileResolverMatch) {
        if (!this.obstructs) return;

        switch (side) {
            case Side.bottom:
                entity.bounds.bottom = match.y1;
                entity.vel.y = 0;
                break;
            case Side.top:
                entity.bounds.top = match.y2;
                entity.vel.y = 0;
                break;
            case Side.right:
                entity.bounds.right = match.x1;
                entity.vel.x = 0;
                break;
            case Side.left:
                entity.bounds.left = match.x2;
                entity.vel.x = 0;
                break;
        }
    }
}