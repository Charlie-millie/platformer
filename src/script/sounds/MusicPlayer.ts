
export class MusicPlayer {
    public tracks = new Map<string, HTMLAudioElement>();

    public addTrack(name: string, url: string) {
        const audio = new Audio();
        audio.loop = true;
        audio.src = url;
        this.tracks.set(name, audio);
    }

    public playTrack(name: string) {
        this.pauseAll();
        const audio = this.tracks.get(name);
        audio?.play();
        return audio;
    }

    public pauseAll() {
        for (const audio of this.tracks.values()) {
            audio.pause();
        }
    }


}