import {Entity} from "./Entity";
import {Dict} from "../types";

export type EntityFactory = () => Entity;
export type EntityFactoryDict = Dict<EntityFactory>;

export async function loadEntities(audioContext: AudioContext): Promise<EntityFactoryDict> {
    const factories: EntityFactoryDict = {};

    const addAs = (name: string) => (factory: EntityFactory) => {
        factories[name] = factory;
    };

    await Promise.all([

    ]);

    return factories;

}