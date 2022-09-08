import {loadSpriteSheet} from "../loaders/sprite";
import {Entity} from "./Entity";
import {Trait} from "../Trait";
import {Gravity} from "../Trait/Gravity";
import {Killable} from "../Trait/Killable";
import {Stomper} from "../Trait/Stomper";
import {GameContext} from "../context";
import {Level} from "../Level";
import {Velocity} from "../Trait/Velocity";

class BulletBehavior extends Trait {
    public gravity = new Gravity();

    public collides(us: Entity, them: Entity) {
        if (us.getTrait(Killable)?.dead) {
            return;
        }

        const stomper = them.getTrait(Stomper);
        if (stomper) {
            if (them.vel.y > us.vel.y) {
                us.getTrait(Killable)?.kill();
                us.vel.set(100, -200);
            } else {
                them.getTrait(Killable)?.kill();
            }
        }
    }

    public update(entity: Entity, gameContext: GameContext, level: Level) {
        if (entity.getTrait(Killable)?.dead) {
            this.gravity.update(entity, gameContext, level);
        }
    }
}

export async function loadBullet() {
    const sprites = await loadSpriteSheet('bullet');

    return function createBullet() {
        const bullet = new Entity();

        bullet.size.set(16, 14);
        bullet.vel.set(80, 0);

        bullet.addTrait(new BulletBehavior());
        bullet.addTrait(new Killable());
        bullet.addTrait(new Velocity());

        bullet.draw = (context) => {
            sprites.draw('bullet', context, 0, 0, bullet.vel.x < 0);
        }

        return bullet;
    }
}