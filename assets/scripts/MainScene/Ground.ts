import { _decorator, Component, Node, Vec3, UITransform, Canvas, director, BoxCollider2D} from 'cc';
const { ccclass, property } = _decorator;

import { TagsEnum, Tags } from './Tags'
import { GameManager } from './GameManager'
import { GameState } from './GameState';

@ccclass('Ground')
export class Ground extends Component {

    @property({
        type: Node,
        tooltip: 'Ground 1'
    })
    public ground1: Node;

    @property({
        type: Node,
        tooltip: 'Ground 2'
    })
    public ground2: Node;

    @property({
        type: Node,
        tooltip: 'Ground 3'
    })
    public ground3: Node;

    public ground1Width: number;
    public ground2Width: number;
    public ground3Width: number;

    public tempStartLocation1 = new Vec3;
    public tempStartLocation2 = new Vec3
    public tempStartLocation3 = new Vec3;


    public speed: number;


    start()
    {
        this.startUp();
        console.log(this.ground1.worldPosition);
        console.log(this.ground2.worldPosition);
        console.log(this.ground3.worldPosition);
    }

    startUp()
    {
        this.ground1Width = this.ground1.getComponent(UITransform).contentSize.width;
        this.ground2Width = this.ground2.getComponent(UITransform).contentSize.width;
        this.ground3Width = this.ground3.getComponent(UITransform).contentSize.width;

        this.setupGroundColliderTag(this.ground1);
        this.setupGroundColliderTag(this.ground2);
        this.setupGroundColliderTag(this.ground3);

        this.tempStartLocation1  = new Vec3(0,55,0);
        this.tempStartLocation2 = new Vec3(this.ground1Width,55,0);
        this.tempStartLocation3 = new Vec3(this.ground1Width + this.ground2Width,55,0);

        this.ground1.setPosition(this.tempStartLocation1);
        this.ground2.setPosition(this.tempStartLocation2);
        this.ground3.setPosition(this.tempStartLocation3);

    }

    update(deltaTime: number) {
        if (!GameManager.Instance || GameManager.Instance.state !== GameState.Playing) {
            return;
        }

      
        this.speed = GameManager.Instance.groundSpeed;
        
        this.tempStartLocation1 = this.ground1.position;  
        this.tempStartLocation2 = this.ground2.position;
        this.tempStartLocation3 = this.ground3.position;

        //move to the left
        this.tempStartLocation1.x -= this.speed * deltaTime;
        this.tempStartLocation2.x -= this.speed * deltaTime;
        this.tempStartLocation3.x -= this.speed * deltaTime;


        if (this.tempStartLocation1.x <= -this.ground1Width/2) {
            this.tempStartLocation1.x = this.tempStartLocation3.x + this.ground3Width;
        }
        if (this.tempStartLocation2.x <= -this.ground2Width/2) {
            this.tempStartLocation2.x = this.tempStartLocation1.x + this.ground1Width;
        }
        if (this.tempStartLocation3.x <= -this.ground3Width/2) {
            this.tempStartLocation3.x = this.tempStartLocation2.x + this.ground2Width;
        }


        this.ground1.setPosition(this.tempStartLocation1);
        this.ground2.setPosition(this.tempStartLocation2);
        this.ground3.setPosition(this.tempStartLocation3);
        
    }

    private setupGroundColliderTag(groundNode: Node)
    {
        const collider = groundNode.getComponent(BoxCollider2D);
        if(collider)
        {
            collider.tag = Tags.Ground;
        }

        collider.enabled = true;
        collider.apply();
    }
}


