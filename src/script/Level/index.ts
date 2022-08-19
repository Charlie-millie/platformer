import {Scene} from "./Scene";
import {Entity} from "../entities/Entity";
import {EntityCollider} from "../entities/EntityCollider";
import {TileCollider} from "../tiles/TileCollider";
import {MusicController} from "../sounds/MusicController";
import {Camera} from "../Camera";
import {GameContext} from "../context";

export class Level extends Scene {
    static EVENT_TRIGGER = Symbol('trigger');

    public name = '';
    public entities = new Set<Entity>();
    public entityCollider = new EntityCollider(this.entities);
    public tileCollider = new TileCollider();
    public music = new MusicController();
    public camera = new Camera();

    public gravity = 1500;
    public totalTime = 0;

    public update(gameContext: GameContext) {
        this.entities.forEach((entity) => {
            entity.update(gameContext, this);
        });
        this.entities.forEach((entity) => {
            this.entityCollider.check(entity);
        });
        this.entities.forEach((entity) => {
            entity.finalize();
        });
        this.totalTime += gameContext.deltaTime;

    }



}