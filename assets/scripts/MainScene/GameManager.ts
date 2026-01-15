import { _decorator, Component, Node, CCInteger, Input, input, director, ResolutionPolicy, view } from 'cc';
import { Results } from './Results';
import { MedalManager } from './MedalManager';
import { Player } from './Player';
import { PipeSpawner } from './PipeSpawner';
import { GameState } from './GameState';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    public static Instance: GameManager;

    @property({ type: PipeSpawner, tooltip: 'Pipe Spawner' })
    public pipeSpawner: PipeSpawner = null!;

    @property({type: Node, tooltip: 'Message'})
    public message: Node;

    @property({type: CCInteger,tooltip: 'Ground movement speed'})
    public groundSpeed: number = 50;

    @property({ type: CCInteger, tooltip: 'Pipe movement speed' })
    public pipeSpeed: number = 50;

    public state: GameState = GameState.Waiting;


    onLoad() {
        GameManager.Instance = this;
        this.initListener();
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onTouchStart, this);

        if (GameManager.Instance === this) {
            GameManager.Instance = null!;
        }
    }


    start() {
        this.state = GameState.Waiting;
        this.message.active = true;
        director.pause();
        console.log(this.state.toString());
    }

    initListener()
    {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onTouchStart, this);
    }

    onTouchStart()
    {
       if(this.state === GameState.Waiting)
        {
            director.resume(); 
            this.state = GameState.Playing;
            this.message.active = false;

            if (Player.Instance) {
                Player.Instance.fly();
            }
        }

        else if(this.state === GameState.Playing)
        {
            if (Player.Instance) {
                Player.Instance?.fly();
            }
        }
    }

    
    gameOver_FirstlyPauseGame()
    {
        this.state = GameState.GameOver;
    }

    gameOver_ThenShowResults()
    {
        if (Results.Instance) {          
            Results.Instance.showResult();
        }
    }


    addScore()
    {
        if(Results.Instance)
        {
            Results.Instance.addScore();
        }
    }


}

