import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { SceneManager } from '../SceneManager';
import { GameManager } from './GameManager';
import { AudioManager } from './AudioManager';

@ccclass('SceneLoader')
export class SceneLoader extends Component {
    
    onClickPlayAgain()
    {
        AudioManager.Instance.playSound(AudioManager.Instance.swooshSound);
        SceneManager.LoadStartScene();
    }
}


