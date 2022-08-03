import "../style/style.scss";
import {throwError} from "./utils/throwError";

async function main(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d") || throwError("Canvas not supported!");

    context.imageSmoothingEnabled = false;

    const audioContext = new AudioContext();





}


document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("screen");
    if (canvas instanceof HTMLCanvasElement) {
        main(canvas).catch(e => console.error(e));
    } else {
        console.warn("Try Modern browser");
    }
});