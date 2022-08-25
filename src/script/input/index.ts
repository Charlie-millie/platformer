import {Keyboard} from "./Keyboard";
import {InputRouter} from "./InputRouter";
import {Entity} from "../entities/Entity";
import {Go} from "../Trait/Go";
import {Jump} from "../Trait/Jump";
import {Mario} from "../entities/Mario";

export function setupKeyboard(target: EventTarget) {
    const input = new Keyboard();
    const router = new InputRouter<Entity>();

    let leftState = 0;
    let rightState = 0;

    input.listenTo(target);
    input.addListener('ArrowRight', (keyState) => {
        rightState = keyState;
        router.route((entity) => {
            entity.useTrait(Go, (go) => {
                go.dir = rightState - leftState;
            });
        });
    });
    input.addListener('ArrowLeft', (keyState) => {
        leftState = keyState;
        router.route((entity) => {
            entity.useTrait(Go, (go) => {
                go.dir = rightState = leftState;
            });
        });
    });
    input.addListener('KeyZ', (pressed) => {
        if (pressed) {
            router.route((entity) => {
                entity.useTrait(Jump, (jump) => jump.start());
            });
        } else {
            router.route((entity) => {
                entity.useTrait(Jump, (jump) => jump.cancel());
            });
        }
    });
    input.addListener('KeyX', (keyState) => {
        router.route((entity) => {
            if (entity instanceof Mario) {
                entity.setTurboState(keyState === 1);
            }
        });
    });

    return router;
}