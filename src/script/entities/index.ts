import {Entity} from "./Entity";
import {Dict} from "../types";
import {loadMario} from "./Mario";
import {loadGoomba} from "./Goomba";
import {loadBullet} from "./Bullet";
import {loadCannon} from "./Cannon";

export type EntityFactory = () => Entity;
export type EntityFactoryDict = Dict<EntityFactory>;

export async function loadEntities(audioContext: AudioContext): Promise<EntityFactoryDict> {
    const factories: EntityFactoryDict = {};

    const addAs = (name: string) => (factory: EntityFactory) => {
        factories[name] = factory;
    };

    await Promise.all([
        loadMario(audioContext).then(addAs('mario')),
        loadGoomba().then(addAs('goomba')),
        loadBullet().then(addAs('bullet')),
        loadCannon(audioContext).then(addAs('cannon')),
    ]);

    return factories;
}