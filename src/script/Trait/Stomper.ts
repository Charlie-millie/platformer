import {Trait} from "./index";
import {Entity} from "../entities/Entity";

export class Stomper extends Trait {
    static EVENT_STOMP = Symbol('stomp');

    public bounceSpeed = 400;

    public bounce(us: Entity, them: Entity) {
        us.bounds.bottom = them.bounds.top;
        us.vel.y = -this.bounceSpeed;
    }

    public collides(us: Entity, them: Entity) {
        // const killable = them.getTrait()
    }
}