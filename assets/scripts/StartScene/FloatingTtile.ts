import { _decorator, Component, Animation, AnimationClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FloatingTtile')
export class FloatingTtile extends Component {

    private anim: Animation | null = null;

    onLoad() {
        this.anim = this.getComponent(Animation);
    }

    start() {
        if(!this.anim) return;

        const state = this.anim.getState('floating');
        if(state) {
            state.wrapMode = AnimationClip.WrapMode.Loop;
        }
        this.anim.play('floating');
    }
}


