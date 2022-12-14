import {Dict} from "../types";
import {EntityFactory} from "../entities";

export type GameContext = {
    audioContext: AudioContext,
    deltaTime: number,
    entityFactory: Dict<EntityFactory>,
    videoContext: CanvasRenderingContext2D
};