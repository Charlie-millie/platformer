import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {Killable} from "./Killable";

export class Stomper extends Trait {
    static EVENT_STOMP = Symbol('stomp');

    public bounceSpeed = 400;

    public bounce(us: Entity, them: Entity) {
        us.bounds.bottom = them.bounds.top;
        us.vel.y = -this.bounceSpeed;
    }

    public collides(us: Entity, them: Entity) {
        const killable = them.getTrait(Killable);
        if (!killable || killable.dead) {
            return;
        }

        if (us.vel.y > them.vel.y) {
            this.queue(() => this.bounce(us, them));
            us.sounds.add('stomp');
            us.events.emit(Stomper.EVENT_STOMP, us, them);
        }
    }
}