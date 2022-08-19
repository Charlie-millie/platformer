import {Entity} from "../entities/Entity";
import {GameContext} from "../context";
import {Level} from "../Level";
import {Side} from "../constant";
import {TileResolverMatch} from "../tiles/TileResolverMatch";

type TraitListener = {
    name: string | symbol,
    callBack: () => void,
    count: number
};

type TraitTask = (...args: any[]) => void;

export abstract class Trait {
    static EVENT_TASK = Symbol('task');
    private listeners: TraitListener[] = [];
    protected listen(name: string | symbol, callBack: () => void, count = Infinity) {
        this.listeners.push(
            {
                name,
                callBack,
                count
            }
        );
    }

    public queue(task: TraitTask) {
        this.listen(Trait.EVENT_TASK, task, 1);
    }

    public finalize(entity: Entity) {
        for (const listener of this.listeners) {
            entity.events.process(listener.name, listener.callBack);
            listener.count -= 1;
        }
        this.listeners = this.listeners.filter((listener) => listener.count > 0);
    }

    public update(entity: Entity, gameContext: GameContext, level: Level) {}
    public obstruct(entity: Entity, side: Side, match: TileResolverMatch) {}
    public collides(us: Entity, them: Entity) {}
}