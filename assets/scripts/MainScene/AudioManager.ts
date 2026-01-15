import { _decorator, Component, Node, AudioSource, AudioClip, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    @property({ type: AudioSource }) public flapSound: AudioSource;

    @property({ type: AudioSource }) public scoreSound: AudioSource;

    @property({ type: AudioSource }) public hitSound: AudioSource;

    @property({ type: AudioSource }) public dieSound: AudioSource;

    @property({ type: AudioSource }) public swooshSound: AudioSource;

    public hitDuration: number = 0.3;
    public dieDuration: number = 0.5;

    public static Instance: AudioManager;
    
    onLoad()
    {
        AudioManager.Instance = this;
        director.addPersistRootNode(this.node);
    }

    onDestroy()
    {
        if (AudioManager.Instance === this) {
            AudioManager.Instance = null!;
        }
    }

    public playSound(sound: AudioSource)
    {
        if(!sound) return;
        sound.stop();
        sound.play();
    }


}


