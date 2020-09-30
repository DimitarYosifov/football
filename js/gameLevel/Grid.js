import Config from "../Config.js";
import Block from "./Block.js";
import Row from "./Row.js";

export default class Grid extends PIXI.Container {
    constructor(app) {
        super();
        this.app = app;
        this.level = app.level;
        this.config = Config;
        this.moveCoordinates = { startX: 0, startY: 0, lastX: 0, lastY: 0 }
        this.interactive = true;
        this.gridArrays = [];
        this.globalBlocksPositions = [[], [], [], [], [], [], [], []];
        this.blocks = [[], [], [], [], [], [], [], []];

        this.createGrid();
    }

    createGrid() {
        for (let row = 0; row < 8; row++) {
            let rowContainer = new Row(this.app, row, this);

            this.addChild(rowContainer);
            this.gridArrays.push(rowContainer.children.map(c => c.type));    /// IMPORTANT
        }
    }

    swapBlocks(block1_x, block1_y, dir) {
        this.swapDirection = dir;
        this.blockBeingSwappedWith = null;
        let item1 = this.children[block1_x].children[block1_y];
        this.selectedBlock = { row: block1_x, col: block1_y, type: item1.type };
        let item2;
        switch (dir) {
            case "down":
                item2 = this.children[block1_x + 1].children[block1_y];
                this.blockBeingSwappedWith = { row: block1_x + 1, col: block1_y, type: item2.type };
                break;
            case "up":
                item2 = this.children[block1_x - 1].children[block1_y];
                this.blockBeingSwappedWith = { row: block1_x - 1, col: block1_y, type: item2.type };
                break;
            case "left":
                item2 = this.children[block1_x].children[block1_y - 1];
                this.blockBeingSwappedWith = { row: block1_x, col: block1_y - 1, type: item2.type };
                break;
            case "right":
                item2 = this.children[block1_x].children[block1_y + 1];
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
                    let item_2_OldType = this.children[this.selectedBlock.row].children[this.selectedBlock.col].type;

                    item2.x = this.globalBlocksPositions[this.blockBeingSwappedWith.row][this.blockBeingSwappedWith.col].x;
                    item2.y = this.globalBlocksPositions[this.blockBeingSwappedWith.row][this.blockBeingSwappedWith.col].y;
                    item2.type = this.children[this.blockBeingSwappedWith.row].children[this.blockBeingSwappedWith.col].type;
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

    checkGridForMatches() {
        let matches = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 6; col++) {

                let match = {
                    row: row,
                    col: col,
                    type: this.children[row].children[col].type
                };

                //              check right
                let thisBlock = this.children[row].children[col].type;
                let nextBlock_right1 = this.children[row].children[col + 1] ? this.children[row].children[col + 1].type : null;
                let nextBlock_right2 = this.children[row].children[col + 2] ? this.children[row].children[col + 2].type : null;
                let prevBlock_left1 = this.children[row].children[col - 1] ? this.children[row].children[col - 1].type : null;
                let prevBlock_left2 = this.children[row].children[col - 2] ? this.children[row].children[col - 2].type : null;

                if ((thisBlock === nextBlock_right1 && thisBlock === nextBlock_right2) ||
                    (thisBlock === prevBlock_left1 && thisBlock === prevBlock_left2) ||
                    (thisBlock === nextBlock_right1 && thisBlock === prevBlock_left1)
                ) {
                    matches.push(match);
                    continue; // already match, no need to check downwards
                }

                //              check down
                let nextBlock_down1 = null
                if (this.children[row + 1]) {
                    nextBlock_down1 = this.children[row + 1].children[col] ? this.children[row + 1].children[col].type : null;
                }

                let nextBlock_down2 = null;
                if (this.children[row + 2]) {
                    nextBlock_down2 = this.children[row + 2].children[col] ? this.children[row + 2].children[col].type : null;
                }

                let prevBlock_Up1 = null;
                if (this.children[row - 1]) {
                    prevBlock_Up1 = this.children[row - 1].children[col] ? this.children[row - 1].children[col].type : null;
                }
                let prevBlock_Up2 = null;
                if (this.children[row - 2]) {
                    prevBlock_Up2 = this.children[row - 2].children[col] ? this.children[row - 2].children[col].type : null;
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

    //animate matching blocks to currently moved block position
    gatherMatchingBlocks(matches) {

        this.nullifyMatchesInGridArray(matches);
        let beingSwapped = matches.filter(e => e.beingSwapped);
        for (let m = 0; m < beingSwapped.length; m++) {

            let thisColorMatches = matches.filter(e => e.type === beingSwapped[m].type);

            for (let e = 0; e < thisColorMatches.length; e++) {
                let targetBlock = thisColorMatches.filter(x => x.beingSwapped)[0];
                let tweenTarget = this.children[thisColorMatches[e].row].children[thisColorMatches[e].col];

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
        if (this.parent.playerTurn) {
            for (let cardIdx = 0; cardIdx < this.parent.playerCards.children.length; cardIdx++) {
                let card = this.parent.playerCards.children[cardIdx];
                setTimeout(() => {
                    card.increasePoints(matches);
                }, 75 * cardIdx);
            }
        }
        else {
            // TODO... same for opponent
        }
    }

    onDragStart = (e) => {
        this.moveCoordinates.startX = e.data.global.x;
        this.moveCoordinates.startY = e.data.global.y;
        this.moveCoordinates.lastX = e.data.global.x;
        this.moveCoordinates.lastY = e.data.global.y;

        this.gridPosition_x = e.gridPosition_x;
        this.gridPosition_y = e.gridPosition_y;
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

            this.moveCoordinates.lastX = e.data.global.x;
            this.moveCoordinates.lastY = e.data.global.y;

            let dist = this.blocks[0][0].height / 3;

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

}
