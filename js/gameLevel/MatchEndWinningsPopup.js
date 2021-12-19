import GameTexture from "../GameTexture.js";
import Animation from "./../Animation.js";
import BangUp from "./../BangUp.js";
import RotatingButton from "./../RotatingButton.js";
import { standingsView } from "./../standingsView.js";
import { recordClubPlayersParams } from "./../recordClubPlayersParams.js";
import MatchEndWinningsConfig from "./../MatchEndWinningsConfig.js";

export default class MatchEndWinningsPopup extends PIXI.Container {
    constructor(app) {
        super();
        this.app = app;
        this.result = `${this.app.level.playerScore}-${this.app.level.opponentScore}`;
        if (!this.app.isPlayerHome) this.result = this.result.split("").reverse().join("");
        this.totalWinnings = 0;


        //POINTS
        this.points = 0;
        if (this.app.level.playerScore > this.app.level.opponentScore) {
            this.points = 3;
        }
        else if (this.app.level.playerScore === this.app.level.opponentScore) {
            this.points = 1;
        }
        this.cashPerPoint = MatchEndWinningsConfig.cashPerPoint;
        this.totalPointsWinnings = this.points * this.cashPerPoint;

        //GOALS
        this.goals = this.app.level.playerScore;
        this.cashPerGoal = MatchEndWinningsConfig.cashPerGoal;
        this.totalGoalsWinnings = this.goals * this.cashPerGoal;

        ///TICKETS
        const playerClubPower = this.app.playerClubData.power;
        const opponentClubPower = this.app.opponentClubData.power;
        let min = 0;
        let max = 0;
        if (this.app.isPlayerHome) {
            min = MatchEndWinningsConfig.attendance.home[playerClubPower].min;
            max = MatchEndWinningsConfig.attendance.home[playerClubPower].max;
            this.cashPerTicket = MatchEndWinningsConfig.ticketPrice[playerClubPower];
        } else {
            min = MatchEndWinningsConfig.attendance.away[playerClubPower].min;
            max = MatchEndWinningsConfig.attendance.away[playerClubPower].max;
            this.cashPerTicket = MatchEndWinningsConfig.ticketPrice[opponentClubPower];
        }
        this.tickets = this.getRandomInt(min, max);
        this.totalTicketsWinnings = this.tickets * this.cashPerTicket;

        this.create();
        this.addCoinAnimation();
        this.pointsWinnings();
        this.goalsWinnings();
        this.ticketsWinnings();

        this.createTimeLine();
    }

    create() {
        //BG
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000, 0.85);
        this.bg.drawRect(
            0,
            0,
            this.app.width,
            this.app.height
        );
        this.bg.endFill();
        this.addChild(this.bg);
        this.bg.interactive = true;


        // SUMMARY TEXT
        this.summatyText = new PIXI.Text(`GAME SUMMARY`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 20,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.summatyText.anchor.set(0.5, 0);
        this.addChild(this.summatyText);
        this.summatyText.position.set(this.app.width / 2, this.app.height * 0.15);

    }

    createTimeLine() {
        this.timeline = new TimelineMax();
        this.timeline.to(this.pointsRowContainer, 1.5,
            {
                alpha: 1,
                onComplete: () => {
                    this.startPointsBangUps();
                }
            }
        );
        this.timeline.to(this.goalsRowContainer, 1.5,
            {
                delay: 1,
                alpha: 1,
                onStart: () => { },
                onComplete: () => {
                    this.totalWinnings += this.totalPointsWinnings
                    this.startGoalsBangUps();
                }
            }
        );
        this.timeline.to(this.ticketsRowContainer, 1.5,
            {
                delay: 1,
                alpha: 1,
                onStart: () => { },
                onComplete: () => {
                    this.totalWinnings += this.totalGoalsWinnings;
                    this.startTicketsBangUps();
                }
            }
        );
    }

    startPointsBangUps() {
        this.pointsBangUp = new BangUp(this.app, this.pointsText, 1, this.pointsText.text, 0, 0);
        this.totalWinningsBangUp1 = new BangUp(this.app, this.totalWinningsText, 1, 0, +this.pointsText.text + this.totalWinnings, 0);
    }

    startGoalsBangUps() {
        this.goalsBangUp = new BangUp(this.app, this.goalsText, 1, this.goalsText.text, 0, 0);
        this.totalWinningsBangUp = new BangUp(this.app, this.totalWinningsText, 1, this.totalWinnings, +this.goalsText.text + this.totalWinnings, 0);
    }

    startTicketsBangUps() {
        this.continue();
        this.ticketssBangUp = new BangUp(this.app, this.ticketsText, 1, this.ticketsText.text, 0, 0);
        this.totalWinningsBangUp = new BangUp(this.app, this.totalWinningsText, 1, this.totalWinnings, +this.ticketsText.text + this.totalWinnings, 0);
    }

    addCoinAnimation() {
        let coinAnimData = {
            name: "coins_anim",
            frames: 10,
            speed: 0.3,
            loop: true,
            paused: false
        }
        this.coin = new Animation(this.app, coinAnimData);
        this.coin.width = this.width * 0.2;
        this.coin.scale.y = this.coin.scale.x;
        this.coin.x = this.app.width / 2 - this.coin.width;
        this.coin.y = this.app.height * 0.25;
        this.addChild(this.coin);

        // TOTAL WINNINGS TEXT
        this.totalWinningsText = new PIXI.Text(this.totalWinnings, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 16,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.totalWinningsText.anchor.set(0, 0);
        this.addChild(this.totalWinningsText);
        this.totalWinningsText.position.set(this.app.width * 0.55, this.app.height * 0.27);
    }

    pointsWinnings() {
        this.pointsRowContainer = new PIXI.Container();
        this.pointsRowContainer.alpha = 0;
        // POINTS TEXT
        this.pointsText = new PIXI.Text("Points", {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 30,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.pointsText.anchor.set(0, 0);
        this.pointsRowContainer.addChild(this.pointsText);
        this.pointsText.position.set(this.app.width * 0.1, this.app.height * 0.465);

        // POINTS VALUES
        this.pointsText = new PIXI.Text(`${this.points} x ${this.cashPerPoint}`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 30,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.pointsText.anchor.set(0, 0);
        this.pointsRowContainer.addChild(this.pointsText);
        this.pointsText.position.set(this.app.width * 0.35, this.app.height * 0.465);

        // TOTAL POINTS WINNINGS  
        this.pointsText = new PIXI.Text(`${this.totalPointsWinnings}`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 30,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.pointsText.anchor.set(1, 0);
        this.pointsRowContainer.addChild(this.pointsText);
        this.pointsText.position.set(this.app.width * 0.85, this.app.height * 0.465);

        // COIN IMG
        this.pointsCoinImg = new GameTexture(this.app, `coin`).sprite;
        this.pointsCoinImg.height = this.app.height * 0.03;
        this.pointsCoinImg.x = this.pointsText.x;
        this.pointsCoinImg.y = this.app.height * 0.4725;
        this.pointsCoinImg.scale.x = this.pointsCoinImg.scale.y;
        this.pointsRowContainer.addChild(this.pointsCoinImg);

        this.addChild(this.pointsRowContainer);
    }

    goalsWinnings() {
        this.goalsRowContainer = new PIXI.Container();
        this.goalsRowContainer.alpha = 0;
        // POINTS TEXT
        this.goalsText = new PIXI.Text("Goals", {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 30,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.goalsText.anchor.set(0, 0);
        this.goalsRowContainer.addChild(this.goalsText);
        this.goalsText.position.set(this.app.width * 0.1, this.app.height * 0.545);

        // GOALS VALUES
        this.goalsText = new PIXI.Text(`${this.goals} x ${this.cashPerGoal}`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 30,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.goalsText.anchor.set(0, 0);
        this.goalsRowContainer.addChild(this.goalsText);
        this.goalsText.position.set(this.app.width * 0.35, this.app.height * 0.545);

        // TOTAL POINTS WINNINGS  
        this.goalsText = new PIXI.Text(`${this.totalGoalsWinnings}`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 30,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.goalsText.anchor.set(1, 0);
        this.goalsRowContainer.addChild(this.goalsText);
        this.goalsText.position.set(this.app.width * 0.85, this.app.height * 0.545);

        // COIN IMG
        this.goalsCoinImg = new GameTexture(this.app, `coin`).sprite;
        this.goalsCoinImg.height = this.app.height * 0.03;
        this.goalsCoinImg.x = this.goalsText.x;
        this.goalsCoinImg.y = this.app.height * 0.5525;
        this.goalsCoinImg.scale.x = this.goalsCoinImg.scale.y;
        this.goalsRowContainer.addChild(this.goalsCoinImg);

        this.addChild(this.goalsRowContainer);
    }

    ticketsWinnings() {
        this.ticketsRowContainer = new PIXI.Container();
        this.ticketsRowContainer.alpha = 0;
        // TICKETS TEXT
        this.ticketsText = new PIXI.Text("Tickets", {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 30,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.ticketsText.anchor.set(0, 0);
        this.ticketsRowContainer.addChild(this.ticketsText);
        this.ticketsText.position.set(this.app.width * 0.1, this.app.height * 0.625);

        // TICKETS VALUES
        this.ticketsText = new PIXI.Text(`${this.tickets} x ${this.cashPerTicket}`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 30,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.ticketsText.anchor.set(0, 0);
        this.ticketsRowContainer.addChild(this.ticketsText);
        this.ticketsText.position.set(this.app.width * 0.35, this.app.height * 0.625);

        // TOTAL TICKETS WINNINGS  
        this.ticketsText = new PIXI.Text(`${this.totalTicketsWinnings}`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 30,
            fill: '#dbb7b7',
            stroke: '#000000',
            strokeThickness: 3,
            fontWeight: 400
        });
        this.ticketsText.anchor.set(1, 0);
        this.ticketsRowContainer.addChild(this.ticketsText);
        this.ticketsText.position.set(this.app.width * 0.85, this.app.height * 0.625);

        // COIN IMG
        this.ticketsCoinImg = new GameTexture(this.app, `coin`).sprite;
        this.ticketsCoinImg.height = this.app.height * 0.03;
        this.ticketsCoinImg.x = this.ticketsText.x;
        this.ticketsCoinImg.y = this.app.height * 0.6325;
        this.ticketsCoinImg.scale.x = this.ticketsCoinImg.scale.y;
        this.ticketsRowContainer.addChild(this.ticketsCoinImg);

        this.addChild(this.ticketsRowContainer);
    }

    continue() {
        //  CONTINUE BUTTON
        let continueOnPointerDown = () => {
            this.app.stage.removeChildren();
            this.app.lastGameWinnings = +this.totalWinningsText.text;
            recordClubPlayersParams(this.app, true);
            standingsView.bind(this.app,)(true, true, this.result, true);
        }
        this.contionueBtn = new RotatingButton(this.app, null, null, continueOnPointerDown);
        this.addChild(this.contionueBtn);
        this.contionueBtn.setButtonSize(this.app.height * 0.2, this.app.width * 0.5, this.app.height * 1.25);
        this.contionueBtn.addLabel(`Continue`, 0.25);
        this.contionueBtn.interactive = false;
        TweenMax.to([this.contionueBtn, this.contionueBtn.label], 0.35, {
            delay: 1.2,
            ease: Back.easeOut,
            y: this.app.height * 0.85,
            onComplete: () => {
                this.contionueBtn.interactive = true;
            }
        });
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
