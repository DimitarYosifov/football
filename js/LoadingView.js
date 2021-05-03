import config from "./Config.js";

export default class LoadingView {
    constructor(w, h) {
        this.currentProgress = 0;
        this.width = w;
        this.height = h;
        let width = this.width * 0.75;
        let height = this.height * 0.01;
        let x = this.width * 0.125;
        let y = this.height / 2;

        this.loadingBarFull = new PIXI.Graphics();
        this.loadingBarFull.beginFill(0xFF0000, 1);
        this.loadingBarFull.drawRoundedRect(x, y, width, height, width / 75);
        this.loadingBarFull.endFill();


        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff, 1);
        mask.drawRoundedRect(x, y, width, height, width / 75);
        mask.endFill();
        this.loadingBarFull.mask = mask;


        this.loadingBar = new PIXI.Graphics();
        this.loadingBar.beginFill(0x817878, 1);
        this.loadingBar.drawRoundedRect(x, y, width, height, width / 75);;
        this.loadingBar.endFill();

        this.loadingText = new PIXI.Text(`loading...`, {
            fontFamily: config.mainFont,
            fontSize: this.height / 15,
            fill: '#000000',
            align: 'center',
            stroke: '#dbb7b7',
            fontWeight: 800,
            strokeThickness: 3
        });
        this.loadingText.position.set(this.width / 2, this.height * 0.4);
        this.loadingText.anchor.set(0.5, 0.5);

        this.progress = new PIXI.Text(`${this.currentProgress}%`, {
            fontFamily: config.mainFont,
            fontSize: this.height / 20,
            fill: '#000000',
            align: 'center',
            stroke: '#dbb7b7',
            fontWeight: 800,
            strokeThickness: 3
        });
        this.progress.position.set(this.width / 2, this.height * 0.6);
        this.progress.anchor.set(0.5, 0.5);
        this.progress.text = "ss"
    }

    updateProgress(loaded) {
        console.log(loaded);
        this.currentProgress = loaded;
        this.loadingBarFull.width = this.loadingBar.width * this.currentProgress / 100;
        this.progress.text = `${this.currentProgress}%`;
    }
}
