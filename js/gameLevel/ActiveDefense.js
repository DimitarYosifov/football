export default class ActiveDefense extends PIXI.Sprite {

    constructor(app, tintValue, initialX, initialY, color) {
        super();
        this.app = app;
        this.stageWidth = this.app.stage.width;
        this.stageHeight = this.app.stage.height;
        this.texture = this.app.loader.resources.assets.textures[`images/glove2`];
        this.color = color;
        this.height = this.stageHeight * 0.05;
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
            let firstEmpty = this.app.level.playerActiveDefenses.findIndex(i => i === null);
            this.index = firstEmpty;
            this.height = this.stageHeight * 0.05;
            this.width = this.height;
            this.newY = this.app.level.playerActiveDefensesY;
            this.newX = this.width / 2 + firstEmpty * this.stageWidth / this.app.level.playerActiveDefenses.length;
            console.log(this.newX);
            console.log(this.newY);
            this.app.level.playerActiveDefenses[firstEmpty] = this;
        } else {
            let firstEmpty = this.app.level.opponentActiveDefenses.findIndex(i => i === null);
            this.index = firstEmpty;
            this.height = this.stageHeight * 0.05;
            this.scale.x = this.scale.y;
            this.newY = this.app.level.opponentActiveDefensesY;
            this.newX = this.width / 2 + firstEmpty * this.stageWidth / this.app.level.opponentActiveDefenses.length;
            console.log(this.newX);
            console.log(this.newY);
            this.app.level.opponentActiveDefenses[firstEmpty] = this;
        }

        TweenMax.to(this, .5, {
            delay: .5,
            x: this.newX,
            y: this.newY
        });
    }
}
