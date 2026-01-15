import { _decorator, Component, Node, Label, Animation, sys } from 'cc';
import { MedalManager } from './MedalManager';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Results')
export class Results extends Component {
    public static Instance: Results;


    @property({ type: Label })  public currentScore: Label;


    max: number = 0;
    current: number = 0;
    
    @property({ type: Node })  public gameOverLabel: Node;

    @property({ type:Node }) public playAgainButton: Node;

    private readonly HIGH_SCORE_KEY = 'highest_score';

    private isNewRecord: boolean = false;


    onLoad()
    {
        this.loadHighestScore();
    }

    onEnable()
    {
        Results.Instance = this;
    }

    onDestroy()
    {
        if (Results.Instance === this) {
            Results.Instance = null!;
        }
    }

    private loadHighestScore()
    {
        const saved = sys.localStorage.getItem(this.HIGH_SCORE_KEY);
        if (saved) {
            this.max = parseInt(saved, 10);
        } else {
            this.max = 0;
        }
    }

    private saveHighestScore()
    {
        sys.localStorage.setItem(this.HIGH_SCORE_KEY, this.max.toString());
    }

    //function to update scores
    updateScore(newScore: number) {
        this.current = newScore;
        this.currentScore.string = this.current.toString();
    }

    resetScore() {
        this.updateScore(0);
        this.currentScore.string = this.current.toString();
    }

    addScore() {
        this.updateScore(this.current + 1);
    }

    //when the game ends, show results
    showResult() {
        this.currentScore.node.active = false;

        //update max score
        this.isNewRecord = false;

        const oldMax = this.max;
        if (this.current > this.max) {
            this.max = this.current;
            this.isNewRecord = true;
            this.saveHighestScore();
        }

        this.gameOverLabel.active = true;
        this.scheduleOnce(() => {
            const anim = this.gameOverLabel.getComponent(Animation);
            anim?.stop();   
            anim?.play("appearFromTop");
            AudioManager.Instance.playSound(AudioManager.Instance.swooshSound);
        }, 0);

        this.scheduleOnce(() => {
            this.showMedals();
        }, 0.7);
        
        
        this.scheduleOnce(() => {
            Results.Instance.playAgainButton.active = true;
        }, 1.3);
    }

    showMedals()
    {
        if(!MedalManager.Instance) return;

        const curLabel = MedalManager.Instance.currentScoreInMedalHolder?.getComponent(Label);
        const highLabel = MedalManager.Instance.highestScoreInMedalHolder?.getComponent(Label);

        // MedalManager.Instance.medalHolder.active = true;
        if (MedalManager.Instance && MedalManager.Instance.medalHolder) {
            this.scheduleOnce(() => {
                MedalManager.Instance.medalHolder.active = true;
                const anim = MedalManager.Instance.medalHolder.getComponent(Animation);
                anim?.stop();
                anim?.play("appearFromBottom");
            }, 0);
        }
            
        // show scores in medal holder
        MedalManager.Instance.showCurrentScoreInMedalHolder();
        MedalManager.Instance.showHighestScoreInMedalHolder();

        this.animateScore(curLabel, this.current, true);
        this.animateScore(highLabel, this.max, this.isNewRecord);

        //show medal based on score
        if(this.current == 0)
        {
            MedalManager.Instance.showZeroMedal();
        }
        else if(this.current >= 5 && this.current < 10)
        {
            MedalManager.Instance.showBronzeMedal();
        }
        else if(this.current >= 10 && this.current < 15)
        {
            MedalManager.Instance.showSilverMedal();
        }
        else if(this.current >= 15 && this.current < 20)
        {
            MedalManager.Instance.showGoldMedal();
        }
        else if(this.current >= 20)
        {
            MedalManager.Instance.showDiamondMedal();
        }
    }

    // hideResult() {
    //     this.gameOverLabel.active = false;
        
    //     // Tắt hết tất cả medal
    //     if (MedalManager.Instance && MedalManager.Instance.medalHolder) {
    //         MedalManager.Instance.medalHolder.active = false;
    //         for (const medal of MedalManager.Instance.medalHolder.children) {
    //             medal.active = false;
    //         }
    //     }
    // }


    private animateScore(label: Label, target: number, animate: boolean) 
    {
        if(!label) return;

        if(target <= 0) 
        {
            label.string = '0';
            return; 
        }

        if(!animate)
        {
            label.string = target.toString();
            return;
        }

        let value = 0;
        label.string = '0';

        const callback = () =>  {
            value++;
            label.string = value.toString();

            if (value >= target) {
                this.unschedule(callback);
            }
        };

        this.schedule(callback, 0.1); // tốc độ chạy số
    }
}

    

