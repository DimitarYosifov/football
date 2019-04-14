"use strict";
const gameWindow = document.getElementById('gameWindow');
let width = 0;
let height = 0;

function resolution() {
    width = window.innerWidth > 550 ? 550 : window.innerWidth;
    height = window.innerHeight > 900 ? 900 : window.innerHeight;
    console.log(width);
    console.log(height);
    gameWindow.style.height = height;
    gameWindow.style.width = width;
}
;
resolution()

const renderer = PIXI.autoDetectRenderer(width, height, {
    transparent: false,
    resolution: 1
});

gameWindow.appendChild(renderer.view);
let stage = new PIXI.Container();
let loader = PIXI.loader;
loader.add('spriteSheet', 'images/pitch.png');
//loader.add('spriteSheet1', 'images/ball_red.png');
loader.load(setup);

function setup() {
    level.setLevelBackground();
    level.createLevelGrid();
    level.createPlayerCards();
    level.createOpponentCards();
    level.checkGridForMatches();

    animationLoop();
}
function animationLoop() {
    renderer.render(stage);
    requestAnimationFrame(animationLoop);
}




    