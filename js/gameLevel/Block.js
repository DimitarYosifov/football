import Config from "../Config.js";
import Grid from "./Grid.js";

export default class Block extends PIXI.Container {
    constructor(row, col, rowContainer, grid, app) {
        super();
        this.config = Config;
        this.app = app;
        this.grid = grid;
        this.row = row;
        this.col = col;
        this.rowContainer = rowContainer;
        this.moveCoordinates = { startX: 0, startY: 0, lastX: 0, lastY: 0 }
        this.create();
    }

    create() {
        let figureMissing = true;
        // check if grid is predefined(debug purposes)
        if (!this.config.isGridInDebug) {
            while (figureMissing) {
                this.img = this.generateRandomColorBlock();
                figureMissing = this.createNonMatchingGrid(this.row, this.col, this.img);
            }
        } else {
            this.img = this.config.debugGrid[this.row][this.col];
        }

        let blockTexture = this.app.loader.resources.main1.textures[`${this.img}`];
        this.blockImg = new PIXI.Sprite(blockTexture);
        this.interactive = true;
        // this.buttonMode = true;
        this.blockImg.anchor.x = 0.5; //??????????????????
        this.blockImg.anchor.y = 0.5; //??????????????????
        this.blockImg.gridPosition_x = this.row;
        this.blockImg.gridPosition_y = this.col;
        this.type = this.img;

        let grid_h = this.app.height * 0.65;
        let grid_w = grid_h * 0.75;
        let block_w = grid_w / 6
        let block_h = grid_h / 8;
        let grid_y = block_h / 2 + (this.app.height - grid_h) / 2;
        let grid_x = block_h / 2 + ((this.app.width - grid_w) / 2);

        this.blockImg.x = grid_x + block_w * this.col;
        this.blockImg.y = grid_y + block_h * this.row;
        this.blockImg.width = block_h * 0.9;
        this.blockImg.height = block_h * 0.9;

        this.grid.globalBlocksPositions[this.row].push({
            x: this.blockImg.x,
            y: this.blockImg.y
        })

        this.blockImg.alpha = 0;;
        this.addChild(this.blockImg);    ///This not row container!!!!!

        let delay = this.row * 90 + this.col * 15 + this.config.fadeTimeBetweenPhases * 1000 + 1750;
        TweenMax.delayedCall(delay / 1000, () => {
            this.blockImg.alpha = 1;
            if (this.row === 7 && this.col === 5) {
                this.grid.newRound();
            }
        })


        setTimeout(() => {

        }, this.row * 90 + this.col * 15 + this.config.fadeTimeBetweenPhases * 1000 + 1750);

        this.on('pointerdown', this.onDragStart);
        this.on('pointerup', this.onDragEnd)
        // block.on('pointerupoutside', onDragEnd)
        this.on('pointermove', this.onDragMove)
    }

    generateRandomColorBlock() {
        if (this.config.predefinedBlockColor) { return this.config.predefinedBlockColor };
        let x = Math.floor(Math.random() * 100) + 1;
        let a;
        switch (true) {  //blocks - 17%       yellow card - 7%     red card- 4%      injury - 4%
            case x <= 17:
                a = "ball_blue";
                break;
            case (x > 17 && x <= 34):
                a = "ball_green";
                break;
            // case x > 28 && x <= 42:
            //     a = "ball_orange";
            //     break;
            case x > 34 && x <= 51:
                a = "ball_purple";
                break;
            case x > 51 && x <= 68:
                a = "ball_red";
                break;
            case x > 68 && x <= 85:
                a = "ball_yellow";
                break;
            case x > 85 && x <= 92:
                a = "yellow_card";
                break;
            case x > 92 && x <= 96:
                a = "red_card";
                break;
            case x > 96 && x <= 100:
                a = "red_cross";
                break;
            default:
                a = "error";
                break;
        }
        return a;
    }

    createNonMatchingGrid(_row, _col, img) {
        let checkLeft = () => {
            if (_col < 2) {
                return false;
            }
            let matches = 1;
            for (let col = 1; col < 3; col++) {
                if (img === this.rowContainer.children[_col - col].type) {
                    matches++;
                    if (matches === 3) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        };

        let checkUp = () => {
            if (_row < 2) {
                return false;
            }
            let matches = 1;
            for (let row = 1; row < 3; row++) {
                if (img === this.grid.children[_row - row].children[_col].type) {
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

    onDragStart = (e) => {
        e.gridPosition_x = this.col;
        e.gridPosition_y = this.row;
        this.grid.onDragStart(e);
    }

    onDragMove = (e) => {
        this.grid.onDragMove(e);
    }

    onDragEnd = (e) => {
        this.grid.onDragEnd(e);
    }
}