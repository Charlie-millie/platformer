import {Scene} from "./Scene";
import {Entity} from "../entities/Entity";
import {EntityCollider} from "../entities/EntityCollider";

export class Level extends Scene {
    static EVENT_TRIGGER = Symbol('trigger');

    public name = '';
    public entities = new Set<Entity>();
    public entityCollider = new EntityCollider(this.entities);
    // public tileCollider =


}