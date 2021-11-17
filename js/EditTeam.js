// import Background from "./Background.js";
import Card from "./gameLevel/Card.js";
import { recordClubPlayersParams } from "./recordClubPlayersParams.js";
import GameTexture from "./GameTexture.js";
import Background from "./Background.js";
import RotatingButton from "./RotatingButton.js";

export default class EditTeam {
    constructor(app) {
        this.app = app;
        this.backgroundImg = new Background(this.app, {
            gamePhase: "editTeam",
            sprite: new GameTexture(this.app, "bg55"),
            bg_x: -this.app.width * 0.005,
            bg_y: -this.app.height * 0.005,
            bg_width: this.app.width * 1.005,
            bg_height: this.app.height * 1.005
        });
        // backgroundImg.alpha = 0.5;
        this.app.stage.addChild(this.backgroundImg);
        TweenMax.to(this.app.stage, 0.85, { alpha: 1, delay: 0.5 });
        this.container = new PIXI.Container;
        this.app.stage.addChild(this.container);

        //BG
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000, 0);
        this.bg.drawRect(
            0,
            0,
            this.app.width,
            this.app.height
        );
        this.bg.endFill();
        this.container.addChild(this.bg);
        this.bg.interactive = true;
        this.bg.on('pointerdown', () => { });
        this.clubName = this.app.playerClubData.name;

        this.players = [].concat(this.app.playerLineUp);
        this.stageWidth = this.app.width;
        this.stageHeight = this.app.height;
        this.createHeader();
        this.createPlayers();
        this.addButtons();
        this.checkSaveAllowed();
    }

    createHeader() {
        this.text = new PIXI.Text('Edit Your Team', {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 30,
            fill: '#ffffff',
            align: 'center'
        });
        this.text.position.set(this.app.width / 2, this.app.height * 0.03);
        this.text.anchor.set(0.5, 0.5);

        this.container.addChild(this.text);
    }

    createPlayers() {
        let Y_positions = {
            starting: this.app.height * 0.83,
            F: this.app.height * 0.64,
            MD: this.app.height * 0.45,
            DF: this.app.height * 0.26,
            GK: this.app.height * 0.07
        }

        let playersCount = {
            starting: 0,
            GK: 0,
            DF: 0,
            MD: 0,
            F: 0
        }

        this.allCards = []

        for (let i = 0; i < this.players.length; i++) {
            console.log(playersCount);
            let player = this.players[i];
            const playerPosition = player.position;
            const isSub = player.substitute;
            let card_x = isSub ? (this.app.width / 6) * playersCount[playerPosition] : (this.app.width / 6) * playersCount.starting;
            let card_y = isSub ? Y_positions[playerPosition] : Y_positions.starting;
            let card_width = this.app.width / 6;
            let card_height = this.app.height * 0.12;

            let card = new Card({
                index: i,
                stats: player,
                font_size: this.stageHeight / 45 + 'px',  //change this shit!!

                cardTexture: `player_id_${player.player_img_id}`,
                card_x: card_x,
                card_y: card_y,
                card_width: card_width,
                card_height: card_height,

                shoeTexture: `shoe`,
                shoe_x: card_x,
                shoe_y: card_y + card_height * 0.02,
                shoe_height: card_height * 0.23,

                attack_text: {
                    x: card_x + card_width,
                    y: card_y
                },

                gloveTexture: `glove2`,
                glove_x: card_x,
                glove_y: card_y + card_height * 0.7,
                glove_height: card_width * 0.35,

                defense_text: {
                    x: card_x + card_width,
                    y: card_y + card_height * 0.76
                },

                yellowCardTexture: `yellow_card`,
                yellowCard_x: card_x + card_width / 2,
                yellowCard_y: card_y + card_height / 2,
                yellowCard_width: card_width * 0.75,

                injuryTexture: `red_cross`,
                injury_x: card_x + card_width / 2,
                injury_y: card_y + card_height / 2,
                injury_width: card_width * 0.75,

                starsTexture: `star`,
                stars_x: card_x + card_width / 2,
                stars_y: card_y,
                stars_width: card_width * 0.12,

                totalPower: player.defense_full + player.attack_full

            }, this.app, false, false);

            this.container.addChild(card);
            this.allCards.push(card);
            card.playerPosition = playerPosition;
            card.isSub = isSub;

            let goals = card.createTexts.create(`${player.goalsScored}`, card_y + card_height * 1.035, card_x + card_width * 0.4, 1, 0, this.app.height / 75, true);
            card.addGoalsScored(goals.x - goals.width);
            card.createTexts.create(`exp ${player.EXP}`, card_y + card_height * 1.03, card_x + card_width * 0.5, 0, 0, this.app.height / 90);
            card.createTexts.create(`${player.leagueYellowCards}`, card_y + card_height * 1.2, card_x + card_width * 0.5, 0, 0, this.app.height / 75);
            card.addLeagueCardsAndInjury(player.leagueYellowCards, player.leagueRedCards, player.injured);
            isSub ? playersCount[playerPosition]++ : playersCount.starting++;
        }

        this.makeInteractive();

        this.createTexts.create('goalkeepers', this.app.height * 0.05, 0, 0, 0.5, this.app.height / 45);
        this.createTexts.create('defenders', this.app.height * 0.24, 0, 0, 0.5, this.app.height / 45);
        this.createTexts.create('midfielders', this.app.height * 0.43, 0, 0, 0.5, this.app.height / 45);
        this.createTexts.create('forwards', this.app.height * 0.62, 0, 0, 0.5, this.app.height / 45);
        this.createTexts.create('starting line-up', this.app.height * 0.81, 0, 0, 0.5, this.app.height / 45);
    }

    createTexts = {
        create: (_text, y, x, anchorX, anchorY, fontSize, returnText = false) => {
            console.log(_text);
            let text = new PIXI.Text(_text, {
                fontFamily: this.app.config.mainFont,
                fontSize: fontSize,
                fill: '#ffffff',
                align: 'center'
            });
            text.position.set(x, y);
            text.anchor.set(anchorX, anchorY);
            this.container.addChild(text);
            if (returnText) return text;
        }
    }

    makeInteractive() {
        this.allCards.forEach((child, childIdx) => {
            if (child.selectable) {
                child.interactive = true;
                child.selected = false;
                child.on('pointerdown', (e) => {
                    // const isSub = this.checkIfSubstitute(childIdx);
                    const selectedPlayerFound = this.allCards.filter(pl => pl.selected).length > 0;
                    const samePlayerSelected = child.selected;
                    const successfulSubstitution = !samePlayerSelected && selectedPlayerFound;

                    if (successfulSubstitution) {
                        console.log(this.allCards.filter(pl => pl.selected)[0].cardImg.x);
                        console.log(child.cardImg.x);
                    }

                    if (successfulSubstitution) {
                        this.switchCardsonSuccessfulSubstitution(this.allCards.filter(pl => pl.selected)[0], child)
                    }

                    this.allCards.forEach((card, cardIdx) => {
                        if (successfulSubstitution) {
                            card.alpha = 1;
                            card.interactive = true;
                            card.selected = false;
                        }
                        else if ((card.playerPosition === child.playerPosition) || samePlayerSelected) {
                            card.alpha = 1;
                            card.interactive = true;
                        } else {
                            card.alpha = 0.35;
                            card.selected = false;
                            card.interactive = false;
                        }
                        child.alpha = 1;
                    })
                    if (samePlayerSelected || successfulSubstitution) {
                        child.selected = false;
                    } else {
                        child.selected = true;
                    }
                    child.interactive = true;
                })
            } else {
                // if (!child.selectable) { 
                child.alpha = 0.35;
                // }

            }
        })
        this.allCards = this.allCards.filter(el => el.selectable);
    }

    switchCardsonSuccessfulSubstitution(card1, card2) {
        const card1newXDir = card2.cardImg.x > card1.cardImg.x ? "+" : "-";
        const dist1 = Math.abs(card2.cardImg.x - card1.cardImg.x)
        const card1newX = `${card1newXDir}=${dist1}`;

        const card1newYDir = card2.cardImg.y > card1.cardImg.y ? "+" : "-";
        const dist2 = Math.abs(card2.cardImg.y - card1.cardImg.y)
        const card1newY = `${card1newYDir}=${dist2}`;

        const card2newXDir = card1.cardImg.x > card2.cardImg.x ? "+" : "-";
        const dist3 = Math.abs(card1.cardImg.x - card2.cardImg.x)
        const card2newX = `${card2newXDir}=${dist3}`;

        const card2newYDir = card1.cardImg.y > card2.cardImg.y ? "+" : "-";
        const dist4 = Math.abs(card1.cardImg.y - card2.cardImg.y)
        const card2newY = `${card2newYDir}=${dist4}`;

        this.container.setChildIndex(card1, this.container.children.length - 1);
        this.container.setChildIndex(card2, this.container.children.length - 2);

        TweenMax.to(card1.children, 0.5, { x: card1newX, y: card1newY, ease: Back.easeInOut });
        TweenMax.to(card2.children, 0.5, { x: card2newX, y: card2newY, ease: Back.easeInOut });

        const card1Index = this.players.indexOf(this.players.find(x => x === card1.stats));
        const card2Index = this.players.indexOf(this.players.find(x => x === card2.stats));

        if (card1.stats.substitute !== card2.stats.substitute) {
            card1.stats.substitute = !card1.stats.substitute;
            card2.stats.substitute = !card2.stats.substitute;
        }

        const temp = this.players[card1Index];
        this.players[card1Index] = this.players[card2Index];
        this.players[card2Index] = temp;

        this.checkSaveAllowed();

    }

    checkIfSubstitute(idx) {
        return this.players[idx].substitute;
    }

    addButtons() {

        //  SAVE BUTTON
        let saveOnPointerDown = () => {
            this.recordData();
            this.addSavedtext();
        }
        this.saveBtn = new RotatingButton(this.app, null, null, saveOnPointerDown);
        this.container.addChild(this.saveBtn);
        this.saveBtn.setButtonSize(this.app.height * 0.1, this.app.width * 1.2, this.container.height * 0.2);
        this.saveBtn.addLabel(`Save`, 0.4);
        TweenMax.to([this.saveBtn, this.saveBtn.label], 0.3, {
            delay: 0.8,
            ease: Back.easeOut,
            x: this.app.width * 0.9,
            onComplete: () => { }
        });

        //--BACK BUTTON
        let backOnPointerDown = () => {
            // this fixes bug with mixing subs.... : (
            for (let i = 0; i < this.players.length; i++) {
                this.app.playerLineUp[i].substitute = i < 6 ? false : true;
            }
            TweenMax.to([this.saveBtn, this.saveBtn.label], 0.3, {
                delay: 0.1,
                ease: Back.easeIn,
                x: this.app.width * 1.2,
                onComplete: () => {
                    TweenMax.delayedCall(0.25, () => {
                        this.app.checkContinueAllowed();
                        this.app.stage.removeChild(this.container);
                        this.app.stage.removeChild(this.backgroundImg);
                    });
                }
            });
            TweenMax.to([this.backBtn, this.backBtn.label], 0.3, {
                // delay: 0.2,
                ease: Back.easeIn,
                x: this.app.width * 1.2,
                onComplete: () => { }
            });
        }
        this.backBtn = new RotatingButton(this.app, null, null, backOnPointerDown);
        this.container.addChild(this.backBtn);
        this.backBtn.setButtonSize(this.app.height * 0.1, this.app.width * 1.2, this.container.height * 0.1);
        this.backBtn.addLabel(`Back`, 0.4);
        TweenMax.to([this.backBtn, this.backBtn.label], 0.3, {
            delay: 0.9,
            ease: Back.easeOut,
            x: this.app.width * 0.9,
            onComplete: () => { }
        });
    }

    addSavedtext() {
        //changes saved text
        this.saveBtn.interactive = false;
        let changesSaved = new PIXI.Text(`saved`, {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 8,
            fill: '#32cf56',
            align: 'center',
            stroke: '#000000',
            fontWeight: 800,
            lineJoin: "bevel",
            strokeThickness: 6
        });
        changesSaved.position.set(
            -400,
            this.app.height / 2
        );
        TweenMax.to(changesSaved, 0.35, {
            // delay: 0.3,
            ease: Back.easeOut,
            x: this.app.width / 2,
            onComplete: () => { }
        });
        TweenMax.to(changesSaved, 0.35, {
            delay: 1.1,
            ease: Back.easeIn,
            x: this.app.width + 400,
            onComplete: () => {
                this.app.stage.removeChild(changesSaved);
                this.saveBtn.interactive = true;
            }
        });


        changesSaved.anchor.set(0.5, 0.5);
        this.app.stage.addChild(changesSaved);
        // TweenMax.delayedCall(0.75, () => {
        // this.app.stage.removeChild(changesSaved);
        // });
    }
    recordData() {
        let club = this.app.allClubs.find(t => t.name === this.clubName)
        club.players = this.players;
        this.app.playerLineUp = this.players;
        recordClubPlayersParams(this.app);
    }

    checkSaveAllowed() {
        const saveDisabled = this.players
            .slice(0, 6)
            .find(el => el.leagueRedCards || el.leagueYellowCards === 5 || el.injured > 0);
        if (saveDisabled) {
            this.saveBtn.interactive = false;
            this.saveBtn.alpha = 0.4;
        } else {
            this.saveBtn.interactive = true;
            this.saveBtn.alpha = 1;
        }
    }
}
