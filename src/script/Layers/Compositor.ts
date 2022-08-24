import {Camera} from "../Camera";

export type LayerFunction = (context: CanvasRenderingContext2D, camera: Camera) => void;

export class Compositor {
    public layers = [] as LayerFunction[];

    public draw(context: CanvasRenderingContext2D, camera: Camera) {
        this.layers.forEach(layer => {
            layer(context, camera);
        });
    }
}