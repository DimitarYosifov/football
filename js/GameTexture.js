export default class GameTexture {
    constructor(app, textureName) {
        this.app = app;
        const allResources = this.app.loader.resources;
        this.sprite;
        Object.keys(allResources).forEach(resource => {
            const textures = Object.keys(allResources).find(r => r === resource);
            const elements = allResources[textures].textures;
            if (!elements) {
                return;
            }
            Object.keys(elements).forEach(el => {
                if (textureName === el) {
                    this.finalTexture = elements[el];
                    this.sprite = new PIXI.Sprite(this.finalTexture);
                }
            })
        });
    }
}
