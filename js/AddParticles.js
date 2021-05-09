
export default class AddParticles {

    constructor(app, level) {
        this.app = app;
        this.level = level;
        let container = new PIXI.Container();
        // Create a new emitter
        // note: if importing library like "import * as particles from 'pixi-particles'"
        // or "const particles = require('pixi-particles')", the PIXI namespace will
        // not be modified, and may not exist - use "new particles.Emitter()", or whatever
        // your imported namespace is
        var emitter = new PIXI.particles.Emitter(
            // var emitter = new particles.Emitter()(

            // The PIXI.Container to put the emitter in
            // if using blend modes, it's important to put this
            // on top of a bitmap, and not use the root stage Container
            container,

            // The collection of particle images to use
            // [PIXI.Texture.fromImage('image.jpg')],
            [this.app.loader.resources.main1.textures[`rain`]],

            // Emitter configuration, edit this to change the look
            // of the emitter
            {
                "alpha": {
                    "start": 0.35,
                    "end": 0.35
                },
                "scale": {
                    "start": 0.4,
                    "end": 0.4
                },
                "color": {
                    "start": "ffffff",
                    "end": "ffffff"
                },
                "speed": {
                    "start": 500,
                    "end": 500
                },
                "startRotation": {
                    "min": 80,
                    "max": 80
                },
                "rotationSpeed": {
                    "min": 0,
                    "max": 0
                },
                "lifetime": {
                    "min": 3,
                    "max": 3
                },
                "blendMode": "normal",
                "frequency": 0.007,
                "emitterLifetime": 0,
                "maxParticles": 10000,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": false,
                "spawnType": "rect",
                "spawnRect": {
                    "x": this.level.x - this.level.width / 2,
                    "y": this.level.y - this.level.height / 2,
                    "w": this.level.width * 2,
                    "h": this.level.height
                }
            }
        );

        // Calculate the current time
        var elapsed = Date.now();

        // Update function every frame
        var update = function () {

            // Update the next frame
            requestAnimationFrame(update);

            var now = Date.now();

            // The emitter requires the elapsed
            // number of seconds since the last update
            emitter.update((now - elapsed) * 0.001);
            elapsed = now;

            // Should re-render the PIXI Stage
            // renderer.render(stage);
        };

        // Start emitting
        emitter.emit = true;

        setTimeout(() => {
            //test stop/destroy;
            // emitter.emit = false;
            // emitter.destroy(); // this will kill the emitter
        }, 3333);

        // Start the update
        update();

        // container.x = 333
        // container.y = 333
        // container.width = 333
        // container.height = 333

        // this.stage.addChild(container)
        return container;
    }

}
