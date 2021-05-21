// import Background from "./Background.js";
import Card from "./gameLevel/Card.js";
import {EditTeamPositionsConfig} from "./EditTeamPositionsConfig.js";

export default class EditTeam {
    constructor(app) {
        this.app = app;
        this.EditTeamPositionsConfig = EditTeamPositionsConfig;
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
        console.log(this.EditTeamPositionsConfig(this.app));
        for (let i = 0; i < this.players.length; i++) {

            // these parms should be in config!!!!!! IMPORTANT
            let card_x = (this.app.width / 6) * i;
            let card_y = this.app.height * 0.88;
            let card_width = this.app.width / 6;
            let card_height = this.app.height * 0.12;

            let player = this.players[i];
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
        }
    }
}
