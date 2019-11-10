import lineUps from "./matchStartLineUps.js";

export default class Level {

    constructor(app) {
        this.lineUps = new lineUps();
        this.stage = app.stage;
        this.width = app.width;
        this.height = app.height;
        this.gridContainer = null;
        this.playerCardsContainer = null;
        this.opponentCardsContainer = null;
        this.animationInProgress = false;
        this.playerTurn = true;

        this.moveCoordinates = {
            startX: 0,
            startY: 0,
            lastX: 0,
            lastY: 0
        }

        this.setLevelBackground();
        this.createLevelGrid();
        this.createPlayerCards();
        this.createOpponentCards();
        this.checkGridForMatches();
    }

    setLevelBackground() {
        this.stage.gamePhase = "level";
        let background = PIXI.Texture.fromImage('images/pitch.png');
        let bg = new PIXI.Sprite(background);
        bg.position.x = 0;
        bg.position.y = 0;
        bg.width = this.width;
        bg.height = this.height;
        this.stage.addChild(bg);
    }

    generateRandomBlock() {
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
    }

    createNonMatchingGrid(_row, _col, img, rowContainer, gridContainer) {
        let checkLeft = function () {
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


        let checkUp = function () {
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
    }

    createPlayerCards() {
        this.playerCardsContainer = new PIXI.Container();
        this.playerCardsContainer.name = "playerCardsContainer";
        this.playerCardsContainer.interactive = false;
        let playerCardsContainer_w = this.width * 0.5;
        let playerCardsContainer_h = this.height * 0.1; //???????????? hardcoded, to  be calculated!!!!!
        for (let i = 0; i < 6; i++) {
            let container = new PIXI.Container();
            container.index = i;

            //stats            
            container.stats = this.lineUps.player[i];

            //card background
            let cardTexture = PIXI.Texture.fromImage(`images/players/player_id_${this.lineUps.player[i].player_img_id}.png`);
            let card = new PIXI.Sprite(cardTexture);
            card.interactive = false;
            card.buttonMode = false;
            card.x = (this.width / 6) * i;
            card.y = this.height * 0.88;
            card.width = this.width / 6;
            card.height = this.height * 0.12;
            //card.tint = '0x2F7F07';

            //attack section
            let shoeTexture = PIXI.Texture.fromImage(`images/shoe.png`);
            let shoe = new PIXI.Sprite(shoeTexture);
            shoe.interactive = false;
            shoe.buttonMode = false;
            shoe.x = (this.width / 5.95) * i;
            shoe.y = this.height * 0.885;
            shoe.width = this.width / 21;
            shoe.height = this.width / 21;
            shoe.tint = '0x' + container.stats.attack_color;
            let attackValuesText = new PIXI.Text(container.stats.attack_current + '/' + container.stats.attack_full, {
                fontSize: this.height / 75 + 'px',
                fill: '#' + container.stats.attack_color, align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 4
            }
            );
            attackValuesText.position.set((this.width / 6.05) * i + this.width / 6, this.height * 0.885);
            attackValuesText.anchor.x = 1;

            //defense section
            let gloveTexture = PIXI.Texture.fromImage(`images/glove2.png`);
            let glove = new PIXI.Sprite(gloveTexture);
            glove.interactive = false;
            glove.buttonMode = false;
            glove.x = (this.width / 5.95) * i;
            glove.y = this.height * 0.965;
            glove.width = this.width / 21;
            glove.height = this.width / 21// height * 0.03;
            glove.tint = '0x' + container.stats.defense_color;
            let defenseValuesText = new PIXI.Text(container.stats.defense_current + '/' + container.stats.defense_full, {
                fontSize: this.height / 75 + 'px',
                fill: '#' + container.stats.defense_color, align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 4
            });
            defenseValuesText.position.set((this.width / 6.05) * i + this.width / 5.95, this.height * 0.97);
            defenseValuesText.anchor.x = 1;

            //border
            let border = new PIXI.Graphics();
            border.lineStyle(3, 0xd0c639, 1);
            border.drawRect((this.width / 6) * i, this.height * 0.88, this.width / 6, this.height * 0.118); //0.120 not 0.118 ???

            //add children
            container.addChild(card);
            container.addChild(attackValuesText);
            container.addChild(defenseValuesText);
            container.addChild(shoe);
            container.addChild(glove);
            container.addChild(border);
            this.playerCardsContainer.addChild(container);
        }
        this.stage.addChild(this.playerCardsContainer)
    }


    createOpponentCards() {
        this.opponentCardsContainer = new PIXI.Container();
        this.opponentCardsContainer.name = "opponentCardsContainer";
        this.opponentCardsContainer.interactive = false;
        let opponentCardsContainer_w = this.width * 0.5;
        let opponentCardsContainer_h = this.height * 0.1; //???????????? hardcoded, to  be calculated!!!!!
        for (let i = 0; i < 6; i++) {
            let container = new PIXI.Container();
            container.index = i;

            //stats            
            container.stats = container.stats = this.lineUps.opponent[i];

            //card background
            let cardTexture = PIXI.Texture.fromImage(`images/players/player_id_${this.lineUps.opponent[i].opponent_img_id}.png`);
            let card = new PIXI.Sprite(cardTexture);
            card.interactive = false;
            card.buttonMode = false;
            card.x = (this.width / 6) * i;
            card.y = 0;
            card.width = this.width / 6;
            card.height = this.height * 0.12;
            //card.tint = '0x2F7F07';


            //attack section
            let shoeTexture = PIXI.Texture.fromImage(`images/shoe.png`);
            let shoe = new PIXI.Sprite(shoeTexture);
            shoe.interactive = false;
            shoe.buttonMode = false;
            shoe.x = (this.width / 5.95) * i;
            shoe.y = this.height * 0.005;
            shoe.width = this.width / 21;
            shoe.height = this.width / 21;
            shoe.tint = '0x' + container.stats.attack_color;
            let attackValuesText = new PIXI.Text(container.stats.attack_current + '/' + container.stats.attack_full, {
                fontSize: this.height / 75 + 'px',
                fill: '#' + container.stats.attack_color, align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 4
            }
            );
            attackValuesText.position.set((this.width / 6) * i + this.width / 6.1, this.height * 0.005);
            attackValuesText.anchor.x = 1;

            //defense section
            let gloveTexture = PIXI.Texture.fromImage(`images/glove2.png`);
            let glove = new PIXI.Sprite(gloveTexture);
            glove.interactive = false;
            glove.buttonMode = false;
            glove.x = (this.width / 5.95) * i;
            glove.y = this.height * 0.09;
            glove.width = this.width / 21;
            glove.height = this.width / 21;
            glove.tint = '0x' + container.stats.defense_color;
            let defenseValuesText = new PIXI.Text(container.stats.defense_current + '/' + container.stats.defense_full, {
                fontSize: this.height / 75 + 'px',
                fill: '#' + container.stats.defense_color, align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 4
            });
            defenseValuesText.position.set((this.width / 6) * i + this.width / 6.1, this.height * 0.095);
            defenseValuesText.anchor.x = 1;

            //border
            let border = new PIXI.Graphics();
            border.lineStyle(3, 0xd0c639, 1);
            border.drawRect((this.width / 6) * i, this.height * 0, this.width / 6, this.height * 0.122); //0.120 not 0.118 ???

            //add children
            container.addChild(card);
            container.addChild(attackValuesText);
            container.addChild(defenseValuesText);
            container.addChild(shoe);
            container.addChild(glove);
            container.addChild(border);
            this.opponentCardsContainer.addChild(container);
        }
        this.stage.addChild(this.opponentCardsContainer)
    }


    checkGridForMatches() {
        let matches = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 6; col++) {

                let thisBlock = this.gridContainer.children[row].children[col].type;
                let previousBlock_right = this.gridContainer.children[row].children[col - 1] ? this.gridContainer.children[row].children[col - 1].type : null;
                let previousBlock_down = this.gridContainer.children[row - 1] ? this.gridContainer.children[row - 1].children[col].type : null;

//              PREVENTS ERROR WHEN MATCHING MORE THAN 3 BLOCKS ...
                if (thisBlock === previousBlock_right || thisBlock === previousBlock_down) {
                    continue;
                }

                let match = {
                    row: row,
                    col: col,
                    matchesRightward: 1,
                    matchesDownward: 1,
                    type: this.gridContainer.children[row].children[col].type
                };

//              check right
                for (let x = col; x < 6 - 1; x++) {
                    let thisBlock = this.gridContainer.children[row].children[x].type;
                    let nextBlock_right = this.gridContainer.children[row].children[x + 1].type;
                    if (thisBlock === nextBlock_right) {
                        match.matchesRightward++;
                    } else {
                        break;
                    }
                }

//              check down
                for (let y = row; y < 8 - 1; y++) {
                    let thisBlock = this.gridContainer.children[y].children[col].type;
                    let nextBlock_down = this.gridContainer.children[y + 1].children[col].type;
                    if (thisBlock === nextBlock_down) {
                        match.matchesDownward++;
                    } else {
                        break;
                    }
                }

                if (match.matchesRightward >= 3 || match.matchesDownward >= 3) {
                    matches.push(match);
                }
            }
        }
        return matches;
    }


    createLevelGrid() {
        let _this = this;
        this.gridContainer = new PIXI.Container();
        this.gridContainer.name = "gridContainer";
        this.gridContainer.interactive = true;
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
        let grid_w = this.width * 0.9;
        let grid_h = this.width * 1.15;
        let block_w = grid_w / 6
        let block_h = grid_h / 8;
        let grid_y = (this.height - this.width * 1.15) / 2 + block_h / 2;
        let grid_x = this.width * 0.05 + block_w / 2;
        //---to be deleted---------------------------------------------------------------------------------------//
        let gridWrapper = new PIXI.Graphics();
        gridWrapper.lineStyle(1, 0x000000);
        gridWrapper.drawRect(this.width * 0.05, (this.height - this.width * 1.15) / 2, this.width * 0.9, this.width * 1.15);
        //-------------------------------------------------------------------------------------------------------//
        for (let row = 0; row < 8; row++) {
            let rowContainer = new PIXI.Container();
            for (let col = 0; col < 6; col++) {
                let figureMissing = true;
                let img;
                while (figureMissing) {
                    img = this.generateRandomBlock();
                    figureMissing = this.createNonMatchingGrid(row, col, img, rowContainer, this.gridContainer);
                }
                let blockTexture = PIXI.Texture.fromImage(`images/${img}.png`);
                let block = new PIXI.Sprite(blockTexture);
                block.interactive = true;
                block.buttonMode = true;
                block.anchor.x = 0.5; //??????????????????
                block.anchor.y = 0.5; //??????????????????
                
                block.on('pointerdown', this.onDragStart);
                block.on('pointerup', this.onDragEnd)
//  TODO        block.on('pointerupoutside', onDragEnd)
                block.on('pointermove', this.onDragMove)

                block.gridPosition_x = row;
                block.gridPosition_y = col;
                
                block.type = img;
                block.x = grid_x + block_w * col;
                block.y = grid_y + block_h * row;
                block.width = block_h * 0.9;
                block.height = block_h * 0.9;
                rowContainer.addChild(block);
            }
            this.gridContainer.addChild(rowContainer);
        }
        this.stage.addChild(this.gridContainer);
    }


    onDragStart = (e) => {
        this.gridPosition_x = e.currentTarget.gridPosition_x;
        this.gridPosition_y = e.currentTarget.gridPosition_y;
        this.data = e.data;
        this.dragging = true;
    }


    onDragMove = (e) => {
        if (this.dragging && !this.animationInProgress) {
            let directions = {
                left: this.moveCoordinates.startX - this.moveCoordinates.lastX,
                right: this.moveCoordinates.lastX - this.moveCoordinates.startX,
                up: this.moveCoordinates.startY - this.moveCoordinates.lastY,
                down: this.moveCoordinates.lastY - this.moveCoordinates.startY
            };
            let arr = Object.values(directions);
            let max = Math.max(...arr);
            let dir = Object.keys(directions).find(key => directions[key] === max);
            if (
                    (this.moveCoordinates.startY === this.moveCoordinates.lastY && this.moveCoordinates.startX === this.moveCoordinates.lastX) ||
                    (dir === "down" && this.gridPosition_x === 7) ||
                    (dir === "up" && this.gridPosition_x === 0) ||
                    (dir === "right" && this.gridPosition_y === 5) ||
                    (dir === "left" && this.gridPosition_y === 0)
                    ) {
                return;
            }
            this.animationInProgress = true;
            this.swapBlocks(this.gridPosition_x, this.gridPosition_y, dir);
        }
    }


    onDragEnd(e) {
        this.dragging = false;
    }


    swapBlocks(block1_x, block1_y, dir) {
        let item1 = this.gridContainer.children[block1_x].children[block1_y];
        let item2;
        switch (dir) {
            case "down":
                item2 = this.gridContainer.children[block1_x + 1].children[block1_y];
                break;
            case "up":
                item2 = this.gridContainer.children[block1_x - 1].children[block1_y];
                break;
            case "left":
                item2 = this.gridContainer.children[block1_x].children[block1_y - 1];
                break;
            case "right":
                item2 = this.gridContainer.children[block1_x].children[block1_y + 1];
            default:
                break;
        }
        TweenMax.to(item1, 0.2, {y: item2.y, x: item2.x, scaleX: 22, scaleY: 3, repeat: 0, yoyo: true, ease: Linear.easeNone, onComplete: function () {
                let type1 = item1.type;
                let gridPosition1 = item1.gridPosition;
                item1.type = item2.type;
                item1.gridPosition = item2.gridPosition;
                item2.type = type1;
                item2.gridPosition = gridPosition1;

//                START OF PROTON EFFECT AFTER MATCH
//                let matches = level.checkGridForMatches();
//                if (matches.length !== 0) {
//                    Main(matches);
//                }
            }});
        TweenMax.to(item2, 0.2, {y: item1.y, x: item1.x, repeat: 0, yoyo: true, ease: Linear.easeNone});
    }
}