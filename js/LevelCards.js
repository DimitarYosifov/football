import config from "./Config.js";

export default class LevelCards {
    constructor(data) {

        this.config = config;
        this.font_size = data.font_size;
        this.index = data.index;
        this.stats = data.stats;
        this.cardTexture = data.cardTexture;
        this.card_height = data.card_height;
        this.card_width = data.card_width;
        this.card_x = data.card_x;
        this.card_y = data.card_y;

        this.shoeTexture = data.shoeTexture;
        this.shoe_height = data.shoe_height;
        this.shoe_width = data.shoe_width;
        this.shoe_x = data.shoe_x;
        this.shoe_y = data.shoe_y;

        this.attack_text = data.attack_text;
        this.defense_text = data.defense_text;

        this.gloveTexture = data.gloveTexture;
        this.glove_height = data.glove_height;
        this.glove_width = data.glove_width;
        this.glove_x = data.glove_x;
        this.glove_y = data.glove_y;

        this.border_height = data.border_height;
        this.border_width = data.border_width;
        this.border_x = data.border_x;
        this.border_y = data.border_y;

        this.createCard();
    }

    createCard() {

        this.container = new PIXI.Container();
        this.container.index = this.index;

        //stats            
        this.container.stats = this.stats;

        //card background
        let cardTexture = PIXI.Texture.fromImage(this.cardTexture);
        let card = new PIXI.Sprite(cardTexture);
        card.x = this.card_x;
        card.y = this.card_y;
        card.width = this.card_width;
        card.height = this.card_height;

        //attack section
        let shoeTexture = PIXI.Texture.fromImage(this.shoeTexture);
        let shoe = new PIXI.Sprite(shoeTexture);
        shoe.x = this.shoe_x;
        shoe.y = this.shoe_y;
        shoe.width = this.shoe_width;
        shoe.height = this.shoe_height;
        shoe.tint = '0x' + this.container.stats.attack_color;



        //defense section
        let gloveTexture = PIXI.Texture.fromImage(this.gloveTexture);
        let glove = new PIXI.Sprite(gloveTexture);
        glove.x = this.glove_x;
        glove.y = this.glove_y;
        glove.width = this.glove_width;
        glove.height = this.glove_height
        glove.tint = '0x' + this.container.stats.defense_color;

        //border
        let border = new PIXI.Graphics();
        border.lineStyle(1, 0xd0c639, 1);
        border.drawRect(this.border_x, this.border_y, this.border_width, this.border_height);

        //add children
        this.container.addChild(card);

        let attackValuesText = new PIXI.Text(this.container.stats.attack_current + '/' + this.container.stats.attack_full, {
            fontFamily: this.config.mainFont,
            fontSize: this.font_size,
            fill: '#' + this.container.stats.attack_color, align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        });
        attackValuesText.position.set(this.attack_text.x, this.attack_text.y);
        attackValuesText.anchor.x = 1;

        let defenseValuesText = new PIXI.Text(this.container.stats.defense_current + '/' + this.container.stats.defense_full, {
            fontFamily: this.config.mainFont,
            fontSize: this.font_size,
            fill: '#' + this.container.stats.defense_color, align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        });
        defenseValuesText.position.set(this.defense_text.x, this.defense_text.y);
        defenseValuesText.anchor.x = 1;

        this.container.addChild(attackValuesText);
        this.container.addChild(defenseValuesText);

        this.container.addChild(shoe);
        this.container.addChild(glove);
        this.container.addChild(border);
//        TweenMax.delayedCall(1, () => {
//            TweenMax.to(this.container, 0.5, {alpha: 1});
//        })
//        console.log(this.container);
    }
}
