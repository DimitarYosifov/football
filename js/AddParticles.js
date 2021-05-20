
export default class AddParticles {

    constructor(app, level) {
        this.app = app;
        this.level = level;
        this.container = new PIXI.particles.ParticleContainer(6000, { scale: true, position: true, rotation: true, alpha: true });
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
            this.container,

            // The collection of particle images to use
            // [PIXI.Texture.fromImage('image.jpg')],
            [this.app.loader.resources.main1.textures[`rain`]],

            // Emitter configuration, edit this to change the look
            // of the emitter
            {
                "alpha": {
                    "start": 0.4,
                    "end": 0.4
                },
                "scale": {
                    "start": 0.5,
                    "end":  0.5
                },
                "color": {
                    "start": "ffffff",
                    "end": "ffffff"
                },
                "speed": {
                    "start": 900,
                    "end": 900
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
                    "min": 1,
                    "max": 1
                },
                "blendMode": "normal",
                "frequency": 0.009,
                "emitterLifetime": 0,
                "maxParticles": 10000,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": false,
                "spawnType": "rect",
                "spawnRect": {
                    "x": this.level.x,
                    "y": this.level.y,
                    "w": this.level.width * 0.95,
                    "h": this.level.height * 0.5
                }
            }
        );

        // Calculate the current time
        var elapsed = Date.now();

        // Update function every frame
        this.update = () => {

            // Update the next frame
            // requestAnimationFrame(this.update);

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
            //      // test stop/destroy;
            // emitter.emit = false;
            // emitter.destroy(); // this will kill the emitter
        }, 3333);

        // Start the update
        // update();

        // container.x = 333
        // container.y = 333
        // container.width = 333
        // container.height = 333

        // this.stage.addChild(container)
    }

}
