
import GameTexture from "../GameTexture.js";

export default class FullAttack extends PIXI.Sprite {

    constructor(app, tintValue, initialX, initialY, color, initiatorIndex) {
        super();
        this.app = app;
        this.initiatorIndex = initiatorIndex;
        this.stageWidth = this.app.stage.width;
        this.stageHeight = this.app.stage.height;
        this.texture = new GameTexture(this.app, "shoe").finalTexture;
        this.height = this.stageHeight * 0.05;
        this.color = color;
        this.scale.x = this.scale.y;
        this.anchor.set(0.5, 0.5);
        this.y = initialY;
        this.x = initialX
        this.tint = "0x" + tintValue;
        let scaleValue = this.scale.x;
        TweenMax.to(this.scale, .5, {
            x: scaleValue * 2,
            y: scaleValue * 2
        });
        TweenMax.to(this.scale, .5, {
            delay: .5,
            x: scaleValue,
            y: scaleValue
        });

        if (this.app.playerTurn) {
            // let firstEmpty = this.app.level.playerActiveDefenses.findIndex(i => i === null);
            // this.height = this.stageHeight * 0.05;
            // this.width = this.height;
            // this.newY = this.stageHeight * 0.6;
            // this.newX = this.stageWidth / 2;
            // this.app.level.playerActiveDefenses[firstEmpty] = this;
        } else {
            // let firstEmpty = this.app.level.opponentActiveDefenses.findIndex(i => i === null);
            // this.height = this.stageHeight * 0.05;
            // this.scale.x = this.scale.y;
            // this.newY = this.app.level.opponentActiveDefensesY;
            // this.newX = this.width / 2 + firstEmpty * this.stageWidth / this.app.level.opponentActiveDefenses.length;
            // console.log( this.newX);
            // console.log( this.newY);
            // this.app.level.opponentActiveDefenses[firstEmpty] = this;
        }

        // TweenMax.to(this, .5, {
        //     delay: .5,
        //     x: this.newX,
        //     y: this.newY
        // });
    }
}
