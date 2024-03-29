import { standingsView } from "./../standingsView.js";
import { recordClubPlayersParams } from "./../recordClubPlayersParams.js";
import GameTexture from "./../GameTexture.js";
import MatchEndWinningsPopup from "./MatchEndWinningsPopup.js";

export default class NewRoundPopup extends PIXI.Container {

    constructor(app, matchFinished, lastRound) {
        super();
        this.app = app;
        this.matchFinished = matchFinished;
        this.lastRound = lastRound;
        this.homeTeamScore = this.app.level.isPlayerHome ? this.app.level.playerScore : this.app.level.opponentScore;
        this.awayTeamScore = this.app.level.isPlayerHome ? this.app.level.opponentScore : this.app.level.playerScore;
        this.create();
    }

    create() {

        //BG
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000, 0.75);
        this.bg.drawRect(
            0,
            0,
            this.app.width,
            this.app.height
        );
        this.bg.endFill();
        this.addChild(this.bg);
        this.bg.interactive = true;
        this.bg.on('pointerdown', () => {
            if (!this.matchFinished) {
                this.remove();
            }
        });
        if (this.matchFinished) {
            // GAME IS OVER
            this.currentRound = new PIXI.Text(`FINAL SCORE`, {
                fontFamily: this.app.config.mainFont,
                fontSize: this.app.height / 10,
                fill: '#000000',
                align: 'center',
                stroke: '#dbb7b7',
                fontWeight: 800,
                lineJoin: "bevel",
                strokeThickness: 6
            });
            this.currentRound.position.set(this.app.width / 2, this.app.height * 0.25);
            this.currentRound.anchor.set(0.5, 0.5);
            this.addChild(this.currentRound);
        } else {
            // CURRENT ROUND TEXT
            let text = this.lastRound ? "Last Round" : `Round ${this.app.level.currentRound}/20`
            this.currentRound = new PIXI.Text(`${text}`, {
                fontFamily: this.app.config.mainFont,
                fontSize: this.app.height / 10,
                fill: '#000000',
                align: 'center',
                stroke: '#dbb7b7',
                fontWeight: 800,
                lineJoin: "bevel",
                strokeThickness: 6
            });
            this.currentRound.position.set(this.app.width / 2, this.app.height * 0.25);
            this.currentRound.anchor.set(0.5, 0.5);
            this.addChild(this.currentRound);
        }

        //RESULT
        this.result = new PIXI.Text(`${this.homeTeamScore}-${this.awayTeamScore}`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 12,
            fill: '#ffffff',
            fontWeight: 800,
            stroke: '#000000',
            strokeThickness: 6
        });
        this.result.position.set(this.app.width / 2, this.app.height * 0.62);
        this.result.anchor.set(0.5, 0);
        this.addChild(this.result);

        //PLAYER CLUB NAME
        this.playerTeamName = new PIXI.Text(`${this.app.level.clubNames[0]}`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 20,
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',
            fontWeight: 800,
            lineJoin: "bevel",
            strokeThickness: 6
        });
        this.playerTeamName.position.set(
            this.app.width * (this.app.level.isPlayerHome ? 0.25 : 0.75),
            this.app.height * 0.6
        );
        this.playerTeamName.anchor.set(0.5, 0.5);
        this.addChild(this.playerTeamName);

        //PLAYER CLUB LOGO
        this.playerClubLogo = new GameTexture(this.app, `${this.app.playerClubData.logo}`).sprite;
        this.playerClubLogo.x = this.playerTeamName.x;
        this.playerClubLogo.y = this.playerTeamName.y - this.playerTeamName.height / 2;
        this.playerClubLogo.height = this.app.height / 6;
        this.playerClubLogo.scale.x = this.playerClubLogo.scale.y;
        this.playerClubLogo.anchor.set(0.5, 1);
        this.addChild(this.playerClubLogo);

        //PLAYER CLUB STARS
        this.playerClubPower = this.app.playerClubData.power;
        for (let s = 0; s < this.playerClubPower; s++) {
            const star = new GameTexture(this.app, "star").sprite;
            star.height = this.app.height * 0.025;
            star.scale.x = star.scale.y;
            star.x = this.playerClubLogo.x - star.width * s + star.width * this.playerClubPower / 2;
            star.y = this.playerClubLogo.y - this.playerClubLogo.height;
            star.anchor.set(1, 1);
            this.addChild(star);
        }

        //-----------------------------------------------------------------------------------------------

        //OPPONENT CLUB NAME
        this.opponentTeamName = new PIXI.Text(`${this.app.level.clubNames[1]}`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 20,
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',
            fontWeight: 800,
            lineJoin: "bevel",
            strokeThickness: 6
        });
        this.opponentTeamName.position.set(
            this.app.width * (this.app.level.isPlayerHome ? 0.75 : 0.25),
            this.app.height * 0.6
        );
        this.opponentTeamName.anchor.set(0.5, 0.5);
        this.addChild(this.opponentTeamName);

        //OPPONENT CLUB LOGO
        this.opponentClubLogo = new GameTexture(this.app, `${this.app.opponentClubData.logo}`).sprite;
        this.opponentClubLogo.x = this.opponentTeamName.x;
        this.opponentClubLogo.y = this.opponentTeamName.y - this.opponentTeamName.height / 2;
        this.opponentClubLogo.height = this.app.height / 6;
        this.opponentClubLogo.scale.x = this.opponentClubLogo.scale.y;
        this.opponentClubLogo.anchor.set(0.5, 1);
        this.addChild(this.opponentClubLogo);

        //OPPONENT CLUB STARS
        this.opponentClubPower = this.app.opponentClubData.power; // should be taken from level!!  TODO............
        for (let s = 0; s < this.opponentClubPower; s++) {
            const star = new GameTexture(this.app, "star").sprite;
            star.height = this.app.height * 0.025;
            star.scale.x = star.scale.y;
            star.x = this.opponentClubLogo.x - star.width * s + star.width * this.opponentClubPower / 2;
            star.y = this.opponentClubLogo.y - this.opponentClubLogo.height;
            star.anchor.set(1, 1);
            this.addChild(star);
        }

        if (this.matchFinished) {

            gsap.globalTimeline.clear();

            //continue button
            this.app.level.grid.interactive = false;
            this.continueBtn = new GameTexture(this.app, "btn1").sprite;
            this.continueBtn.height = this.app.height * 0.1;
            this.continueBtn.scale.x = this.continueBtn.scale.y;
            this.continueBtn.x = this.app.width / 2;
            this.continueBtn.y = this.app.height * 0.8;
            this.continueBtn.anchor.set(0.5);
            this.continueBtn.interactive = true;
            this.continueBtn.interactive = true;
            this.continueBtn.on('pointerdown', () => {
                if (this.app.friendly) {
                    this.app.stage.removeChildren();
                    location.reload();
                } else {
                    let matchEndWinningsPopup = new MatchEndWinningsPopup(this.app);
                    this.alpha = 0;
                    this.app.stage.addChild(matchEndWinningsPopup);
                }
            });
            this.addChild(this.continueBtn);

            this.continueBtnLabel = new PIXI.Text(`Continue`, {
                fontFamily: this.app.config.mainFont,
                fontSize: this.continueBtn.height / 2.5,
                fill: '#ffffff',
                align: 'center',
                stroke: '#000000',
                fontWeight: 800,
                lineJoin: "bevel",
                strokeThickness: 6
            });
            this.continueBtnLabel.position.set(
                this.continueBtn.x,
                this.continueBtn.y
            );
            this.continueBtnLabel.anchor.set(0.5, 0.5);
            this.addChild(this.continueBtnLabel);

        } else {
            TweenMax.delayedCall(2, () => {
                this.remove();
            })
        }
    }

    remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        // this.app.level.animationInProgress = !this.app.playerTurn;
        if (this.app.level.grid && this.app.level.grid.hasGoalsInThisRound) {
            this.app.level.grid.hasGoalsInThisRound = false;
        }
    }
}
