import {Trait} from "./index";
import {Entity} from "../entities/Entity";
import {GameContext} from "../context";
import {Level} from "../Level";

export class Killable extends Trait {
    public dead = false;
    public deadTime = 0;
    public removeAfter = 2;

    public kill() {
        this.queue(() => {
            this.dead = true;
        });
    }

    public revive() {
        this.dead = false;
        this.deadTime = 0;
    }

    public update(entity: Entity, {deltaTime}: GameContext, level: Level) {
        if (this.dead) {
            this.deadTime += deltaTime;
            if (this.deadTime > this.removeAfter) {
                this.queue(() => {
                    level.entities.delete(entity);
                });
            }
        }
    }
}