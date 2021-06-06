import config from "../Config.js";
import activeDefense from "./ActiveDefense.js";
import fullAttack from "./FullAttack.js";

export default class Card extends PIXI.Container {
    constructor(data, app, showCurrentValues = true, randomColor) {

        super();

        this.app = app;
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

        this.yellowCardTexture = data.yellowCardTexture;
        this.yellowCard_width = data.yellowCard_width;
        this.yellowCard_x = data.yellowCard_x;
        this.yellowCard_y = data.yellowCard_y;

        this.injuryTexture = data.injuryTexture;
        this.injury_width = data.injury_width;
        this.injury_x = data.injury_x;
        this.injury_y = data.injury_y;

        this.border_height = data.border_height;
        this.border_width = data.border_width;
        this.border_x = data.border_x;
        this.border_y = data.border_y;

        this.colors = {
            'FF1D00': "ball_red",     // RED:
            '3052FF': "ball_blue",    // BLUE:
            '2F7F07': "ball_green",   // GREEN:
            'E2D841': "ball_yellow",  // YELLOW:
            'B200FF': "ball_purple"   // PURPLE:
        }

        this.showCurrentValues = showCurrentValues;
        this.goalsScored = 0;
        this.randomColor = randomColor;
        this.createCard();
    }

    createCard() {

        this.index = this.index;
        this.stats = this.stats;

        if (this.config.randomCardColors && this.randomColor) {
            const colors = Object.keys(this.colors);
            const atk_index = Math.floor(Math.random() * colors.length);
            const def_index = Math.floor(Math.random() * colors.length);
            this.stats.attack_color = colors[atk_index];
            this.stats.defense_color = colors[def_index];
        }

        //card background
        let cardTexture = this.app.loader.resources.players.textures[this.cardTexture];
        this.cardImg = new PIXI.Sprite(cardTexture);
        this.cardImg.x = this.card_x;
        this.cardImg.y = this.card_y;
        this.cardImg.width = this.card_width;
        this.cardImg.height = this.card_height;

        //attack section
        let shoeTexture = this.app.loader.resources.main1.textures[this.shoeTexture];
        this.shoe = new PIXI.Sprite(shoeTexture);
        this.shoe.x = this.shoe_x;
        this.shoe.y = this.shoe_y;
        this.shoe.height = this.shoe_height;
        this.shoe.scale.x = this.shoe.scale.y;
        this.shoe.tint = '0x' + this.stats.attack_color;

        //defense section
        let gloveTexture = PIXI.Texture.fromImage(this.gloveTexture);
        this.glove = new PIXI.Sprite(gloveTexture);
        this.glove.x = this.glove_x;
        this.glove.y = this.glove_y;
        this.glove.height = this.glove_height;
        this.glove.scale.x = this.glove.scale.y;
        this.glove.tint = '0x' + this.stats.defense_color;

        let injuryTexture = PIXI.Texture.fromImage(this.injuryTexture);
        this.injury = new PIXI.Sprite(injuryTexture);
        this.injury.x = this.injury_x;
        this.injury.y = this.injury_y;
        this.injury.width = this.injury_width;
        this.injury.scale.y = this.injury.scale.x;
        this.injury.alpha = 0.75;
        this.injury.anchor.set(0.5, 0.5);
        this.injury.visible = this.stats.injured > 0;
        this.hasInjury = this.stats.injured > 0;

        let yellowCardTexture = PIXI.Texture.fromImage(this.yellowCardTexture);
        this.yellowCard = new PIXI.Sprite(yellowCardTexture);
        this.yellowCard.x = this.yellowCard_x;
        this.yellowCard.y = this.yellowCard_y;
        this.yellowCard.width = this.yellowCard_width;
        this.yellowCard.scale.y = this.yellowCard.scale.x;
        this.yellowCard.alpha = 0.75;
        this.yellowCard.anchor.set(0.5, 0.5);
        this.yellowCard.visible = false;
        this.hasYellowCard = false;
        this.hasRedCard = false;



        //border
        this.border = new PIXI.Graphics();
        this.border.lineStyle(1, 0xd0c639, 1);
        this.border.drawRect(this.border_x, this.border_y, this.border_width, this.border_height);

        this.addChild(this.cardImg);

        const attText = this.showCurrentValues ?
            this.stats.attack_current + '/' + this.stats.attack_full :
            this.stats.attack_full

        this.attackValuesText = new PIXI.Text(attText, {
            fontFamily: this.config.mainFont,
            fontSize: this.font_size,
            fill: '#' + this.stats.attack_color, align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.attackValuesText.position.set(this.attack_text.x, this.attack_text.y);
        this.attackValuesText.anchor.x = 1;

        const defText = this.showCurrentValues ?
            this.stats.defense_current + '/' + this.stats.defense_full :
            this.stats.defense_full

        this.defenseValuesText = new PIXI.Text(defText, {
            fontFamily: this.config.mainFont,
            fontSize: this.font_size,
            fill: '#' + this.stats.defense_color, align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.defenseValuesText.position.set(this.defense_text.x, this.defense_text.y);
        this.defenseValuesText.anchor.x = 1;

        this.attackValuesText.name = "attackValuesText";
        this.defenseValuesText.name = "defenseValuesText";

        this.addChild(this.attackValuesText);
        this.addChild(this.defenseValuesText);

        this.addChild(this.shoe);
        this.addChild(this.glove);
        this.addChild(this.injury);
        this.addChild(this.yellowCard);
        this.addChild(this.border);
    }

    increasePoints(matches) {

        let defenceColor = this.colors[this.stats.defense_color];
        let attackColor = this.colors[this.stats.attack_color];
        let def_points = matches.filter(e => e.type === defenceColor).length;
        let atk_points = matches.filter(e => e.type === attackColor).length;

        let initialScaleX = this.cardImg.scale.x;
        let initialScaley = this.cardImg.scale.y;

        if (def_points > 0 && !this.hasRedCard) {
            if (this.hasInjury) {
                def_points = Math.floor(def_points / 2)
            }
            this.stats.defense_current += def_points;
            if (this.stats.defense_current >= this.stats.defense_full) {
                TweenMax.to(this.cardImg, .15, {
                    delay: .7,
                    onComplete: () => {
                        this.cardImg.tint = 16777215;
                        this.stats.defense_current -= this.stats.defense_full;
                        this.defenseValuesText.text = `${this.stats.defense_current}/${this.stats.defense_full}`;
                    }

                });
                TweenMax.to(this.cardImg.scale, .15, {
                    x: initialScaleX * 1.05,
                    y: initialScaley * 1.05,
                    yoyo: true,
                    repeat: 1
                })
                this.cardImg.tint = "0x" + this.stats.defense_color;
                let glove = new activeDefense(
                    this.app, this.stats.defense_color,
                    this.card_x + this.card_width / 2,
                    this.card_y + this.card_height / 2,
                    this.colors[this.stats.defense_color]
                );
                this.app.level.addChild(glove);
            }
            this.defenseValuesText.text = `${this.stats.defense_current}/${this.stats.defense_full}`;

            //TODO  create separate class for this and add some delay between text tweens
            let def_text = new PIXI.Text("+" + def_points, {
                fontFamily: this.config.mainFont,
                fontSize: this.cardImg.height / 2,
                fill: '#' + this.stats.defense_color,
                align: 'center',
                stroke: '#000000',
                strokeThickness: 2
            });
            def_text.position.set(this.cardImg.x + this.cardImg.width / 2, this.cardImg.y + this.cardImg.height / 2);
            def_text.anchor.x = 0.5;
            def_text.anchor.y = 0.5;

            this.parent.parent.addChild(def_text);// TODO add picture to +3 for example!!!

            TweenMax.to(def_text, 1.5, {
                y: this.parent.parent.height / 2,
                // alpha: 0.75,
                ease: Linear.easeNone,  //TODO... change ease
                onComplete: () => {
                    def_text.alpha = 0;
                    this.parent.parent.removeChild(def_text);
                }
            })
        }

        if (atk_points > 0 && !this.hasRedCard) {
            if (this.hasInjury) {
                atk_points = Math.floor(atk_points / 2)
            }
            this.stats.attack_current += atk_points;
            if (this.stats.attack_current >= this.stats.attack_full) {
                TweenMax.to(this.cardImg.scale, .15, {
                    x: initialScaleX * 1.05,
                    y: initialScaley * 1.05,
                    yoyo: true,
                    repeat: 1
                })
                TweenMax.to(this.cardImg, .15, {
                    delay: .7,
                    onComplete: () => {
                        this.cardImg.tint = 16777215;
                        this.stats.attack_current -= this.stats.attack_full;
                        this.attackValuesText.text = `${this.stats.attack_current}/${this.stats.attack_full}`;
                    }
                });
                this.cardImg.tint = "0x" + this.stats.attack_color;
                let fullAttackShoe = new fullAttack(
                    this.app, this.stats.attack_color,
                    this.card_x + this.card_width / 2,
                    this.card_y + this.card_height / 2,
                    this.colors[this.stats.attack_color],
                    this.index
                );
                this.app.level.goalAttempts.push(fullAttackShoe);
                this.app.level.addChild(fullAttackShoe);

            }
            this.attackValuesText.text = `${this.stats.attack_current}/${this.stats.attack_full}`;

            //TODO  create separate class for this and add some delay between text tweens
            let atk_text = new PIXI.Text("+" + atk_points, {
                fontFamily: this.config.mainFont,
                fontSize: this.cardImg.height / 2,
                fill: '#' + this.stats.attack_color,
                align: 'center',
                stroke: '#000000',
                strokeThickness: 2
            });
            atk_text.position.set(this.cardImg.x + this.cardImg.width / 2, this.cardImg.y + this.cardImg.height / 2);
            atk_text.anchor.x = 0.5;
            atk_text.anchor.y = 0.5;

            this.parent.parent.addChild(atk_text);// TODO add picture to +3 for example!!!

            TweenMax.to(atk_text, 1.5, {
                delay: def_points > 0 ? 0.25 : 0,
                y: this.parent.parent.height / 2,
                // alpha: 0.75,
                ease: Linear.easeNone,  //TODO... change ease
                onComplete: () => {
                    atk_text.alpha = 0;
                    this.parent.parent.removeChild(atk_text);
                }
            })
        }
    }

    addLeagueCardsAndInjury(count, hasRedCard, injuredFor_n_games) {
        let yellowCardTexture = PIXI.Texture.fromImage(this.yellowCardTexture);
        let yellowCard = new PIXI.Sprite(yellowCardTexture);
        yellowCard.x = this.card_x + this.card_width * 0.5;
        yellowCard.y = this.card_y + this.card_height * 1.2;
        yellowCard.width = this.card_width / 5;
        yellowCard.scale.y = yellowCard.scale.x;
        yellowCard.alpha = 1;
        yellowCard.anchor.set(1, 0);
        yellowCard.visible = true;
        this.addChild(yellowCard);
        this.selectable = true;

        if (count === 5) {
            this.yellowCard.visible = true;
            // this.selectable = false;
        }
        else if (hasRedCard) {
            this.yellowCard.texture = this.app.loader.resources.main1.textures[`red_card`];
            this.yellowCard.visible = true;
            // this.selectable = false;
        }
        else if (injuredFor_n_games !== 0) {
            this.injury.visible = true;
            // this.selectable = false;
            this.createTexts.create(`${injuredFor_n_games}`, this.card_y + this.card_height / 2, this.card_x + this.card_width / 2, 0.5, 0.5, this.app.height / 50, false);
        }
    }

    addGoalsScored(x) {
        let ballTexture = this.app.loader.resources.main1.textures[`ball_prototype`];
        let ball = new PIXI.Sprite(ballTexture);
        ball.x = x;
        ball.y = this.card_y + this.card_height * 1.02;
        ball.width = this.card_width / 5;
        ball.scale.y = ball.scale.x;
        ball.alpha = 1;
        ball.anchor.set(1, 0);
        this.addChild(ball);
    }

    createTexts = {
        create: (_text, y, x, anchorX, anchorY, fontSize, returnText = false, color = "#ffffff") => {
            let text = new PIXI.Text(_text, {
                fontFamily: this.app.config.mainFont,
                fontSize: fontSize,
                fill: color,
                align: 'center'
            });
            text.position.set(x, y);
            text.anchor.set(anchorX, anchorY);
            this.addChild(text);
            if (returnText) return text;
        }
    }
}
