export default class Stage {

    constructor() {

        this.isMobile;
        this.landscape;
        this.isAppStarted = false;

        window.onorientationchange = function (event) {
            console.log(event.target.screen.orientation.type);
        };

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            this.isMobile = true;
        }

        this.landscape = this.isMobile && window.screen.width > window.screen.height;
        // Use the native window resolution as the default resolution
        // will support high-density displays when rendering
        PIXI.settings.RESOLUTION = window.devicePixelRatio;    //??????????????

        // Disable interpolation when scaling, will make texture be pixelated
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

        this.canvas = document.getElementById("stage");
        this.body = document.getElementById("body");

        this.stage = new PIXI.Container();
        this.width = 1080;
        this.height = 1920;

        let resolutiion = () => { //16:9

            //resume requestAnimationFrame 
            if (this.landscape && this.isMobile && window.screen.width < window.screen.height) {
                requestAnimationFrame(this.animationLoop);
            }
            this.landscape = this.isMobile && window.screen.width > window.screen.height;

            ////THIS DOESNT WORK ON FULL SCREEN TODO-FIX IT
            document.getElementById("rotate").style.display = this.landscape ? "flex" : "none";
            ///////////////////////////////////////////////

            if (this.landscape) {
                document.getElementById("rotate").style.background = "red";
                return;
            }

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

            this.body.style.width = window.innerWidth + "px";
            this.body.style.height = window.innerHeight + "px";
            if (!this.isAppStarted) {
                this.isAppStarted = true;
                this.checkLoaded();
            }
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
            if (!this.landscape) {
                requestAnimationFrame(this.animationLoop);
            }
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
        this.loader.onComplete.add(handleLoadComplete);

        this.loader.on("progress", loadProgressHandler);
        this.loader.load(this.setup);
        window.onresize = resolutiion;

        function loadProgressHandler(loader, resource) {

            //Display the file `url` currently being loaded
            console.log("loading: " + resource.url);

            //Display the percentage of files currently loaded
            console.log("progress: " + loader.progress + "%");

            //If you gave your files names as the first argument 
            //of the `add` method, you can access them like this
            //console.log("loading: " + resource.name);
        }
    }
}
