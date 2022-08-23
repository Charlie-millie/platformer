import "../style/style.scss";
import {throwError} from "./utils/throwError";
import {loadEntities} from "./entities";
import {loadFont} from "./loaders/font";

async function main(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d") || throwError("Canvas not supported!");

    context.imageSmoothingEnabled = false;

    const audioContext = new AudioContext();

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext),
        loadFont()
    ]);

    // const loadLevel = crea

}


document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("screen");
    if (canvas instanceof HTMLCanvasElement) {
        main(canvas).catch(e => console.error(e));
    } else {
        console.warn("Try Modern browser");
    }
});