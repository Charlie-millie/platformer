export type Dict<T> = {
    [_ in string]?: T
};

export type TileRange = number[];
export type LevelSpecTile = {
    type: string;
    name?: string;
    pattern?: string;
    ranges: TileRange;
};