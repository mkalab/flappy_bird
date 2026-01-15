import { _decorator, Component} from 'cc';
const { ccclass, property } = _decorator;
import { SceneManager } from '../SceneManager';
import { AudioManager } from '../MainScene/AudioManager';

@ccclass('SceneLoader')
export class SceneLoader extends Component {

    onStartClick()
    {
        AudioManager.Instance.playSound(AudioManager.Instance.swooshSound);
        SceneManager.LoadMainScene();
    }
}


