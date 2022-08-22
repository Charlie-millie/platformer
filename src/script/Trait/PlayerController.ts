import {Trait} from "./index";
import {Vec2} from "../Math";
import {Entity} from "../entities/Entity";
import {GameContext} from "../context";
import {Level} from "../Level";
import {Killable} from "./Killable";

export class PlayerController extends Trait {
    public checkPoint = new Vec2(0, 0);

    constructor(private player: Entity) {
        super();
    }

    public update(_: Entity, __: GameContext, level: Level) {
        if (!level.entities.has(this.player)) {
            this.player.getTrait(Killable)?.revive();
            this.player.pos.set(this.checkPoint.x, this.checkPoint.y);
            level.entities.add(this.player);
        }
    }
}