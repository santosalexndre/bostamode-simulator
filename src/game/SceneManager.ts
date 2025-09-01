import { main } from '../bliss/Main';
import { Scene } from './Scene';

export class SceneManager {
    public static currentScene: Scene;

    constructor() {}

    public static switchScene(path: string) {
        this.currentScene = new Scene(path);
        this.currentScene.switchRequest.connect(newScene => {
            this.currentScene = new Scene(newScene);
        });
    }
}
