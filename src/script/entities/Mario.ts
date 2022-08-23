import {Entity} from "./Entity";
import {Jump} from "../Trait/Jump";
import {Go} from "../Trait/Go";
import {Stomper} from "../Trait/Stomper";
import {Killable} from "../Trait/Killable";
import {Solid} from "../Trait/Solid";
import {Physics} from "../Trait/Physics";
import {SpriteSheet} from "../animation/SpriteSheet";
import {AudioBoard} from "../sounds/AudioBoard";
import {Animation} from "../animation";
import {loadSpriteSheet} from "../loaders/sprite";
import {loadAudioBoard} from "../loaders/audio";

const FAST_DRAG = 1 / 5000;
const SLOW_DRAG = 1 / 1000;

export class Mario extends Entity {
    public jump = this.addTrait(new Jump());
    public go = this.addTrait(new Go());
    public stomper = this.addTrait(new Stomper());
    public killable = this.addTrait(new Killable());
    public solid = this.addTrait(new Solid());
    public physics = this.addTrait(new Physics());

    constructor(private sprites: SpriteSheet, public audio: AudioBoard, private runAnimation: Animation) {
        super();

        this.size.set(14, 16);

        this.go.dragFactor = SLOW_DRAG;
        this.killable.removeAfter = 0;

        this.setTurboState(false);
    }

    public resolveAnimationFrame() {
        if (this.jump.falling) {
            return 'jump';
        }

        if (this.go.distance > 0) {
            if ((this.vel.x > 0 && this.go.dir < 0) || (this.vel.x < 0 && this.go.dir > 0)) {
                return 'brake';
            }
            return this.runAnimation(this.go.distance);
        }
        return 'idle';
    }

    public draw(context: CanvasRenderingContext2D) {
        this.sprites.draw(this.resolveAnimationFrame(), context, 0, 0, this.go.heading < 0);
    }


    public setTurboState(turboState: boolean) {
        this.go.dragFactor = turboState ? FAST_DRAG : SLOW_DRAG;
    }
}

export async function loadMario(audioContext: AudioContext) {
    const [marioSprites, audioBoard] = await Promise.all([
        loadSpriteSheet('mario'),
        loadAudioBoard('mario', audioContext)
    ]);

    const runAnimation = marioSprites.getAnimation('run');
    return function createMario() {
        return new Mario(marioSprites, audioBoard, runAnimation);
    };
}