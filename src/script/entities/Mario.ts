import {Entity} from "./Entity";
import {Jump} from "../Trait/Jump";
import {Go} from "../Trait/Go";
import {Stomper} from "../Trait/Stomper";
import {Killable} from "../Trait/Killable";

export class Mario extends Entity {
    public jump = this.addTrait(new Jump());
    public go = this.addTrait(new Go());
    public stomper = this.addTrait(new Stomper());
    public killable = this.addTrait(new Killable());



}