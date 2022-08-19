import {MusicPlayer} from "./MusicPlayer";

export class MusicController {
    public player?: MusicPlayer;

    public setPlayer(player: MusicPlayer) {
        this.player = player;
    }

    public playTheme(speed = 1) {
        const audio = this.player?.playTrack('main');
        if (audio) {
            audio.playbackRate = speed;
        }
    }

    public playHurryTheme() {
        const audio = this.player?.playTrack('hurry');
        if (audio) {
            audio.loop = false;
            audio.addEventListener('ended', () => {
                this.playTheme(1.3)
            }, {once: true});
        }
    }

    public pause() {
        this.player?.pauseAll();
    }

}