import {loadSpriteSheet} from "../loaders/sprite";
import {Entity} from "./Entity";
import {PendulumMove} from "../Trait/PendulumMove";
import {Trait} from "../Trait";
import {Killable} from "../Trait/Killable";
import {Stomper} from "../Trait/Stomper";
import {Solid} from "../Trait/Solid";
import {GameContext} from "../context";
import {Physics} from "../Trait/Physics";
import {SpriteSheet} from "../animation/SpriteSheet";

enum KoopaState {
    walking,
    hiding,
    panic
}

class KoopaBehavior extends Trait {
    public state = KoopaState.walking;
    public hideTime = 0;
    public hideDuration = 5;
    public panicSpeed = 300;
    public walkSpeed?: number;

    public collides(us: Entity, them: Entity) {
        if (us.getTrait(Killable)?.dead) {
            return;
        }

        const stomper = them.getTrait(Stomper);
        if (stomper) {
            if (them.vel.y > us.vel.y) {
                this.handleStomp(us, them);
            } else {
                this.handleNudge(us, them);
            }
        }
    }

    public handleStomp(us: Entity, them: Entity) {
        switch (this.state) {
            case KoopaState.walking:
                this.hide(us);
                break;
            case KoopaState.hiding:
                us.useTrait(Killable, (it) => it.kill());
                us.vel.set(100, -200);
                us.useTrait(Solid, (s) => (s.obstructs = false));
                break;
            case KoopaState.panic:
                this.hide(us);
                break;
        }
    }

    public handleNudge(us: Entity, them: Entity) {
        const kill = () => {
            const killable = them.getTrait(Killable);
            if (killable) {
                killable.kill();
            }
        };
        let travelDir, impactDir;
        switch (this.state) {
            case KoopaState.walking:
                kill();
                break;
            case KoopaState.hiding:
                this.panic(us, them);
                break;
            case KoopaState.panic:
                travelDir = Math.sign(us.vel.x);
                impactDir = Math.sign(us.pos.x - them.pos.x);
                if (travelDir !== 0 && travelDir !== impactDir) {
                    kill();
                }
                break;
        }
    }

    public hide(us: Entity) {
        us.useTrait(PendulumMove, (walk) => {
            us.vel.x = 0;
            walk.enabled = false;

            if (!this.walkSpeed) {
                this.walkSpeed = walk.speed;
            }

            this.state = KoopaState.hiding;
            this.hideTime = 0;
        });
    }

    public unhide(us: Entity) {
        us.useTrait(PendulumMove, (walk) => {
            walk.enabled = true;
            if (this.walkSpeed != null) walk.speed = this.walkSpeed;
            this.state = KoopaState.walking;
        });
    }

    public panic(us: Entity, them: Entity) {
        us.useTrait(PendulumMove, (pm) => {
            pm.speed = this.panicSpeed * Math.sign(them.vel.x);
            pm.enabled = true;
        });
        this.state = KoopaState.panic;
    }

    public update(us: Entity, {deltaTime}: GameContext) {
        if (this.state === KoopaState.hiding) {
            this.hideTime += deltaTime;
            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
    }

}

export class Koopa extends Entity {
    public walk = this.addTrait(new PendulumMove());
    public behavior = this.addTrait(new KoopaBehavior());
    public killable = this.addTrait(new Killable());
    public solid = this.addTrait(new Solid());
    public physics = this.addTrait(new Physics());

    public walkAnim = this.sprites.getAnimation('walk');
    public wakeAnim = this.sprites.getAnimation('wake');

    constructor(private sprites: SpriteSheet) {
        super();
        this.size.set(16, 16);
        this.offset.set(0, 8);
    }

    public draw(context: CanvasRenderingContext2D) {
        this.sprites.draw(this.routeAnim(), context, 0, 0, this.vel.x < 0);
    }

    private routeAnim() {
        switch (this.behavior.state) {
            case KoopaState.hiding:
                if (this.behavior.hideTime > 3) {
                    return this.wakeAnim(this.behavior.hideTime);
                }
                return 'hiding';

            case KoopaState.panic:
                return 'hiding';

            default:
                return this.walkAnim(this.lifetime);
        }
    }

}

export async function loadKoopa() {
    const sprites = await loadSpriteSheet('koopa');

    return function createKoopa() {
        return new Koopa(sprites);
    }
}