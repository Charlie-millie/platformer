import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {GameContext} from "../context";
import {Side} from "../constant";

export class Jump extends Trait {
    public duration = 0.3;
    public velocity = 200;
    public engageTime = 0;
    public ready = 0;
    public requestTime = 0;
    public gracePeriod = 0.1;
    public speedBoost = 0.3;

    public start() {
        this.requestTime = this.gracePeriod;
    }

    public cancel() {
        this.engageTime = 0;
        this.requestTime = 0;
    }

    public update(entity: Entity, {deltaTime}: GameContext) {
        if (this.requestTime > 0) {
            if (this.ready > 0) {
                entity.sounds.add('jump');
                this.engageTime = this.duration;
                this.requestTime = 0;
            }
            this.requestTime -= deltaTime;
        }

        if (this.engageTime > 0) {
            entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost);
            this.engageTime -= deltaTime;
        }

        this.ready -= 1;
    }

    public obstruct(entity: Entity, side: Side) {
        if (side === Side.bottom) {
            this.ready = 1;
        } else if (side === Side.top) {
            this.cancel();
        }
    }

    public get falling() {
        return this.ready < 0;
    }
}