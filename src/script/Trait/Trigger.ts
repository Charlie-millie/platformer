import {Trait} from "./index";
import {Entity} from "../entities/Entity";

export class Trigger extends Trait {
    public touches = new Set<Entity>();

}