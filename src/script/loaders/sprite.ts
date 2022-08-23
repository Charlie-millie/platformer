import {loadImage, loadJSON} from "./index";
import {SpriteSheetSpec} from "../types";
import {SpriteSheet} from "../animation/SpriteSheet";
import {createAnimation} from "../animation";

export async function loadSpriteSheet(name: string) {
    const url = `sprites/${name}.json`;
    const sheetSpec = await loadJSON<SpriteSheetSpec>(url);
    const image = await loadImage(sheetSpec.imageURL);

    const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);

    if (sheetSpec.tiles) {
        sheetSpec.tiles.forEach(tileSpec => {
            const [x, y] = tileSpec.index;
            sprites.defineTile(tileSpec.name, x, y);
        });
    }

    if (sheetSpec.frames) {
        sheetSpec.frames.forEach(frameSpec => {
            const [x, y, width, height] = frameSpec.rect;
            sprites.define(frameSpec.name, x, y, width, height);
        });
    }

    if (sheetSpec.animations) {
        sheetSpec.animations.forEach(animSpec => {
            const animation = createAnimation(animSpec.frames, animSpec.frameLength);
            sprites.defineAnimation(animSpec.name, animation);
        });
    }

    return sprites;
}