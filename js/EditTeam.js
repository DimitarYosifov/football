// import Background from "./Background.js";
import Card from "./gameLevel/Card.js";
import { recordClubPlayersParams } from "./recordClubPlayersParams.js";

export default class EditTeam {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container;
        this.app.stage.addChild(this.container);
        // this.container.interactive = true

        //BG
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000, 1);
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

        $.ajax({
            url: "getPlayerLineUp",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    user: localStorage.getItem('user')
                }
            ),
            success: (res) => {
                this.players = res.players;
                this.stageWidth = this.app.width;
                this.stageHeight = this.app.height;
                this.createHeader();
                this.createPlayers();
                this.addButtons();
            }, error: (err) => {
                alert("err")
            }
        });
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
            }, this.app, false, false);
            this.container.addChild(card);
            this.allCards.push(card);
            card.playerPosition = playerPosition;
            card.isSub = isSub;

            let goals = card.createTexts.create(`${player.goalsScored}`, card_y + card_height * 1.015, card_x + card_width * 0.4, 1, 0, this.app.height / 75, true);
            card.addGoalsScored(goals.x - goals.width);
            card.createTexts.create(`exp ${player.EXP}`, card_y + card_height * 1.03, card_x + card_width * 0.5, 0, 0, this.app.height / 90);
            card.createTexts.create(`${player.leagueYellowCards}`, card_y + card_height * 1.2, card_x + card_width * 0.5, 0, 0, this.app.height / 75);
            card.addLeagueCardsAndInjury(player.leagueYellowCards, player.leagueRedCards, player.injured);
            isSub ? playersCount[playerPosition]++ : playersCount.starting++;
        }

        this.makeInteractive();

        this.createTexts.create('goalkeepers', this.app.height * 0.055, 0, 0, 0.5, this.app.height / 45);
        this.createTexts.create('defenders', this.app.height * 0.245, 0, 0, 0.5, this.app.height / 45);
        this.createTexts.create('midfielders', this.app.height * 0.435, 0, 0, 0.5, this.app.height / 45);
        this.createTexts.create('forwards', this.app.height * 0.625, 0, 0, 0.5, this.app.height / 45);
        this.createTexts.create('starting line-up', this.app.height * 0.815, 0, 0, 0.5, this.app.height / 45);
    }

    createTexts = {
        create: (_text, y, x, anchorX, anchorY, fontSize, returnText = false) => {
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

        TweenMax.to(card1.children, .5, { x: card1newX, y: card1newY });
        TweenMax.to(card2.children, .5, { x: card2newX, y: card2newY });

        const card1Index = this.players.indexOf(this.players.find(x => x === card1.stats));
        const card2Index = this.players.indexOf(this.players.find(x => x === card2.stats));

        if (card1.stats.substitute !== card2.stats.substitute) {
            card1.stats.substitute = !card1.stats.substitute;
            card2.stats.substitute = !card2.stats.substitute;
        }

        const temp = this.players[card1Index];
        this.players[card1Index] = this.players[card2Index];
        this.players[card2Index] = temp;

    }

    checkIfSubstitute(idx) {
        return this.players[idx].substitute;
    }

    addButtons() {
        const btnTexture = this.app.loader.resources.buttons.textures[`save`];
        this.saveBtn = new PIXI.Sprite(btnTexture);
        this.saveBtn.height = this.app.height * 0.05;
        this.saveBtn.scale.x = this.saveBtn.scale.y;
        this.saveBtn.x = this.app.width;
        this.saveBtn.y = this.app.height * 0.5;
        this.saveBtn.anchor.set(1, 0.5);
        this.saveBtn.interactive = true;
        this.saveBtn.on('pointerdown', () => {
            this.recordData();
        });
        this.container.addChild(this.saveBtn);

        //BACK TEAM BTN
        const backBtnTexture = this.app.loader.resources.buttons.textures[`btn1`];
        let backBtn = new PIXI.Sprite(backBtnTexture);
        backBtn.height = this.app.height * 0.06;
        backBtn.scale.x = backBtn.scale.y;
        backBtn.x = this.app.width * 0.89;
        backBtn.y = this.app.height * 0.1;
        backBtn.anchor.set(0.5);
        backBtn.interactive = true;
        backBtn.interactive = true;
        backBtn.on('pointerdown', () => {
            this.app.stage.removeChild(this.container);
        });

        this.container.addChild(backBtn);

        let backBtnLabel = new PIXI.Text(`back`, {
            fontFamily: this.app.config.mainFont,
            fontSize: backBtn.height / 2.5,
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',
            fontWeight: 200,
            lineJoin: "bevel",
            strokeThickness: 2
        });
        backBtnLabel.position.set(
            backBtn.x,
            backBtn.y
        );
        backBtnLabel.anchor.set(0.5, 0.5);
        this.container.addChild(backBtnLabel);
    }

    recordData() {
        let club = this.app.allClubs.find(t => t.name === this.clubName)
        club.players = this.players;
        recordClubPlayersParams(this.app);
    }
}
