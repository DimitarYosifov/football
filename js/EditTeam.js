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
        this.createTexts();
        this.createPlayers();
    }

    createHeader() {
        this.text = new PIXI.Text('Edit Your Team', {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 18,
            fill: '#ff0000',
            align: 'center',
            stroke: '#ffffff',
            strokeThickness: 0.5
        });
        this.text.position.set(this.app.width / 2, this.app.height * 0.05);
        this.text.anchor.set(0.5, 0.5);
        this.app.stage.addChild(this.text);
    }

    createTexts() {
        let create = (_text, y) => {
            let text = new PIXI.Text(_text, {
                fontFamily: this.app.config.mainFont,
                fontSize: this.app.height / 28,
                fill: '#ff0000',
                align: 'center',
                stroke: '#ffffff',
                strokeThickness: 0
            });
            text.position.set(0, y);
            text.anchor.set(0, 0.5);
            this.app.stage.addChild(text);
        }
        create('goalkeepers', this.app.height * 0.10);
        create('defenders', this.app.height * 0.29);
        create('midfielders', this.app.height * 0.48);
        create('forwards', this.app.height * 0.67);
        create('starting line-up', this.app.height * 0.86);
    }

    createPlayers() {
        let Y_positions = {
            starting: this.app.height * 0.88,
            GK: this.app.height * 0.69,
            DF: this.app.height * 0.50,
            MD: this.app.height * 0.31,
            F: this.app.height * 0.12
        }

        let playersCount = {
            starting: 0,
            GK: 0,
            DF: 0,
            MD: 0,
            F: 0
        }

        for (let i = 0; i < this.players.length; i++) {
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

                //TODO - come up with something better here!
                //this is unused
                border_x: card_x + card_width,
                border_y: card_y,
                border_width: 0,
                border_height: card_height
            }, this.app, false);
            this.app.stage.addChild(card);
            card.makeInteractive();
            isSub ? playersCount[playerPosition]++ : playersCount.starting++;
        }
    }
}
