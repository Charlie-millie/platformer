
export class AudioBoard {
    private buffers = new Map();

    public add(name: string, buffer: AudioBuffer) {
        this.buffers.set(name, buffer);
    }

    public play(name: string, context: AudioContext) {
        const source = context.createBufferSource();
        source.connect(context.destination);
        source.buffer = this.buffers.get(name);
        source.start(0);
    }
}