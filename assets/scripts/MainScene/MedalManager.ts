import { _decorator, Component, Node } from 'cc';
import { Results } from './Results';
const { ccclass, property } = _decorator;

@ccclass('MedalManager')
export class MedalManager extends Component {
   
    @property({ type: Node }) public zeroMedal: Node;

    @property({ type: Node }) public bronzeMedal: Node;

    @property({ type: Node }) public silverMedal: Node;

    @property({ type: Node }) public goldMedal: Node;

    @property({ type: Node }) public diamondMedal: Node;

    @property({ type: Node }) public medalHolder: Node;

    @property({ type: Node }) public currentScoreInMedalHolder: Node;

    @property({ type: Node }) public highestScoreInMedalHolder: Node;
    

    public static Instance: MedalManager;
    onEnable()
    {
        MedalManager.Instance = this;
    }

    onDestroy()
    {
        if (MedalManager.Instance === this) {
            MedalManager.Instance = null!;
        }
    }


    public showZeroMedal()
    {
        if(this.medalHolder)
        {
            this.zeroMedal.active = true; 
        }
    }

    public showBronzeMedal()
    {
        if(this.medalHolder)
        {
            this.bronzeMedal.active = true;
        }
    }

    public showSilverMedal()
    {
        if(this.medalHolder)
        {
            this.silverMedal.active = true;
        }
    }
    public showGoldMedal()
    {
        if(this.medalHolder)
        {
            this.goldMedal.active = true;
        }
    }

    public showDiamondMedal()
    {
        if(this.medalHolder)
        {
            this.diamondMedal.active = true;
        }
    }

    public showCurrentScoreInMedalHolder()
    {
        if(this.medalHolder) this.currentScoreInMedalHolder.active = true;
    }
    public showHighestScoreInMedalHolder()
    {
        if(this.medalHolder) this.highestScoreInMedalHolder.active = true;
    }


}


