var canvas;
var context;
var proton = new Proton;
var protonRenderer;
function Main(matches) {
    if (matches.length !== 0) {
        initCanvas();
        tick();
        createProton(matches);
    }
}
function initCanvas() {
    canvas = document.getElementById("rrr");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context = canvas.getContext('2d');
    context.globalCompositeOperation = "lighter";
}
function createProton(matches) {
    console.log(matches);
    let row = matches[0].row;
    let col = matches[0].col;
//  horizontal
    if (matches[0].matchesRightward > 1) {
        fillingCardsPoints.matchColor(matches[0].type, matches[0].matchesRightward);
        for (let i = 0; i < matches[0].matchesRightward; i++) {
            emit(row, col + i, matches[0].type);
        }
    }
//  vertical
    if (matches[0].matchesDownward > 1) {

        fillingCardsPoints.matchColor(matches[0].type, matches[0].matchesDownward);
        console.log(matches[0]);
        for (let i = 0; i < matches[0].matchesDownward; i++) {
            emit(row + i, col, matches[0].type);
        }
    }
    function emit(row, col, type) {
        let grid_x = window.innerWidth / 2 - gameWindow.clientWidth / 2;
//        let grid_y = window.innerHeight / 2 - gameWindow.clientHeight / 2;
        let grid_w = width * 0.87;
        let grid_h = width * 1.12;
        let block_w = grid_w / 6;
        let block_h = grid_h / 8;
        let x = grid_x + col * block_w + block_w;
        let y = (height - width * 1.15) / 2 + row * block_h + block_h;
        let emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(1, 3), new Proton.Span(.05, .2));
        emitter.addInitialize(new Proton.Body(`images/${type}.png`, 2));
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Radius(1, 12));
        emitter.addInitialize(new Proton.Life(0, 2));
        emitter.addInitialize(new Proton.V(new Proton.Span(1, 1), new Proton.Span(-20, 20), 'polar'));
        emitter.addBehaviour(new Proton.RandomDrift(50, 50, 0.2));
        emitter.addBehaviour(new Proton.Alpha(1, 0.1));
        emitter.addBehaviour(new Proton.Scale(0.01, 0.7));
        emitter.p.x = x;
        emitter.p.y = y;
        emitter.emit();
        proton.addEmitter(emitter);
        protonRenderer = new Proton.CanvasRenderer(canvas);
        proton.addRenderer(protonRenderer);
        setTimeout(function () {
            proton.removeEmitter(emitter);
        }, 1000);
    }
}
function tick() {
    requestAnimationFrame(tick);
    proton.update();
}