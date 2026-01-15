import { _decorator, Component, Prefab, Node, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectPooler')
export class ObjectPooler extends Component {

    @property(Prefab)
    prefab: Prefab = null!;

    @property
    poolSize: number = 5;

    private pool: Node[] = [];

    onLoad() {
        this.createPool();
    }

    private createPool() {
        for (let i = 0; i < this.poolSize; i++) {
            this.createNewObject();
        }
    }

    private createNewObject(): Node {
        const obj = instantiate(this.prefab);
        obj.active = false;
        this.node.addChild(obj);
        this.pool.push(obj);
        return obj;
    }

    public getPooledObject(): Node {
        for (const obj of this.pool) {
            if (!obj.active) {
                obj.active = true;
                return obj;
            }
        }

        return this.createNewObject();
    }

    public returnPooledObject(obj: Node)
    {
        obj.active = false;
    }

    public resetPool() {
        for (const obj of this.pool) {
            if (obj.active) {
                obj.active = false;
            }
        }
    }

}
