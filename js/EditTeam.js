// import Background from "./Background.js";
import Card from "./gameLevel/Card.js";

export default class EditTeam {
    constructor(app) {
        this.app = app;
        this.clubName = this.app.playerClubData.name;
        this.players = this.app.allClubs.find(team => team.name === this.clubName).players;
        this.stageWidth = this.app.width;
        this.stageHeight = this.app.height;
        console.log(this);
        console.log(this.players);
        this.createHeader();
        this.createLineUpText();
        this.createPlayers();
    }

    createHeader() {
        this.text = new PIXI.Text('Edit Your Team', {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 18,
            fill: '#ff0000',
            align: 'center',
            stroke: '#ffffff',
            strokeThickness: 1
        });
        this.text.position.set(this.app.width / 2, this.app.height * 0.05);
        this.text.anchor.set(0.5, 0.5);
        this.app.stage.addChild(this.text);
    }

    createLineUpText() {
        this.text = new PIXI.Text('starting line-up', {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 25,
            fill: '#ff0000',
            align: 'center',
            stroke: '#ffffff',
            strokeThickness: 1
        });
        this.text.position.set(this.app.width / 2, this.app.height * 0.85);
        this.text.anchor.set(0.5, 0.5);
        this.app.stage.addChild(this.text);
    }

    createPlayers() {
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            let card = new Card({
                index: i,
                stats: player,
                font_size: this.stageHeight / 45 + 'px',  //change this shit!!

                cardTexture: `player_id_${player.player_img_id}`,
                card_x: (this.stageWidth / 6) * i,
                card_y: this.stageHeight * 0.88,
                card_width: this.stageWidth / 6,
                card_height: this.stageHeight * 0.12,

                shoeTexture: `shoe`,
                shoe_x: (this.stageWidth / 5.95) * i,
                shoe_y: this.stageHeight * 0.882,
                shoe_height: this.stageWidth / 21,

                attack_text: {
                    x: (this.stageWidth / 6) * i + this.stageWidth / 6,
                    y: this.stageHeight * 0.88
                },

                gloveTexture: `glove2`,
                glove_x: (this.stageWidth / 5.95) * i,
                glove_y: this.stageHeight * 0.963,
                glove_height: this.stageWidth / 17,

                defense_text: {
                    x: (this.stageWidth / 6) * i + this.stageWidth / 6,
                    y: this.stageHeight * 0.97
                },

                yellowCardTexture: `yellow_card`,
                yellowCard_x: (this.stageWidth / 6 * i) + (this.stageWidth / 12),
                yellowCard_y: this.stageHeight * 0.942,
                yellowCard_width: this.stageWidth / 8,

                injuryTexture: `red_cross`,
                injury_x: (this.stageWidth / 6 * i) + (this.stageWidth / 12),
                injury_y: this.stageHeight * 0.942,
                injury_width: this.stageWidth / 8,

                border_x: (this.stageWidth / 6) * i,
                border_y: this.stageHeight * 0.879,
                border_width: this.stageWidth / 6,
                border_height: this.stageHeight * 0.12
            }, this.app, false);
            this.app.stage.addChild(card);
            card.makeInteractive();
        }
    }
}
