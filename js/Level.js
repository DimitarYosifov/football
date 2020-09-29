import LineUps from "./LineUps.js";
import Card from "./gameLevel/Card.js";
import Background from "./Background.js";
import Config from "./Config.js";
import LevelCardsSet from "./gameLevel/LevelCardsSet.js";

export default class Level extends PIXI.Container {

    constructor(app) {

        super();

        this.app = app;
        this.config = Config;
        this.gridArrays = [];
        this.globalBlocksPositions = [[], [], [], [], [], [], [], []]

        this.stage = app.stage;
        this.stage.alpha = 0;
        this.proton = app.proton;
        this.width = app.width; // / this.config.rendererResolution;
        this.height = app.height;//  / this.config.rendererResolution;
        this.gridContainer = null;
        this.playerCardsContainer = null;
        this.opponentCardsContainer = null;
        this.animationInProgress = false;
        this.playerTurn = true; //should be rondom or host's

        this.moveCoordinates = { startX: 0, startY: 0, lastX: 0, lastY: 0 }

        this.bg = new Background(this.app, {
            gamePhase: "level",
            bgTexture: 'images/pitch.png',
            bg_x: -this.app.width * 0.005,
            bg_y: -this.app.height * 0.005,
            bg_width: this.app.width * 1.005,
            bg_height: this.app.height * 1.005
        });
        this.stage.addChild(this.bg);

        this.dataRecieved = () => {
            this.createLevelGrid();
            this.checkGridForMatches();
            TweenMax.delayedCall(1, () => {
                TweenMax.to(this.stage, this.config.fadeTimeBetweenPhases, { alpha: 1 });
            })
        }

        this.playerCards = new LevelCardsSet(this.dataRecieved, this.app.width, this.app.height, "player");
        this.stage.addChild(this.playerCards);

        this.opponentCards = new LevelCardsSet(() => { }, this.app.width, this.app.height, "opponent");
        this.stage.addChild(this.opponentCards);
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
            default:
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
        return checkUp() || checkLeft();
    }

    checkGridForMatches() {
        let matches = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 6; col++) {

                let match = {
                    row: row,
                    col: col,
                    type: this.gridContainer.children[row].children[col].type
                };

                //              check right
                let thisBlock = this.gridContainer.children[row].children[col].type;
                let nextBlock_right1 = this.gridContainer.children[row].children[col + 1] ? this.gridContainer.children[row].children[col + 1].type : null;
                let nextBlock_right2 = this.gridContainer.children[row].children[col + 2] ? this.gridContainer.children[row].children[col + 2].type : null;
                let prevBlock_left1 = this.gridContainer.children[row].children[col - 1] ? this.gridContainer.children[row].children[col - 1].type : null;
                let prevBlock_left2 = this.gridContainer.children[row].children[col - 2] ? this.gridContainer.children[row].children[col - 2].type : null;

                if ((thisBlock === nextBlock_right1 && thisBlock === nextBlock_right2) ||
                    (thisBlock === prevBlock_left1 && thisBlock === prevBlock_left2) ||
                    (thisBlock === nextBlock_right1 && thisBlock === prevBlock_left1)
                ) {
                    matches.push(match);
                    continue; // already match, no need to check downwards
                }

                //              check down
                let nextBlock_down1 = null
                if (this.gridContainer.children[row + 1]) {
                    nextBlock_down1 = this.gridContainer.children[row + 1].children[col] ? this.gridContainer.children[row + 1].children[col].type : null;
                }

                let nextBlock_down2 = null;
                if (this.gridContainer.children[row + 2]) {
                    nextBlock_down2 = this.gridContainer.children[row + 2].children[col] ? this.gridContainer.children[row + 2].children[col].type : null;
                }

                let prevBlock_Up1 = null;
                if (this.gridContainer.children[row - 1]) {
                    prevBlock_Up1 = this.gridContainer.children[row - 1].children[col] ? this.gridContainer.children[row - 1].children[col].type : null;
                }
                let prevBlock_Up2 = null;
                if (this.gridContainer.children[row - 2]) {
                    prevBlock_Up2 = this.gridContainer.children[row - 2].children[col] ? this.gridContainer.children[row - 2].children[col].type : null;
                }

                if ((thisBlock === prevBlock_Up1 && thisBlock === prevBlock_Up2) ||
                    (thisBlock === nextBlock_down1 && thisBlock === nextBlock_down2) ||
                    (thisBlock === nextBlock_down1 && thisBlock === prevBlock_Up1)
                ) {
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
        let grid_h = this.app.height * 0.65;
        let grid_w = grid_h * 0.75;
        let block_w = grid_w / 6
        let block_h = grid_h / 8;
        let grid_y = block_h / 2 + (this.app.height - grid_h) / 2; // this.height * 0.15// (this.height - this.width * 1.15) / 2 + block_h / 2;
        let grid_x = block_h / 2 + ((this.app.width - grid_w) / 2); // this.width * 0.05 + block_w / 2;
        //---to be deleted---------------------------------------------------------------------------------------//
        // let gridWrapper = new PIXI.Graphics();
        // gridWrapper.lineStyle(1, 0x000000);
        // gridWrapper.drawRect(this.width * 0.05, (this.height - this.width * 1.15) / 2, this.width * 0.9, this.width * 1.15);
        //-------------------------------------------------------------------------------------------------------//

        let visibilityDelay = 0;

        for (let row = 0; row < 8; row++) {
            let rowContainer = new PIXI.Container();
            for (let col = 0; col < 6; col++) {
                let figureMissing = true;
                let img;

                // check if grid is predefined(debug purposes)
                if (!this.config.isGridInDebug) {
                    while (figureMissing) {
                        img = this.generateRandomBlock();
                        figureMissing = this.createNonMatchingGrid(row, col, img, rowContainer, this.gridContainer);
                    }
                } else {
                    img = this.config.debugGrid[row][col];
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

                this.globalBlocksPositions[row].push({
                    x: block.x,
                    y: block.y
                })

                block.alpha = 0;;
                rowContainer.addChild(block);

                setTimeout(() => {
                    block.alpha = 1;
                }, visibilityDelay + this.config.fadeTimeBetweenPhases * 1000 + 1000);

                visibilityDelay += 15;
            }
            this.gridContainer.addChild(rowContainer);
            this.gridArrays.push(rowContainer.children.map(c => c.type));
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
            /*   
             gets block height and divides it by 3,
             the least drag/swipe distance
             to start blocks swap.
             ...needs better solution here!!!
             */
            let dist = this.gridContainer.children[0].children[0].height / 3;

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
                (dir === "left" && this.gridPosition_y === 0) ||
                max < dist) {
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
        this.swapDirection = dir;
        this.blockBeingSwappedWith = null;
        let item1 = this.gridContainer.children[block1_x].children[block1_y];
        this.selectedBlock = { row: block1_x, col: block1_y, type: item1.type };
        let item2;
        switch (dir) {
            case "down":
                item2 = this.gridContainer.children[block1_x + 1].children[block1_y];
                this.blockBeingSwappedWith = { row: block1_x + 1, col: block1_y, type: item2.type };
                break;
            case "up":
                item2 = this.gridContainer.children[block1_x - 1].children[block1_y];
                this.blockBeingSwappedWith = { row: block1_x - 1, col: block1_y, type: item2.type };
                break;
            case "left":
                item2 = this.gridContainer.children[block1_x].children[block1_y - 1];
                this.blockBeingSwappedWith = { row: block1_x, col: block1_y - 1, type: item2.type };
                break;
            case "right":
                item2 = this.gridContainer.children[block1_x].children[block1_y + 1];
                this.blockBeingSwappedWith = { row: block1_x, col: block1_y + 1, type: item2.type };
            default:
                break;
        }

        TweenMax.to(item1, 0.2, {
            y: item2.y,
            x: item2.x,
            ease: Linear.easeNone,
            onComplete: () => {

            }
        });
        //        TweenMax.to(item1.scale, 0.2, {x: 1.01, y: 1.01, repeat: 1, yoyo: true});    //works
        TweenMax.to(item2, 0.2, {
            y: item1.y,
            x: item1.x,
            ease: Linear.easeNone,
            onComplete: () => {
                let type1 = item1.type;
                let gridPosition1 = item1.gridPosition;
                item1.type = item2.type;
                item1.gridPosition = item2.gridPosition;
                item2.type = type1;
                item2.gridPosition = gridPosition1;
                //              START OF PROTON EFFECT AFTER MATCH
                let matches = this.checkGridForMatches();

                if (matches.length !== 0) {
                    for (let m = 0; m < matches.length; m++) {
                        if (matches[m].row === item2.gridPosition_x && matches[m].col === item2.gridPosition_y) {
                            matches[m].beingSwapped = true;
                            this.matchingSwappedItem = 1;
                        } else if (((matches[m].row === item1.gridPosition_x) && (matches[m].col === item1.gridPosition_y))) {
                            matches[m].beingSwapped = true;
                            this.matchingSwappedItem = 2;
                        }
                        else {
                            matches[m].dir = this.swapDirection;
                        }
                    }

                    let item_2_Old_X = this.globalBlocksPositions[this.selectedBlock.row][this.selectedBlock.col].x;
                    let item_2_Old_Y = this.globalBlocksPositions[this.selectedBlock.row][this.selectedBlock.col].y;
                    let item_2_OldType = this.gridContainer.children[this.selectedBlock.row].children[this.selectedBlock.col].type;

                    item2.x = this.globalBlocksPositions[this.blockBeingSwappedWith.row][this.blockBeingSwappedWith.col].x;
                    item2.y = this.globalBlocksPositions[this.blockBeingSwappedWith.row][this.blockBeingSwappedWith.col].y;
                    item2.type = this.gridContainer.children[this.blockBeingSwappedWith.row].children[this.blockBeingSwappedWith.col].type;
                    item2.texture = PIXI.Texture.fromImage(`images/${item2.type}.png`);

                    item1.x = item_2_Old_X;
                    item1.y = item_2_Old_Y;
                    item1.type = item_2_OldType;
                    item1.texture = PIXI.Texture.fromImage(`images/${item1.type}.png`);

                    this.gatherMatchingBlocks(matches);
                    TweenMax.delayedCall(1, () => {
                        this.increaseCardsPointsAfterMatch(matches);
                    })
                }
            }
        });
    }

    //animate matching blocks to currently moved block position
    gatherMatchingBlocks(matches) {

        this.nullifyMatchesInGridArray(matches);
        let beingSwapped = matches.filter(e => e.beingSwapped);
        for (let m = 0; m < beingSwapped.length; m++) {

            let thisColorMatches = matches.filter(e => e.type === beingSwapped[m].type);

            for (let e = 0; e < thisColorMatches.length; e++) {
                let targetBlock = thisColorMatches.filter(x => x.beingSwapped)[0];
                let tweenTarget = this.gridContainer.children[thisColorMatches[e].row].children[thisColorMatches[e].col];

                if (!thisColorMatches[e].beingSwapped) {
                    let newX = this.globalBlocksPositions[targetBlock.row][targetBlock.col].x;
                    let newY = this.globalBlocksPositions[targetBlock.row][targetBlock.col].y;
                    TweenMax.to(tweenTarget, .25, {
                        x: newX,
                        y: newY,
                        alpha: 0,
                        ease: Linear.easeNone,
                        onComplete: () => {
                            // TweenMax.killAll();
                            // this.increaseCardsPointsAfterMatch(matches);
                        }
                    });
                }
                else {
                    TweenMax.to(tweenTarget, .4, {
                        alpha: 0,
                        delay: .25,
                        onComplete: () => {
                            // TweenMax.killAll();
                            // this.increaseCardsPointsAfterMatch(matches);
                        }
                    });
                }
            }
        }
    }

    nullifyMatchesInGridArray(matches) {
        for (const item of matches) {
            this.gridArrays[item.row][item.col] = null;
        }
        console.log(this.gridArrays)
    }

    increaseCardsPointsAfterMatch(matches) {

        let colors = {
            'FF1D00': "ball_red",     // RED:
            '3052FF': "ball_blue",    // BLUE:
            '2F7F07': "ball_green",   // GREEN:
            'E2D841': "ball_yellow",  // YELLOW:
            'FF9702': "ball_orange",  // ORANGE
            'B200FF': "ball_purple"   // PURPLE:
        }

        if (this.playerTurn) {
            console.log(this.playerCardsContainer);
            for (let cardIdx = 0; cardIdx < this.playerCardsContainer.children.length; cardIdx++) {

                let card = this.playerCardsContainer.children[cardIdx];
                let defenceColor = colors[card.stats.defense_color];
                let attackColor = colors[card.stats.attack_color];
                let def_points = matches.filter(e => e.type === defenceColor).length;
                let atk_points = matches.filter(e => e.type === attackColor).length;

                let cardImg = card.children[0]

                let initialScaleX = cardImg.scale.x;
                let initialScaley = cardImg.scale.y;

                if (def_points > 0) {
                    // // let matchPoint = new MatchPoint(card, matches)
                    // // console.log(matchPoint)
                    card.stats.defense_current += def_points;
                    card.getChildByName("defenseValuesText").text = `${card.stats.defense_current}/${card.stats.defense_full}`;
                    cardImg.tint = "0x" + card.stats.defense_color;
                    TweenMax.to(cardImg, .15, {
                        delay: .7,
                        onComplete: () => {
                            cardImg.tint = 16777215
                        }
                    });

                    TweenMax.to(cardImg.scale, .15, {
                        x: initialScaleX * 1.05,
                        y: initialScaley * 1.05,
                        yoyo: true,
                        repeat: 1
                    })




                    //TODO  create separate class for this and add some delay between text tweens
                    let def_text = new PIXI.Text("+" + def_points, {
                        fontFamily: this.config.mainFont,
                        fontSize: cardImg.height / 2,
                        fill: '#' + card.stats.defense_color,
                        align: 'center',
                        stroke: '#000000',
                        strokeThickness: 3
                    });
                    def_text.position.set(cardImg.x + cardImg.width / 2, cardImg.y + cardImg.height / 2);
                    def_text.anchor.x = 0.5;
                    def_text.anchor.y = 0.5;

                    this.stage.addChild(def_text);// TODO add picture to +3 for example!!!

                    TweenMax.to(def_text, 1.5, {
                        y: this.height / 2,
                        // alpha: 0.75,
                        ease: Linear.easeNone,  //TODO... change ease
                        onComplete: () => {
                            def_text.alpha = 0;
                        }
                    })
                }

                // if (atk_points > 0) {
                //     card.stats.attack_current += atk_points;
                //     card.getChildByName("attackValuesText").text = `${card.stats.attack_current}/${card.stats.attack_full}`;
                //     cardImg.tint = "0x" + card.stats.attack_color;
                //     TweenMax.to(cardImg, .15, {
                //         delay: .7,
                //         onComplete: () => {
                //             cardImg.tint = 16777215
                //         }
                //     });
                //     TweenMax.to(cardImg.scale, .15, {
                //         x: initialScaleX * 1.05,
                //         y: initialScaley * 1.05,
                //         yoyo: true,
                //         repeat: 1
                //     })
                // }
                // //TODO... => add opponent points same as player in the function above
                // //TODO... => add yellow card, red card ana injury.....
                // //TODO... => check for full attack or defence
                // //TODO... => add sort of animations to show card gained points...
                // //TODO... => check if card wins with two colors
            }
        }
    }
}