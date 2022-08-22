import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {GameContext} from "../context";
import {Jump} from "./Jump";

export class Go extends Trait {
    public dir = 0;
    public acceleration = 400;
    public distance = 0;
    public heading = 1;
    public dragFactor = 1 / 5000;
    public deceleration = 300;

    public update(entity: Entity, {deltaTime}: GameContext) {
        const absX = Math.abs(entity.vel.x);

        if (this.dir !== 0) {
            entity.vel.x += this.acceleration * this.dir * deltaTime;

            const jump = entity.getTrait(Jump);
            if (jump) {
                if (!jump.falling) {
                    this.heading = this.dir;
                }
            } else {
                this.heading = this.dir;
            }

        } else if (entity.vel.x !== 0) {
            const decel = Math.min(absX, this.deceleration * deltaTime);
            entity.vel.x += -Math.sign(entity.vel.x) * decel;
        } else {
            this.distance = 0;
        }
        const drag = this.dragFactor * entity.vel.x * absX;
        entity.vel.x -= drag;

        this.distance += absX * deltaTime;
    }
}