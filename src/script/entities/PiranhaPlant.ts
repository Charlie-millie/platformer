import {Trait} from "../Trait";
import {Entity} from "./Entity";
import {GameContext} from "../context";
import {Level} from "../Level";

class PiranhaPlantBehavior extends Trait {
    public graceDistance = 32;
    public idleTime = 4;
    public idleCounter = 0;
    public attackTime = 2;
    public attackCounter = null;
    public holdTime = 2;
    public holdCounter = null;
    public retreatTime = 2;
    public retreatCounter = null;

    public velocity = 30;
    public deltaMove = 0;


    public update(entity: Entity, gameContext: GameContext, level: Level) {

    }
}