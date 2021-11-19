import GameTexture from "./GameTexture.js";

export default class Animation extends PIXI.Container {
    constructor(app, data) {
        super();
        this.app = app;

        let frames = [];
        for (let frame = 1; frame <= data.frames; frame++) {
            let current = new GameTexture(this.app, `${data.name}_${frame}`).finalTexture;
            frames.push(current);
        }

        this.anim = new PIXI.extras.AnimatedSprite(frames);
        this.anim.animationSpeed = data.speed;
        this.anim.loop = data.loop;
        this.anim.paused = data.paused;
        this.addChild(this.anim);
        if (!data.paused) {
            this.anim.play();
        }
    }
}
