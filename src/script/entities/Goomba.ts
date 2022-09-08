import {loadSpriteSheet} from "../loaders/sprite";
import {Entity} from "./Entity";
import {Trait} from "../Trait";
import {Killable} from "../Trait/Killable";
import {Stomper} from "../Trait/Stomper";
import {PendulumMove} from "../Trait/PendulumMove";
import {Solid} from "../Trait/Solid";
import {Physics} from "../Trait/Physics";
import {SpriteSheet} from "../animation/SpriteSheet";
import {Animation} from "../animation";

class GoombaBehavior extends Trait {
    public collides(us: Entity, them: Entity) {
        if (us.getTrait(Killable)?.dead) {
            return;
        }

        const stomper = them.getTrait(Stomper);
        if (stomper) {
            if (them.vel.y > us.vel.y) {
                us.useTrait(PendulumMove, (pm) => (pm.speed = 0));
                us.useTrait(Killable, (k) => k.kill());
            } else {
                them.getTrait(Killable)?.kill();
            }
        }
    }
}

export class Goomba extends Entity {
    public walk = this.addTrait(new PendulumMove());
    public behavior = this.addTrait(new GoombaBehavior());
    public killable = this.addTrait(new Killable());
    public solid = this.addTrait(new Solid());
    public physics = this.addTrait(new Physics());

    constructor(private sprites: SpriteSheet, private walkAnim: Animation) {
        super();
        this.size.set(16, 16);
    }

    public draw(context: CanvasRenderingContext2D) {
        this.sprites.draw(this.routeAnim(), context, 0, 0);
    }

    private routeAnim() {
        if (this.killable.dead) {
            return 'flat';
        }
        return this.walkAnim(this.lifetime);
    }
}

export async function loadGoomba() {
    const sprites = await loadSpriteSheet('goomba');
    const walkAnim = sprites.getAnimation('walk');

    return function createGoomba() {
        return new Goomba(sprites, walkAnim);
    }
}