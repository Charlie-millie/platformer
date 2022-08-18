import {Matrix} from "../Math";
import {LevelSpecTile} from "../types";

export type TileResolverMatrix = Matrix<LevelSpecTile>;

export class TileResolver {
    constructor(public matrix: TileResolverMatrix, public tileSize = 16) {
    }

    public toIndex(pos: number) {
        return Math.floor(pos / this.tileSize);
    }

}