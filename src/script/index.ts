import "../style/style.scss";
import {throwError} from "./utils/throwError";
import {loadEntities} from "./entities";
import {loadFont} from "./loaders/font";
import {createLevelLoader} from "./loaders/level";
import {SceneRunner} from "./Level/SceneRunner";
import {makePlayer} from "./player";
import {setupKeyboard} from "./input";
import {Scene} from "./Level/Scene";
import {createColorLayer, createTextLayer} from "./Layers";
import {Level} from "./Level";

async function main(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d") || throwError("Canvas not supported!");

    context.imageSmoothingEnabled = false;

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
        level.events.listen(Level.EVENT_TRIGGER, () => {

        });

    }

}


document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("screen");
    if (canvas instanceof HTMLCanvasElement) {
        main(canvas).catch(e => console.error(e));
    } else {
        console.warn("Try Modern browser");
    }
});