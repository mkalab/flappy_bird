import { _decorator, Component, Node, Vec3,screen, } from 'cc';
import { GameState } from './GameState';
import { ObjectPooler } from './ObjectPooler';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('PipeSpawner')
export class PipeSpawner extends Component {

    @property(ObjectPooler)
    pooler: ObjectPooler = null!;

    @property(Number)
    minHeight: number = 0;

    @property(Number)
    maxHeight: number = 0;

    @property
    spawnInterval: number = 1.2;  

    private timer: number = 0;

    public scene = screen.windowSize;
    private bgX: number = 3;

    @property
    private offset: number = 0;

    update(dt: number) {
        // if(GameManager.Instance.state !== GameState.Playing)
        // {
        //     return;
        // }
        
        if (!GameManager.Instance || GameManager.Instance.state !== GameState.Playing) {
            return;
        }
        
        this.timer += dt;

        if (this.timer >= this.spawnInterval) {
            this.timer = 0;
            this.spawnPipe();
        }
    }

    private spawnPipe() {
        const pipe = this.pooler.getPooledObject();

        const x = this.bgX + (this.scene.width / 2) + this.offset;
        console.log(this.scene.width);
        const y = this.minHeight +
                  Math.random() * (this.maxHeight - this.minHeight);

        pipe.setPosition(new Vec3(x, y, 0)); 

        
    }

    public reset() {
        this.timer = 0; 
        if (this.pooler) {
            this.pooler.resetPool(); 
        }
    }
}
