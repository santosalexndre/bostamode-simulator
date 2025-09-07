import { Source } from 'love.audio';

export class MusicManager {
    private static music: Source;
    private static currentSong: string;
    private static cache: Record<string, Source> = new LuaTable() as any;

    public static playMusic(path: string) {
        if (path == this.currentSong) return;
        else {
            if (this.music !== undefined && this.music.isPlaying()) {
                this.music.stop();
            }
        }

        let song = this.cache[path];

        if (song == undefined) {
            song = love.audio.newSource(path, 'stream');
            this.cache[path] = song;
        }
        song.setVolume(0.6);
        song.setLooping(true);
        song.play();
        this.music = song;
        this.currentSong = path;
    }

    public static playSound(path: string) {
        let song = this.cache[path];

        if (song == undefined) {
            song = love.audio.newSource(path, 'static');
            this.cache[path] = song;
        }

        song.setVolume(1);
        song.setLooping(false);
        song.play();
    }
}
