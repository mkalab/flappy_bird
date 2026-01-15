import { _decorator, Component, Node, Vec3, screen, BoxCollider2D, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
import { Tags, TagsEnum } from './Tags';
import { GameState } from './GameState';
import { GameManager } from './GameManager';


@ccclass('Pipes')
export class Pipes extends Component {

    @property({ type: Node }) public topPipe: Node;
    
    @property({ type: Node }) public bottomPipe: Node;

    @property({ type: Node}) public scoring: Node;

    public tempStartPos:Vec3 = new Vec3(0,0,0); 
    public scene = screen.windowSize;

    public pipeSpeed: number | null = null;
    
    @property({ type: Number }) public gap: number = 3;
    

    onLoad()
    {
        this.setupColliderTag(this.topPipe, Tags.Pipe);
        this.setupColliderTag(this.bottomPipe, Tags.Pipe);
        this.setupColliderTag(this.scoring, Tags.Scoring);
    }

    start() {
        this.pipeSpeed = GameManager.Instance.pipeSpeed;
        this.resetPipe();
        
    }

    update(deltaTime: number) {
        if(GameManager.Instance.state !== GameState.Playing)
        {
            return;
        }

        if (!GameManager.Instance || GameManager.Instance.state !== GameState.Playing) {
            return;
        }
  
        this.move(deltaTime);
    }

    private setupColliderTag(node: Node, tagType: Tags) 
   {
        const collider = node.getComponent(BoxCollider2D);
        if(!collider) return;
        collider.tag = tagType;
        collider.enabled = true;
        collider.apply();
    }   

    public resetPipe() {
        this.topPipe.setPosition(this.topPipe.getPosition().add(new Vec3(0, this.gap / 2,)));
        this.bottomPipe.setPosition(this.bottomPipe.getPosition().add(new Vec3(0, this.gap / 2, 0)));
    }

    move(deltaTime?: number)
    {
        if(this.pipeSpeed === null) return;

        const speedX  = this.pipeSpeed * deltaTime;
        this.node.setPosition(this.node.position.add(new Vec3(-speedX, 0, 0)));
        // this.rb.linearVelocity = (new Vec2(-this.pipeSpeed, 0));

        if(this.node.getPosition().x < -this.scene.width)
        {
            this.node.active = false;
        }
    }

    
}


