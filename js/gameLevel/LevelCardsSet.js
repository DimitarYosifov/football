import Card from "./Card.js";
import LineUps from "../LineUps.js";

export default class LevelCardsSet extends PIXI.Container {

    constructor(width, height, targetDeck, clubName) {
        super();
        this.targetDeck = targetDeck;
        this.clubName = clubName;
        this.stageWidth = width;
        this.stageHeight = height;
        this.lineUps = new LineUps(this.clubName, this.onCardsData, this.targetDeck);
        this.interactive = false;
    }

    createPlayerDeck() {
        for (let i = 0; i < 6; i++) {
            let card = new Card({
                index: i,
                stats: this.lineUps.player[i],
                font_size: this.stageHeight / 45 + 'px',  //change this shit!!

                cardTexture: `player_id_${this.lineUps.player[i].player_img_id}`,
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
            }, this.parent.app)
            this.addChild(card);
        }
    }

    createOpponentDeck() {
        for (let i = 0; i < 6; i++) {

            let card = new Card({
                index: i,
                stats: this.lineUps.opponent[i],
                font_size: this.stageHeight / 45 + 'px',  //idiotic!!!! TODO...

                cardTexture: `player_id_${this.lineUps.opponent[i].player_img_id}`,
                card_x: (this.stageWidth / 6) * i,
                card_y: 0,
                card_width: this.stageWidth / 6,
                card_height: this.stageHeight * 0.12,

                shoeTexture: `shoe`,
                shoe_x: (this.stageWidth / 5.95) * i,
                shoe_y: this.stageHeight * 0.005,
                shoe_height: this.stageWidth / 21,

                attack_text: {
                    x: (this.stageWidth / 6) * i + this.stageWidth / 6,
                    y: this.stageHeight * 0.002
                },

                gloveTexture: `glove2`,
                glove_x: (this.stageWidth / 5.95) * i,
                glove_y: this.stageHeight * 0.085,
                glove_height: this.stageWidth / 17,

                defense_text: {
                    x: (this.stageWidth / 6) * i + this.stageWidth / 6,
                    y: this.stageHeight * 0.092
                },

                yellowCardTexture: `yellow_card`,
                yellowCard_x: (this.stageWidth / 6 * i) + (this.stageWidth / 12),
                yellowCard_y: this.stageHeight * 0.063,
                yellowCard_width: this.stageWidth / 8,

                injuryTexture: `red_cross`,
                injury_x: (this.stageWidth / 6 * i) + (this.stageWidth / 12),
                injury_y: this.stageHeight * 0.063,
                injury_width: this.stageWidth / 8,

                border_x: (this.stageWidth / 6) * i,
                border_y: this.stageHeight * 0,
                border_width: this.stageWidth / 6,
                border_height: this.stageHeight * 0.122
            }, this.parent.app)
            this.addChild(card);
        }
    }

    onCardsData = () => {
        this.targetDeck === "player" ? this.createPlayerDeck() : this.createOpponentDeck();
    }
}
