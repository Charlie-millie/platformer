import "../style/style.scss";
import {throwError} from "./utils/throwError";
import {loadEntities} from "./entities";
import {loadFont} from "./loaders/font";
import {createLevelLoader} from "./loaders/level";
import {SceneRunner} from "./Level/SceneRunner";
import {createPlayerEnv, makePlayer} from "./player";
import {setupKeyboard} from "./input";
import {Scene} from "./Level/Scene";
import {createColorLayer, createTextLayer} from "./Layers";
import {Level} from "./Level";
import {LevelSpecTrigger} from "./types";
import {Entity} from "./entities/Entity";
import {Player} from "./Trait/Player";
import {createPlayerProgressLayer} from "./Layers/player-progress";
import {createDashboardLayer} from "./Layers/dashboard";
import {TimedScene} from "./Level/TimedScene";
import {createCollisionLayer} from "./Layers/collision";
import {Timer} from "./utils/Timer";
import {GameContext} from "./context";

async function main(canvas: HTMLCanvasElement) {
    const videoContext = canvas.getContext("2d") || throwError("Canvas not supported!");

    videoContext.imageSmoothingEnabled = false;

    const audioContext = new AudioContext();

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext),
        loadFont()
    ]);

    const loadLevel = createLevelLoader(entityFactory);
    const sceneRunner = new SceneRunner();

    const mario = entityFactory.mario?.() || throwError('where mario tho?');
    makePlayer(mario, 'MARIO');

    const inputRouter = setupKeyboard(window);
    inputRouter.addReceiver(mario);

    async function runLevel(name: string) {
        const loadScreen = new Scene();
        loadScreen.comp.layers.push(createColorLayer('black'));
        loadScreen.comp.layers.push(createTextLayer(font, `LOADING ${name}...`));
        sceneRunner.addScene(loadScreen);
        sceneRunner.runNext();

        await new Promise((resolve) => setTimeout(resolve, 500));
        const level = await loadLevel(name);
        level.events.listen(Level.EVENT_TRIGGER, (spec: LevelSpecTrigger, trigger: Entity, touches: Set<Entity>) => {
            if (spec.type === 'goto') {
                for (const entity of touches) {
                    if (entity.getTrait(Player)) {
                        runLevel(spec.name);
                        return;
                    }
                }
            }
        });

        const playerProgressLayer = createPlayerProgressLayer(font, level);
        const dashboardLayer = createDashboardLayer(font, level);

        mario.pos.set(0, 0);
        mario.vel.set(0, 0);
        level.entities.add(mario);

        const playerEnv = createPlayerEnv(mario);
        level.entities.add(playerEnv);

        const waitScreen = new TimedScene();
        waitScreen.comp.layers.push(createColorLayer('black'));
        waitScreen.comp.layers.push(dashboardLayer);
        waitScreen.comp.layers.push(playerProgressLayer);
        sceneRunner.addScene(waitScreen);

        level.comp.layers.push(createCollisionLayer(level));
        level.comp.layers.push(dashboardLayer);
        sceneRunner.addScene(level);
        sceneRunner.runNext();
    }

    const timer = new Timer();
    timer.update = function update(deltaTime) {
        if (!document.hasFocus()) return;

        const gameContext: GameContext = {
            deltaTime,
            audioContext,
            entityFactory,
            videoContext
        };
        sceneRunner.update(gameContext);
    }
    timer.start();
    runLevel('debug-progression');

    console.log("run main....");
}

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("screen");
    if (canvas instanceof HTMLCanvasElement) {
        main(canvas).catch(e => console.error(e));
    } else {
        console.warn("Try Modern browser!");
    }
});