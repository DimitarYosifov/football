"use strict";

export default class Stage {

    constructor() {

        // Use the native window resolution as the default resolution
        // will support high-density displays when rendering
        PIXI.settings.RESOLUTION = window.devicePixelRatio;    //??????????????

        // Disable interpolation when scaling, will make texture be pixelated
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

        this.canvas = document.getElementById("stage");
        this.stage = new PIXI.Container();

        let resolutiion = () => { //16:9



            console.log(window.devicePixelRatio);



            this.width = Math.round(window.innerWidth) > 450 ? 450 : Math.round(window.innerWidth);

            // this.stage.width = this.width;
            // this.canvas.width = this.width;

            if (this.width * 1.77 > window.innerHeight) {
                this.height = window.innerHeight;
            } else {
                this.height = Math.round(this.width * 1.77);
            }

            if (window.innerHeight < 450 * 1.77) {
                this.height = window.innerHeight;
                this.width = window.innerHeight * 0.562;
            }

            this.stage.width = this.width;
            this.canvas.width = this.width;

            this.canvas.height = this.height;
            this.stage.height = this.height;
            this.renderer.resize(this.canvas.width, this.canvas.height);
        }

        this.renderer = PIXI.autoDetectRenderer(this.canvas.width, this.canvas.height, {
            transparent: true,
            // resolution: 11,//DPR test
            resolution: window.devicePixelRatio || 1,//2, //7 :) //DPR
            view: this.canvas,
            autoResize: true,
            autoDensity: true,
            antialias: true
        });

        resolutiion();
        // alert(window.devicePixelRatio)
        // document.documentElement.webkitRequestFullScreen();
        this.animationLoop = () => {
            this.renderer.render(this.stage);
            requestAnimationFrame(this.animationLoop);
        };

        this.setup = () => {
            this.animationLoop();
        };

        this.loader = PIXI.loader;
        this.loader.add('spriteSheet', "images/pitch.png");
        this.loader.add('Girassol', 'fonts/Girassol-Regular.ttf');

        this.loader.load(this.setup);

        window.onresize = resolutiion;
    }
}
