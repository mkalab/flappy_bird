import { _decorator, Component, Contact2DType, Collider2D } from 'cc';
import { GameManager } from './GameManager';
import { Tags } from './Tags';

const { ccclass } = _decorator;

@ccclass('Scoring')
export class Scoring extends Component {

    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(
        self: Collider2D,
        other: Collider2D
    ) {
        if (other.tag === Tags.Player) {
            console.log('scored');
            GameManager.Instance?.addScore();
            this.node.active = false; // tránh ăn điểm 2 lần
        }
    }
}
