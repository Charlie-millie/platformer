import {Scene} from "./Scene";
import {GameContext} from "../context";

export class SceneRunner {
    public sceneIndex = -1;
    public scenes: Scene[] = [];

    public get currentScene(): Scene | undefined {
        return this.scenes[this.sceneIndex];
    }

    public addScene(scene: Scene) {
        this.scenes.push(scene);
        scene.events.listen(Scene.EVENT_COMPLETE, () => {
             this.runNext();
        });
    }

    public runNext() {
        this.currentScene?.pause();
        this.sceneIndex += 1;
    }

    public update(gameContext: GameContext) {
        this.currentScene?.update(gameContext);
        this.currentScene?.draw(gameContext);
    }
}