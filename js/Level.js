import Background from "./Background.js";
import Config from "./Config.js";
import LevelCardsSet from "./gameLevel/LevelCardsSet.js";
import MatchStartPopup from "./gameLevel/MatchStartPopup.js";
import Grid from "./gameLevel/Grid.js";
import NewRoundPopup from "./gameLevel/NewRoundPopup.js";
import Particles from "./AddParticles.js";

export default class Level extends PIXI.Container {

    constructor(app) {

        super();
        this.app = app;
        this.config = Config;
        this.stage = app.stage;
        this.stage.alpha = 0;
        this.proton = app.proton;
        this.width = app.width; // / this.config.rendererResolution;
        this.height = app.height;//  / this.config.rendererResolution;
        this.grid = null;
        this.clubNames = [this.app.playerClubData.name, this.app.opponentClubData.name]; //first is players club
        this.goalAttempts = [];
        this.isPlayerHome = this.app.isPlayerHome;
        this.app.playerTurn = this.isPlayerHome;
        this.currentRound = 0;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.playerCardsContainer = null;
        this.opponentCardsContainer = null;
        this.animationInProgress = true;
        this.playerActiveDefenses = Array(13).fill(null);     // 13 is max that fits within screen width
        this.opponentActiveDefenses = Array(13).fill(null);   // 13 is max that fits within screen width
        // this.opponentActiveDefensesY = this.height * 0.155;
        // this.playerActiveDefensesY = this.height * 0.84;
        this.dataRecieved = () => {
            TweenMax.delayedCall(1, () => {
                TweenMax.to(this.stage, this.config.fadeTimeBetweenPhases, {
                    alpha: 1,
                    onComplete: () => {
                        this.matchStartPopup = new MatchStartPopup(this.app);
                        this.addChild(this.matchStartPopup);
                    }
                });
            })
        }

        this.addAdditionalChildren = () => {
            this.bg = new Background(this.app, {
                gamePhase: "level",
                bgTexture: this.app.loader.resources.backgrounds.textures["pitch"],
                bg_x: -this.app.width * 0.005,
                bg_y: -this.app.height * 0.005,
                bg_width: this.app.width * 1.005,
                bg_height: this.app.height * 1.005
            });
            this.addChild(this.bg);

            this.info = new PIXI.Sprite(this.app.loader.resources.main1.textures["info"]);
            this.info.anchor.set(1, 0.5);
            this.info.x = this.app.width;
            this.info.y = this.app.height / 2;
            this.info.width = this.app.width / 11;
            this.info.scale.y = this.info.scale.x;
            this.addChild(this.info);
            this.info.interactive = true;
            this.info.on('pointerdown', () => {
                this.infoPopup = new NewRoundPopup(this.app, false, false);
                this.parent.addChild(this.infoPopup);
            });

            this.spinningBall = new PIXI.Sprite(this.app.loader.resources.main1.textures["ball_prototype"]);
            this.spinningBall.anchor.set(0.5, 0.5);
            this.spinningBall.x = this.app.width * 0.96;
            this.spinningBall.y = this.app.height * (this.isPlayerHome ? 0.85 : 0.15);
            this.spinningBall.width = this.app.width / 11;
            this.spinningBall.scale.y = this.info.scale.x;
            this.addChild(this.spinningBall);
            TweenMax.to(this.spinningBall, 3000, {
                rotation: 3600
            });
        }
        this.addAdditionalChildren();

        this.onIntroFinish = () => {
            this.grid = new Grid(this.app);
            this.addChild(this.grid);
            // this.addSnow();
        }

        this.addSnow = () => {
            this.snowContainer = new Particles(this.app, this);
            this.addChild(this.snowContainer.container);
            this.snowContainer.update();
        }


        const createCards = async () => {
            let [player, opponent] = await
                Promise.all(
                    [
                        new LevelCardsSet(this.app.width, this.app.height, "player", this.clubNames[0]),
                        new LevelCardsSet(this.app.width, this.app.height, "opponent", this.clubNames[1]),
                    ]
                );
            this.playerCards = player;
            this.addChild(this.playerCards);
            this.opponentCards = opponent;
            this.addChild(this.opponentCards);
            this.dataRecieved();
        };
        createCards().catch(err => { console.log('Run failed (does not matter which task)!'); });
      
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff, 1);
        mask.drawRect(
            0,
            0,
            this.width,
            this.height
        );
        mask.endFill();
        this.mask = mask;
   
    }
}
