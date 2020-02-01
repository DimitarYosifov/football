
export default class ProtonEffects {

    constructor() {
        this.canvas;
        this.context;
        this.proton = new Proton;
        this.protonRenderer;
    }

    Main(matches, w, h) {
        this.width = w;
        this.height = h;
        if (matches.length !== 0) {
            this.initCanvas();
            this.tick();
            this.createProton(matches);
        }
    }
    initCanvas() {
        this.canvas = document.getElementById("rrr");
        window.alert(window.innerWidth);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext('2d');
        this.context.globalCompositeOperation = "lighter";
    }
    createProton(matches) {
        let row = matches[0].row;
        let col = matches[0].col;

        let emit = (row, col, type) => {
            let grid_h = this.height * 0.65;
            let grid_w = grid_h * 0.75;
            let block_w = grid_w / 6;
            let block_h = grid_h / 8;

            let x = window.innerWidth / 2 - grid_h * 0.7 / 2 + col * block_w + block_w / 2;
            let y = window.innerHeight / 2 - grid_h / 2 + row * block_h + block_h / 2;

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
            this.proton.addEmitter(emitter);
            this.protonRenderer = new Proton.CanvasRenderer(this.canvas);
            this.proton.addRenderer(this.protonRenderer);
            setTimeout(() => {
                this.proton.removeEmitter(emitter);
            }, 1000);
        }

//  horizontal
        if (matches[0].matchesRightward > 1) {
            for (let i = 0; i < matches[0].matchesRightward; i++) {
                emit(row, col + i, matches[0].type);
            }
        }
//  vertical
        if (matches[0].matchesDownward > 1) {
            for (let i = 0; i < matches[0].matchesDownward; i++) {
                emit(row + i, col, matches[0].type);
            }
        }
    }
    tick() {
        requestAnimationFrame(this.tick.bind(this));
        this.proton.update();
    }

}