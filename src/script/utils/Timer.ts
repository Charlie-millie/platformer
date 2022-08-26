
export class Timer {
    private accumulatedTime = 0;
    private lastTime?: number;

    constructor(private deltaTime = 1 / 60) {
    }

    public update = (dt: number) => {};

    public start() {
        this.enqueue();
    }

    private enqueue() {
        requestAnimationFrame(this.updateProxy);
    }

    private updateProxy = (time: number) => {
        if (this.lastTime != null) {
            this.accumulatedTime += (time - this.lastTime) / 1000;
            this.accumulatedTime = Math.min(this.accumulatedTime, 1);

            while (this.accumulatedTime > this.deltaTime) {
                this.update(this.deltaTime);
                this.accumulatedTime -= this.deltaTime;
            }
        }
        this.lastTime = time;
        this.enqueue();
    }
}