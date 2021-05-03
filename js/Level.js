import Background from "./Background.js";
import Config from "./Config.js";
import LevelCardsSet from "./gameLevel/LevelCardsSet.js";
import MatchStartPopup from "./gameLevel/MatchStartPopup.js";
import Grid from "./gameLevel/Grid.js";

export default class Level extends PIXI.Container {

    constructor(app) {

        super();
        this.app = app;
        this.config = Config;
        this.stage = app.stage;
        // this.stage.alpha = 0;
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
        this.bg = new Background(this.app, {
            gamePhase: "level",
            bgTexture: this.app.loader.resources.backgrounds.textures["pitch"],
            bg_x: -this.app.width * 0.005,
            bg_y: -this.app.height * 0.005,
            bg_width: this.app.width * 1.005,
            bg_height: this.app.height * 1.005
        });
        this.addChild(this.bg);
        this.opponentActiveDefensesY = this.height * 0.155;
        this.playerActiveDefensesY = this.height * 0.84;
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

        this.onIntroFinish = () => {
            this.grid = new Grid(this.app);
            this.addChild(this.grid);
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
    }
}
