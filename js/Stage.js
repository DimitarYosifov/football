
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
            this.width = 1080;
            this.height = 1920;

            this.height = window.innerHeight;
            this.width = 1080 * this.height / 1920;


            if (this.width > window.innerWidth) {
                this.width = window.innerWidth;
                this.height = this.width * 1.77;
            }

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.stage.height = this.height;
            this.stage.width = this.width;

            console.log(this.width)
            console.log(this.height)

            this.renderer.resize(this.canvas.width, this.canvas.height);
        }

        this.renderer = PIXI.autoDetectRenderer(this.canvas.width, this.canvas.height, {
            transparent: true,
            resolution: window.devicePixelRatio || 1,//2, //7 :) //DPR
            view: this.canvas,
            autoResize: true,
            autoDensity: true,
            antialias: true
        });

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

        resolutiion();
        this.animationLoop = () => {
            this.renderer.render(this.stage);
            requestAnimationFrame(this.animationLoop);
        };

        this.setup = () => {
            this.animationLoop();
        };

        this.loader = PIXI.loader;
        this.loader.add('assets', "assets/assets.json");
        this.loader.add('Girassol', 'fonts/Girassol-Regular.ttf');

        //this is needed to handle weird texture not loaded issue 
        let handleLoadComplete = () => {
            this.loaderLoaded = true;
            this.checkLoaded();
        }
        this.loader.onComplete.add(handleLoadComplete)

        this.loader.load(this.setup);
        window.onresize = resolutiion;
    }
}
