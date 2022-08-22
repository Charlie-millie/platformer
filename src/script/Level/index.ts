import {Scene} from "./Scene";
import {Entity} from "../entities/Entity";
import {EntityCollider} from "../entities/EntityCollider";
import {TileCollider} from "../tiles/TileCollider";
import {MusicController} from "../sounds/MusicController";
import {Camera} from "../Camera";
import {GameContext} from "../context";
import {findPlayers} from "../player";

function focusPlayer(level: Level) {
    for (const player of findPlayers(level.entities)) {
        level.camera.pos.x = Math.max(0, player.pos.x - 100);
    }
}

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
        focusPlayer(this);

    }

    public draw(gameContext: GameContext) {
        this.comp.draw(gameContext.videoContext, this.camera);
    }

    public pause() {
        this.music.pause();
    }


}