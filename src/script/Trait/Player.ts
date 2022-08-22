import {Trait} from "./index";
import {Stomper} from "./Stomper";
import {Entity} from "../entities/Entity";

const COIN_LIFE_THRESHOLD = 100;

export class Player extends Trait {
    public name = 'UNNAMED';
    public coins = 0;
    public lives = 3;
    public score = 0;

    constructor() {
        super();

        this.listen(Stomper.EVENT_STOMP, () => {
            this.score += 100;
        });

    }

    public addCoins(count: number) {
        this.coins += count;
        while(this.coins >= COIN_LIFE_THRESHOLD) {
            this.addLives(1);
            this.coins -= COIN_LIFE_THRESHOLD;
        }
        this.queue((entity: Entity) => entity.sounds.add('coin'));
    }

    public addLives(count: number) {
        this.lives += count;
    }
}