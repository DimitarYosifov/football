"use strict";

export default class Stage {

    constructor() {
        this.stage;
        this.gameWindow = document.getElementById('gameWindow');
        this.width = 0;
        this.height = 0;
        let resolutiion = () => {
            this.width = window.innerWidth > 550 ? 550 : window.innerWidth;
            this.height = window.innerHeight > 900 ? 900 : window.innerHeight;
            this.gameWindow.style.height = this.height;
            this.gameWindow.style.width = this.width;
        }
        resolutiion();


        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {
            transparent: false,
            resolution: 1
        });


        this.gameWindow.appendChild(this.renderer.view);
        this.stage = new PIXI.Container();

        this.animationLoop = () => {
            this.renderer.render(this.stage);
            requestAnimationFrame(this.animationLoop);
        };

        this.setup = () => {
            this.animationLoop();
        };

        this.loader = PIXI.loader;
        this.loader.add('spriteSheet', "images/pitch.png");
        this.loader.load(this.setup);
//       window.onresize = resolutiion;
//       ТODO... fucked up






    }
//  TODO
    resize() {
        if (window.innerWidth / window.innerHeight >= ratio) {
            var w = window.innerHeight * ratio;
            var h = window.innerHeight;
        } else {
            var w = window.innerWidth;
            var h = window.innerWidth / ratio;
        }
        renderer.view.style.width = w + 'px';
        renderer.view.style.height = h + 'px';
    }
}