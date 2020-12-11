export default class NewRoundPopup extends PIXI.Container {

    constructor(app) {
        super();
        this.app = app;
        this.create();
    }

    create() {

        // alert('new Round class');
        this.text = new PIXI.Text(`Round ${this.app.level.currentRound}`, {
            fontFamily: this.app.config.mainFont,
            // fontFamily: this.app.loader.resources["Garissol"],
            fontSize: this.app.height / 7.5,
            fill: '#000000',
            align: 'center',
            stroke: '#dbb7b7',
            strokeThickness: 4
        });
        this.text.position.set(this.app.width / 2, this.app.height / 2);
        this.text.anchor.set(0.5, 0.5);
        this.addChild(this.text);
        TweenMax.delayedCall(1, () => {
            this.remove();
        })
    }

    remove() {
        this.parent.removeChild(this);
    }
}
