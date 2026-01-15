import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {
   
    public static LoadMainScene()
    {
        director.loadScene("MainScene");
    }

    public static LoadStartScene()
    {
        director.loadScene("StartScene");
    }
}


