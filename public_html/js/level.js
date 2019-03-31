let level = {
    gridContainer: null,
    playerCardsContainer: null,
    opponentCardsContainer: null,
    animationInProgress: false,
    setLevelBackground: function () {
        stage.gamePhase = "level";
        let background = PIXI.Texture.fromImage('images/pitch.png');
        let bg = new PIXI.Sprite(background);
        bg.position.x = 0;
        bg.position.y = 0;
        bg.width = width;
        bg.height = height;
        stage.addChild(bg);
    },
    generateRandomBlock: function () {
        let x = Math.floor(Math.random() * 100) + 1;
        let a;
        switch (true) {
            case x <= 14:
                a = "ball_blue";
                break;
            case (x > 14 && x <= 28):
                a = "ball_green";
                break;
            case x > 28 && x <= 42:
                a = "ball_orange";
                break;
            case x > 42 && x <= 56:
                a = "ball_purple";
                break;
            case x > 56 && x <= 70:
                a = "ball_red";
                break;
            case x > 70 && x <= 84:
                a = "ball_yellow";
                break;
            case x > 84 && x <= 94:
                a = "yellow_card";
                break;
            case x > 94 && x <= 98:
                a = "red_card";
                break;
            case x > 98 && x <= 100:
                a = "red_cross";
                break;
            default :
                a = "error";
                break;
        }
        return a;
    },
    chechNeighborForMatches: function (_row, _col, img, rowContainer, gridContainer) {
        checkLeft = function () {
            if (_col < 2) {
                return false;
            }
            let matches = 1;
            for (let col = 1; col < 3; col++) {
                if (img === rowContainer.children[_col - col].type) {
                    matches++;
                    if (matches === 3) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        };
        checkUp = function () {
            if (_row < 2) {
                return false;
            }
            let matches = 1;
            for (let row = 1; row < 3; row++) {
                if (img === gridContainer.children[_row - row].children[_col].type) {
                    matches++;
                    if (matches === 3) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        };
        return   checkUp() || checkLeft();
    },
    moveCoordinates: {
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    },
    createPlayers: function () {
        _this = this;                                    ///???
        this.playerCardsContainer = new PIXI.Container();
        this.playerCardsContainer.name = "playerCardsContainer";
        this.playerCardsContainer.interactive = false;
        let playerCardsContainer_w = width * 0.5;
        let playerCardsContainer_h = height * 0.1;    //???????????? hardcoded, to  be calculated!!!!!
//        let playerCardsContainer.width = 100;    
//        let playerCardsContainer.height= 100;   
//        let block_w = grid_w / 6
//        let block_h = grid_h / 8;
        let playerCardsContainer_y = 200;
        let playerCardsContainer_x = 100;
        for (let i = 0; i < 6; i++) {
            let cardTexture = PIXI.Texture.fromImage(`images/players/player_id_001.png`);
            let card = new PIXI.Sprite(cardTexture);
            card.interactive = false;
            card.buttonMode = false;
//            card.anchor.x = 0.5; //??????????????????
//            card.anchor.y = 0.5; //??????????????????


            card.x =(width / 6) * i;
            card.y = height * 0.88;
            card.width =width / 6;
            card.height = height * 0.12;
            this.playerCardsContainer.addChild(card);
        }
        stage.addChild(this.playerCardsContainer)
        console.log(this.playerCardsContainer);
    },

    createLevelGrid: function () {
        _this = this;
        this.gridContainer = new PIXI.Container();
        this.gridContainer.name = "gridContainer";
        this.gridContainer.interactive = true;
        console.log(this.moveCoordinates.startX);
        this.gridContainer.on('pointerdown', function (e) {
            _this.moveCoordinates.startX = e.data.global.x;
            _this.moveCoordinates.startY = e.data.global.y;
            _this.moveCoordinates.lastX = e.data.global.x;
            _this.moveCoordinates.lastY = e.data.global.y;
        });
        this.gridContainer.on('pointermove', function (e) {
            _this.moveCoordinates.lastX = e.data.global.x;
            _this.moveCoordinates.lastY = e.data.global.y;
        });
        this.gridContainer.on('pointerup', function (e) {
            //TODO
        });
        let grid_w = width * 0.9;
        let grid_h = width * 1.15;
        let block_w = grid_w / 6
        let block_h = grid_h / 8;
        let grid_y = (height - width * 1.15) / 2 + block_h / 2;
        let grid_x = width * 0.05 + block_w / 2;
        //---to be deleted---------------------------------------------------------------------------------------//
        let gridWrapper = new PIXI.Graphics();
        gridWrapper.lineStyle(1, 0x000000);
        gridWrapper.drawRect(width * 0.05, (height - width * 1.15) / 2, width * 0.9, width * 1.15);
        //-------------------------------------------------------------------------------------------------------//
        for (let row = 0; row < 8; row++) {
            let rowContainer = new PIXI.Container();
            for (let col = 0; col < 6; col++) {
                let figureMissing = true;
                let img;
                while (figureMissing) {
                    img = this.generateRandomBlock();
                    figureMissing = this.chechNeighborForMatches(row, col, img, rowContainer, this.gridContainer);
                }
                let blockTexture = PIXI.Texture.fromImage(`images/${img}.png`);
                let block = new PIXI.Sprite(blockTexture);
                block.interactive = true;
                block.buttonMode = true;
                block.anchor.x = 0.5; //??????????????????
                block.anchor.y = 0.5; //??????????????????
                block.on('pointerdown', this.onDragStart);
                block.on('pointerup', this.onDragEnd)
//                        .on('pointerupoutside', onDragEnd)
                block.on('pointermove', this.onDragMove);
                block.gridPosition = {
                    x: row,
                    y: col
                };
                block.type = img;
                block.x = grid_x + block_w * col;
                block.y = grid_y + block_h * row;
                block.width = block_h * 0.9;
                block.height = block_h * 0.9;
                rowContainer.addChild(block);
            }
            this.gridContainer.addChild(rowContainer);
        }
//        this.gridContainer.addChild(gridWrapper);                          // to be deleted!
        stage.addChild(this.gridContainer);
    },
    onDragStart: function (e) {
        this.data = e.data;
        this.dragging = true;
    },
    onDragMove: function (e) {
        if (this.dragging && !level.animationInProgress) {
            let directions = {
                left: level.moveCoordinates.startX - level.moveCoordinates.lastX,
                right: level.moveCoordinates.lastX - level.moveCoordinates.startX,
                up: level.moveCoordinates.startY - level.moveCoordinates.lastY,
                down: level.moveCoordinates.lastY - level.moveCoordinates.startY
            };
            let arr = Object.values(directions);
            let max = Math.max(...arr);
            let dir = Object.keys(directions).find(key => directions[key] === max);
            if (
                    (level.moveCoordinates.startY === level.moveCoordinates.lastY && level.moveCoordinates.startX === level.moveCoordinates.lastX) ||
                    (dir === "down" && this.gridPosition.x === 7) ||
                    (dir === "up" && this.gridPosition.x === 0) ||
                    (dir === "right" && this.gridPosition.y === 5) ||
                    (dir === "left" && this.gridPosition.y === 0)
                    ) {
                return;
            }
            level.animationInProgress = true;
            level.swapBlocks(this.gridPosition, dir);
        }
    },
    onDragEnd: function (e) {
        this.dragging = false;
    },
    swapBlocks: function (block1, dir) {
        let item1 = this.gridContainer.children[block1.x].children[block1.y];
        let item2;
        switch (dir) {
            case "down":
                item2 = this.gridContainer.children[block1.x + 1].children[block1.y];
                break;
            case "up":
                item2 = this.gridContainer.children[block1.x - 1].children[block1.y];
                break;
            case "left":
                item2 = this.gridContainer.children[block1.x].children[block1.y - 1];
                break;
            case "right":
                item2 = this.gridContainer.children[block1.x].children[block1.y + 1];
                break;
            default:
                break;
        }

//        var canvas;
//        var context;
//        var proton;
//        var renderer;
//        var emitter;
//        var stats;
//
//        Main();
//
//        function Main() {
//            initCanvas();
//            addStats();
//            createProton();
//            tick();
//            moveEmitter();
//        }
//
//        function initCanvas() {
//            canvas = document.getElementById("rrr");
//            canvas.width = window.innerWidth;
//            canvas.height = window.innerHeight;
//            context = canvas.getContext('2d');
//            context.globalCompositeOperation = "lighter";
//        }
//
//        function addStats() {
//            stats = new Stats();
//            stats.setMode(2);
//            stats.domElement.style.position = 'absolute';
//            stats.domElement.style.left = '0px';
//            stats.domElement.style.top = '0px';
//            document.body.appendChild(stats.domElement);
//        }
//
//        function createProton(image) {
//            proton = new Proton;
//            emitter = new Proton.Emitter();
//            emitter.rate = new Proton.Rate(new Proton.Span(10, 20), new Proton.Span(.05, .2));
//
//            emitter.addInitialize(new Proton.Body('images/ball_red.png', 2));
//            emitter.addInitialize(new Proton.Mass(1));
//            emitter.addInitialize(new Proton.Radius(1, 12));
//            emitter.addInitialize(new Proton.Life(1, 3));
//            emitter.addInitialize(new Proton.V(new Proton.Span(1, 3), new Proton.Span(-20, 20), 'polar'));
//            emitter.addBehaviour(new Proton.RandomDrift(11, 21, .05));
//            emitter.addBehaviour(new Proton.Alpha(1, 0.1));
//
//            emitter.addBehaviour(new Proton.Scale(0.01, 0.06));
//            emitter.p.x = canvas.width / 2;
//            emitter.p.y = canvas.height / 2;
//            emitter.emit();
//            proton.addEmitter(emitter);
//
//            renderer = new Proton.CanvasRenderer(canvas);
//            proton.addRenderer(renderer);
//        }
//
//        function moveEmitter() {
////            TweenLite.to(emitter.p, 1, {
////                x:0.1,//, Math.random() * window.innerWidth,
////                delay: 0,
////                onComplete: moveEmitter
////            });
//        }
//
//        function tick() {
//            requestAnimationFrame(tick);
//
//            stats.begin();
////            emitter.rotation += 0.5;
//            proton.update();
//            stats.end();
//        }






        TweenMax.to(item1, 0.2, {y: item2.y, x: item2.x, scaleX: 22, scaleY: 3, repeat: 0, yoyo: true, ease: Linear.easeNone});
        TweenMax.to(item2, 0.2, {y: item1.y, x: item1.x, repeat: 0, yoyo: true, ease: Linear.easeNone});
    }
};