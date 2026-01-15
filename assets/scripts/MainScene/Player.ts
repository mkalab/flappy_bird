import { _decorator, Component, Vec3, Sprite, SpriteFrame, Contact2DType, IPhysics2DContact, Collider2D,  RigidBody2D, tween, UITransform, Node, Vec2} from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from './GameManager'
import { Tags, TagsEnum } from './Tags'
import  { GameState } from './GameState';
import { AudioManager } from './AudioManager';



@ccclass('Player')
export class Player extends Component {

    public static Instance: Player;

    @property({ type: TagsEnum }) public tag: Tags = Tags.Player;

    @property({ type: Number, tooltip: 'Jump Force' }) public jumpForce: number = 5;

    @property({ type: Number, tooltip: 'Tilt force' }) public tilt: number = 6;

    @property({ type: Number, tooltip: 'Rotation lerp speed' }) public rotationLerpSpeed: number = 5;

    @property([SpriteFrame]) public birdFrames: SpriteFrame[] = [];



    private sprite: Sprite | null = null;
    private frameInterval: number = 0.15;
    private frameTimer: number = 0;
    private currentFrameIndex: number = 0;

    public hitState: GameState = GameState.None;

    private collider: Collider2D | null = null;
    private rb: RigidBody2D | null = null;

    onLoad() {
        this.collider = this.getComponent(Collider2D);
        this.rb = this.getComponent(RigidBody2D);

        this.sprite = this.node.getChildByName('Visual')?.getComponent(Sprite);
        if (this.birdFrames.length > 0 && this.sprite) {
            this.sprite.spriteFrame = this.birdFrames[0];
        }

        // dang ky su kien collision
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.tag = Tags.Player;
            collider.apply();
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
            console.log("Collision listener registered for Player");

        } else {
            console.error("Player has no Collider2D!");
        }
    }

    onEnable() {
        Player.Instance = this;
   
        const pos = this.node.getPosition();
        this.node.setPosition(pos);
        this.node.eulerAngles = new Vec3(0, 0, 0);

    }

    start()
    {

    }
    
    onDestroy() {
        if (Player.Instance === this) {
            Player.Instance = null!;
        }
    }

    update(deltaTime: number) {
    if (!GameManager.Instance || GameManager.Instance.state !== GameState.Playing) {
        // dung im 
        if (this.rb) this.rb.linearVelocity = new Vec2(0, 0);
        return;
    }


    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.frameInterval) {
        this.frameTimer = 0;
        this.nextFrame();
    }

    if (this.rb) {
        const velocityY = this.rb.linearVelocity.y;
        
        // Tinh toan goc quay dua tren van toc Y
        let targetZ = velocityY * this.tilt;
        targetZ = Math.min(Math.max(targetZ, -90), 30);

        const currentRot = this.node.eulerAngles;
        
        if (velocityY < 0) {
            // Khi roi xoay dan ve huong cam dau
            let lerpZ = Vec3.lerp(new Vec3(), currentRot, new Vec3(0, 0, targetZ), 
                Math.min(this.rotationLerpSpeed * deltaTime, 1)).z;
            this.node.setRotationFromEuler(0, 0, lerpZ);
        } else {
            // Khi bay ngay lap tuc quay len tren
            this.node.setRotationFromEuler(0, 0, targetZ);
        }
    }
}

    private nextFrame() {
        if (!this.sprite || this.birdFrames.length === 0) return;

        if (this.currentFrameIndex === 0) {
            this.currentFrameIndex = 1;
        }
        else if (this.currentFrameIndex === 1) {
            this.currentFrameIndex = 2;
        }
        else if (this.currentFrameIndex === 2) {
            this.currentFrameIndex = 1;
        }

        this.sprite.spriteFrame = this.birdFrames[this.currentFrameIndex];

    }

    fly() {
        if (!this.rb) return;
        AudioManager.Instance.playSound(AudioManager.Instance.flapSound);
        this.rb.linearVelocity = new Vec2(0, this.jumpForce);
    }

    @property({ type: Node }) public groundNode: Node = null!;
    @property({}) public defaultTargetY: number = -330;

    playDieAnimation() {
        if (this.collider) this.collider.enabled = false;
        if (this.rb) {
            this.rb.enabled = false;
            (this.rb as any).resetVelocity?.();
        }

        const playerUI = this.getComponent(UITransform);
        let targetY = 0; 

        if (this.groundNode && playerUI) {
            const groundWorldPos = this.groundNode.getWorldPosition();
            // console.log("Ground world position: ", groundWorldPos);
            // Chuyen ve toa do local theo node cha la Player
            const localPos = this.node.parent!.getComponent(UITransform)!.convertToNodeSpaceAR(groundWorldPos);
            

           targetY = Math.max(this.defaultTargetY, localPos.y);

        //    console.log("Ground local position: ", localPos);
        }

        // hieu ung nay len 1 chut, xoay va cam dau
        const currentPos = this.node.position.clone();

        tween(this.node)
            // Giai doan 1: nay len 1 chut
            .to(0.1, { position: new Vec3(currentPos.x, currentPos.y + 45, 0) }, { easing: 'quadOut' })
            // Giai doan 2: xoay va roi xuong
            .to(0.6, {
                position: new Vec3(currentPos.x, targetY, 0),
                eulerAngles: new Vec3(0, 0, -90)
            }, { easing: 'quadIn' })
            .start();
    }

    


    private onCollisionEnter( selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if ( otherCollider.tag === Tags.Pipe) {
            // console.log('hit pipes');
            this.hitState = GameState.HitPipes;
            AudioManager.Instance.playSound(AudioManager.Instance.hitSound);
            GameManager.Instance?.gameOver_FirstlyPauseGame();

            const hitDuration = AudioManager.Instance.hitDuration;
            this.scheduleOnce(() => {
                this.playDieAnimation();
                AudioManager.Instance.playSound(AudioManager.Instance.dieSound);
            } , hitDuration);

            this.scheduleOnce(() => {
                GameManager.Instance?.gameOver_ThenShowResults();
            }, 0.7);
        }

        else if( otherCollider.tag === Tags.Ground)
        {
            if(this.hitState === GameState.HitGround) return;

            // console.log('hit ground');
            this.hitState = GameState.HitGround;
            AudioManager.Instance.playSound(AudioManager.Instance.hitSound);
            GameManager.Instance?.gameOver_FirstlyPauseGame();
            
            this.scheduleOnce(() => {
                GameManager.Instance?.gameOver_ThenShowResults();
            }, 0.6);
        }

        else if (otherCollider.tag === Tags.Scoring) {
            console.log('scored');
            AudioManager.Instance.playSound(AudioManager.Instance.scoreSound);
            GameManager.Instance?.addScore();
        }
    }

    public ResetPos() {
        const startPos = new Vec3(0, 0, 0); 
        this.node.setPosition(startPos);
        this.node.eulerAngles = new Vec3(0, 0, 0);

       // reset animation
        this.currentFrameIndex = 0;
        if (this.sprite && this.birdFrames.length > 0) {
            this.sprite.spriteFrame = this.birdFrames[0];
        }

        // reset collider
        if(this.collider) {
            this.collider.enabled = true;
        }

        if (this.rb) {
            this.rb.enabled = true;
            (this.rb as any).resetVelocity?.();
        }
    }

}