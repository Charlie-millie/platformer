import {Vec2} from "../Math";
import {BoundingBox} from "../Math/BoundingBox";
import {Trait} from "../Trait";
import {EventBuffer} from "../Event/EventBuffer";
import {GameContext} from "../context";
import {Level} from "../Level";
import {Side} from "../constant";
import {TileResolverMatch} from "../tile/TileResolverMatch";
import {AudioBoard} from "../sounds/AudioBoard";

type TraitConstructor<T extends Trait> = new (...args: unknown[]) => T;

export class Entity {
    public audio?: AudioBoard;
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

    public useTrait<T extends Trait>(TraitClass: TraitConstructor<T>, fn: (trait: T) => void): void {
        const trait = this.getTrait(TraitClass);
        if (trait) fn(trait);
    }

    public update(gameContext: GameContext, level: Level) {
        this.traits.forEach((trait) => {
            trait.update(this, gameContext, level);
        });
        // if (this.audio) this.playSounds(this.audio, gameContext.audioContext);
        this.lifetime += gameContext.deltaTime;
    }

    public draw(context: CanvasRenderingContext2D) {}

    public finalize() {
        this.events.emit(Trait.EVENT_TASK, this);
        this.traits.forEach((trait) => {
            trait.finalize(this);
        });
        this.events.clear();
    }

    public obstruct(side: Side, match: TileResolverMatch) {
        this.traits.forEach((trait) => {
            trait.obstruct(this, side, match);
        });
    }

    public collides(candidate: Entity) {
        this.traits.forEach((trait) => {
            trait.collides(this, candidate);
        });
    }

    private playSounds(audioBoard: AudioBoard, audioContext: AudioContext) {
        this.sounds.forEach((name) => {
            audioBoard.play(name, audioContext);
        });
        this.sounds.clear();
    }


}