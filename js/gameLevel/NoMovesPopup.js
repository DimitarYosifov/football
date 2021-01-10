export default class NoMovesPopup extends PIXI.Container {

    constructor(app) {
        super();
        this.app = app;
        this.create();
    }

    create() {
        // alert('No Moves');
        this.text = new PIXI.Text('No Moves', {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 8,
            fill: '#df2525',
            align: 'center',
            stroke: '#dbb7b7',
            strokeThickness: 7
        });
        this.text.position.set(this.app.width / 2, this.app.height / 2);
        this.text.anchor.set(0.5, 0.5);
        this.addChild(this.text);
    }
}
