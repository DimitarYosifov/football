import GameTexture from "./GameTexture.js";

export default class AddParticles {

    constructor(app, level, config, textures) {
        this.app = app;
        this.textures = this.parseTextures(textures);
        this.level = level;
        this.container = new PIXI.particles.ParticleContainer(6000, { scale: true, position: true, rotation: true, alpha: true });

        this.emitter = new PIXI.particles.Emitter(
            this.container ,
            this.textures,
            config
        );

        var elapsed = Date.now();

        this.update = () => {
            requestAnimationFrame(this.update);
            var now = Date.now();
            this.emitter.update((now - elapsed) * 0.001);
            elapsed = now;
        };
        this.emitter.emit = true;
    }

    parseTextures(textures) {
        let texturesArray = [];
        textures.forEach(texture => {
            texturesArray.push(new GameTexture(this.app, texture).finalTexture);
        });
        return texturesArray;
    }
}
