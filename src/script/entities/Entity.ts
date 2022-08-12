import {Vec2} from "../Math";
import {BoundingBox} from "../Math/BoundingBox";
import {Trait} from "../Trait";
import {EventBuffer} from "../Event/EventBuffer";

type TraitConstructor<T extends Trait> = new (...args: unknown[]) => T;

export class Entity {
    //audio
    public pos = new Vec2();
    public vel = new Vec2();
    public size = new Vec2();
    public offset = new Vec2();
    public bounds = new BoundingBox(this.pos, this.size, this.offset);
    public traits = new Map<Function, Trait>();
    public lifetime = 0;
    public sounds = new Set<string>();
    public events = new EventBuffer();

    public addTrait<T extends Trait>(trait: T) {
        this.traits.set(trait.constructor, trait);
        return trait;
    }

    public getTrait<T extends Trait>(TraitClass: TraitConstructor<T>): T | undefined {
        const trait = this.traits.get(TraitClass);
        if (trait instanceof TraitClass) {
            return trait;
        }
    }

    


}