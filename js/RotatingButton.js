import GameTexture from "./GameTexture.js";

export default class RotatingButton extends PIXI.Sprite {

    constructor(app, defaultTexture, onInteractionTexture, onPointerDown) {
        super();
        this.app = app;
        this.defaultTexture = defaultTexture ? defaultTexture : "ball_prototype";
        this.onInteractionTexture = onInteractionTexture ? onInteractionTexture : "ball_green";
        this.texture = new GameTexture(this.app, this.defaultTexture).finalTexture;
        this.anchor.set(0.5);
        this.interactive = true;
        this.on('pointerdown', () => {
            this.activate();
            TweenMax.delayedCall(0.2, () => {
                onPointerDown();
                this.deactivate();
            });
        })
        this.on('pointerover', () => {
            this.activate();
        })

        this.on('pointerout', () => {
            this.deactivate();
        })
    }

    setButtonSize(scale, x, y) {
        this.height = scale;
        this.scale.x = this.scale.y;
        this.x = x;
        this.y = y;
    }

    addLabel(text, fontSize, options = {}) {
        let style = {
            ...{
                fontFamily: this.app.config.mainFont,
                fontSize: this.height * fontSize,
                fill: '#f5f5dc',
                align: 'center',
                stroke: '#000000',
                fontWeight: 200,
                strokeThickness: 4
            }, options
        }
        this.label = new PIXI.Text(text, style);
        this.label.anchor.set(0.5, 0.5);
        this.label.position.set(
            this.x,
            this.y
        );
        this.parent.addChild(this.label);
    }

    activate() {
        this.label.style.stroke = "#f5f5dc";
        this.label.style.fill = "#000000";
        if (!this.btn_rotation) {
            this.btn_rotation = TweenMax.to(this, 3000, {
                rotation: 360
            });
        } else {
            this.btn_rotation.play();
        }
        this.texture = new GameTexture(this.app, this.onInteractionTexture).finalTexture;
    }

    deactivate() {
        this.label.style.stroke = "#000000";
        this.label.style.fill = "#f5f5dc";
        this.btn_rotation.pause();
        this.texture = new GameTexture(this.app, this.defaultTexture).finalTexture;
    }
}
