import {EntityFactoryDict} from "../entities";
import {loadJSON} from "./index";
import {LevelSpec, LevelSpecPatterns, LevelSpecTile, TileRange} from "../types";
import {loadSpriteSheet} from "./sprite";
import {loadMusicSheet} from "./music";
import {Level} from "../Level";
import {SpriteSheet} from "../animation/SpriteSheet";
import {TileResolverMatrix} from "../tiles/TileResolver";
import {Matrix} from "../Math";
import {throwError} from "../utils/throwError";
import {createBackgroundLayer} from "../Layers/background";
import {createSpriteLayer} from "../Layers/sprites";

function loadPattern(name: string) {
    return loadJSON<LevelSpecPatterns>(`/sprites/patterns/${name}.json`);
}
function setupBackground(levelSpec: LevelSpec, level: Level, backgroundSprites: SpriteSheet, patterns: LevelSpecPatterns) {
    for (const layer of levelSpec.layers) {
        const grid = createGrid(layer.tiles, patterns);
        const backgroundLayer = createBackgroundLayer(level, grid, backgroundSprites);
        level.comp.layers.push(backgroundLayer);
        level.tileCollider.addGrid(grid);
    }
}
function setupEntities(levelSpec: LevelSpec, level: Level, entityFactory: EntityFactoryDict) {
    levelSpec.entities.forEach(({name, pos: [x, y]}) => {
        const createEntity = entityFactory[name];
        if (!createEntity) {
            throwError(`Could not find factory function for entity "${name}"`);
        }

        const entity = createEntity();
        entity.pos.set(x, y);
        level.entities.add(entity);
    });

    const spriteLayer = createSpriteLayer(level.entities);
    level.comp.layers.push(spriteLayer);
}
export function setupTriggers(levelSpec: LevelSpec, level: Level) {
    if (!levelSpec.triggers) return;

    for (const triggerSpec of levelSpec.triggers) {
        // const trigger - new Tri
    }
}

export function createLevelLoader(entityFactory: EntityFactoryDict) {
    return async function loadLevel(name: string) {
        const levelSpec = await loadJSON<LevelSpec>(`levels/${name}.json`);

        const [backgroundSprites, musicPlayer, patterns] = await Promise.all([
            loadSpriteSheet(levelSpec.spriteSheet),
            loadMusicSheet(levelSpec.musicSheet),
            loadPattern(levelSpec.patternSheet)
        ]);

        const level = new Level();
        level.name = name;
        level.music.setPlayer(musicPlayer);

        setupBackground(levelSpec,level, backgroundSprites, patterns);
        setupEntities(levelSpec, level, entityFactory);


    }
}

function createGrid(tiles: LevelSpecTile[], patterns: LevelSpecPatterns) {
    const grid: TileResolverMatrix = new Matrix();
    for (const {x, y, tile} of expandTiles(tiles, patterns)) {
        grid.set(x, y, tile);
    }
    return grid;
}

function* expandSpan(xStart: number, xLength: number, yStart: number, yLength: number) {
    const xEnd = xStart + xLength;
    const yEnd = yStart + yLength;
    for (let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
            yield {x, y};
        }
    }
}


function expandRange(range: TileRange) {
    if (range.length === 4) {
        const [xStart, xLength, yStart, yLength] = range;
        return expandSpan(xStart, xLength, yStart, yLength);
    } else if (range.length === 3) {
        const [xStart, xLength, yStart] = range;
        return expandSpan(xStart, xLength, yStart, 1);
    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpan(xStart, 1, yStart, 1);
    } else {
        throwError(`Invalid range of length ${range.length}`);
    }
}

function* expandRanges(ranges: TileRange[]) {
    for (const range of ranges) {
        yield* expandRange(range);
    }
}

function* expandTiles(tiles: LevelSpecTile[], patterns: LevelSpecPatterns) {
    type TileCreatorResult = {
        tile: LevelSpecTile;
        x: number;
        y: number;
    };
    function* walkTiles(tiles: LevelSpecTile[], offsetX: number, offsetY: number): IterableIterator<TileCreatorResult> {
        for (const tile of tiles) {
            for (const {x, y} of expandRanges(tile.ranges)) {
                const derivedX = x + offsetX;
                const derivedY = y + offsetY;

                if (tile.pattern) {
                    if (!patterns[tile.pattern]) {
                        throwError(`pattern ${tile.pattern} not found`);
                    }
                    const {tiles} = patterns[tile.pattern];
                    yield* walkTiles(tiles, derivedX, derivedY);
                } else if (tile.name) {
                    yield {
                        tile,
                        x: derivedX,
                        y: derivedY
                    }
                } else {
                    throwError(`Tile does not have a name or a pattern: ${JSON.stringify(tile)}`);
                }
            }
        }
    }

    yield* walkTiles(tiles, 0, 0);

}