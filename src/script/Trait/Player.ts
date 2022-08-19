import {Trait} from "./index";

export class Player extends Trait {
    public name = 'UNNAMED';
    public coins = 0;
    public lives = 3;
    public score = 0;

    constructor() {
        super();

        // this.listen()

    }

}