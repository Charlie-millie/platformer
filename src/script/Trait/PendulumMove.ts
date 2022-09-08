import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {Side} from "../constant";

export class PendulumMove extends Trait {
    public speed = -30;
    public enabled = true;

    public update(ent: Entity) {
        if (this.enabled) {
            ent.vel.x = this.speed;
        }
    }

    public obstruct(ent: Entity, side: Side) {
        if (side === Side.left) {
            this.speed = Math.abs(this.speed);
        } else if (side === Side.right) {
            this.speed = -Math.abs(this.speed);
        }
    }
}