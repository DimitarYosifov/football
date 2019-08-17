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
    createNonMatchingGrid: function (_row, _col, img, rowContainer, gridContainer) {
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
    createPlayerCards: function () {
        _this = this; ///???
        this.playerCardsContainer = new PIXI.Container();
        this.playerCardsContainer.name = "playerCardsContainer";
        this.playerCardsContainer.interactive = false;
        let playerCardsContainer_w = width * 0.5;
        let playerCardsContainer_h = height * 0.1; //???????????? hardcoded, to  be calculated!!!!!
        for (let i = 0; i < 6; i++) {
            let container = new PIXI.Container();
            container.index = i;
//stats            
            container.stats = lineUps.player[i];
//card background
            let cardTexture = PIXI.Texture.fromImage(`images/players/player_id_${lineUps.player[i].player_img_id}.png`);
            let card = new PIXI.Sprite(cardTexture);
            card.interactive = false;
            card.buttonMode = false;
            card.x = (width / 6) * i;
            card.y = height * 0.88;
            card.width = width / 6;
            card.height = height * 0.12;
//             card.tint = '0x2F7F07';

//attack section
            let shoeTexture = PIXI.Texture.fromImage(`images/shoe.png`);
            let shoe = new PIXI.Sprite(shoeTexture);
            shoe.interactive = false;
            shoe.buttonMode = false;
            shoe.x = (width / 5.95) * i;
            shoe.y = height * 0.885;
            shoe.width = width / 21;
            shoe.height = width / 21// height * 0.03;
            shoe.tint = '0x' + container.stats.attack_color;
            let attackValuesText = new PIXI.Text(container.stats.attack_current + '/' + container.stats.attack_full, {
                fontSize: height / 75 + 'px',
                fill: '#' + container.stats.attack_color, align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 4
            }
            );
            attackValuesText.position.set((width / 6.05) * i + width / 6, height * 0.885);
            attackValuesText.anchor.x = 1;
//defense section
            let gloveTexture = PIXI.Texture.fromImage(`images/glove2.png`);
            let glove = new PIXI.Sprite(gloveTexture);
            glove.interactive = false;
            glove.buttonMode = false;
            glove.x = (width / 5.95) * i;
            glove.y = height * 0.965;
            glove.width = width / 21;
            glove.height = width / 21// height * 0.03;
            glove.tint = '0x' + container.stats.defense_color;
            let defenseValuesText = new PIXI.Text(container.stats.defense_current + '/' + container.stats.defense_full, {
                fontSize: height / 75 + 'px',
                fill: '#' + container.stats.defense_color, align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 4
            });
            defenseValuesText.position.set((width / 6.05) * i + width / 5.95, height * 0.97);
            defenseValuesText.anchor.x = 1;
//            console.log(glove);
//border
            let border = new PIXI.Graphics();
            border.lineStyle(3, 0xd0c639, 1);
            border.drawRect((width / 6) * i, height * 0.88, width / 6, height * 0.118); //0.120 not 0.118 ???
//            console.log(container);
//add children
            container.addChild(card);
            container.addChild(attackValuesText);
            container.addChild(defenseValuesText);
            container.addChild(shoe);
            container.addChild(glove);
            container.addChild(border);
            this.playerCardsContainer.addChild(container);
        }
        stage.addChild(this.playerCardsContainer)
//        console.log(this.playerCardsContainer);
    },
    createOpponentCards: function () {
        _this = this; ///???
        this.opponentCardsContainer = new PIXI.Container();
        this.opponentCardsContainer.name = "playerCardsContainer";
        this.opponentCardsContainer.interactive = false;
        let opponentCardsContainer_w = width * 0.5;
        let opponentCardsContainer_h = height * 0.1; //???????????? hardcoded, to  be calculated!!!!!
        for (let i = 0; i < 6; i++) {
            let container = new PIXI.Container();
            container.index = i;
//stats            
            container.stats = container.stats = lineUps.opponent[i];
//card background
            let cardTexture = PIXI.Texture.fromImage(`images/players/player_id_${lineUps.opponent[i].opponent_img_id}.png`);
            let card = new PIXI.Sprite(cardTexture);
            card.interactive = false;
            card.buttonMode = false;
            card.x = (width / 6) * i;
            card.y = 0;
            card.width = width / 6;
            card.height = height * 0.12;
//             card.tint = '0x2F7F07';

//attack section
            let shoeTexture = PIXI.Texture.fromImage(`images/shoe.png`);
            let shoe = new PIXI.Sprite(shoeTexture);
            shoe.interactive = false;
            shoe.buttonMode = false;
            shoe.x = (width / 5.95) * i;
            shoe.y = height * 0.005;
            shoe.width = width / 21;
            shoe.height = width / 21// height * 0.03;
            shoe.tint = '0x' + container.stats.attack_color;
            let attackValuesText = new PIXI.Text(container.stats.attack_current + '/' + container.stats.attack_full, {
                fontSize: height / 75 + 'px',
                fill: '#' + container.stats.attack_color, align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 4
            }
            );
            attackValuesText.position.set((width / 6) * i + width / 6.1, height * 0.005);
            attackValuesText.anchor.x = 1;
//defense section
            let gloveTexture = PIXI.Texture.fromImage(`images/glove2.png`);
            let glove = new PIXI.Sprite(gloveTexture);
            glove.interactive = false;
            glove.buttonMode = false;
            glove.x = (width / 5.95) * i;
            glove.y = height * 0.09;
            glove.width = width / 21;
            glove.height = width / 21// height * 0.03;
            glove.tint = '0x' + container.stats.defense_color;
            let defenseValuesText = new PIXI.Text(container.stats.defense_current + '/' + container.stats.defense_full, {
                fontSize: height / 75 + 'px',
                fill: '#' + container.stats.defense_color, align: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 4
            });
            defenseValuesText.position.set((width / 6) * i + width / 6.1, height * 0.095);
            defenseValuesText.anchor.x = 1;
//            console.log(glove);
//border
            let border = new PIXI.Graphics();
            border.lineStyle(3, 0xd0c639, 1);
            border.drawRect((width / 6) * i, height * 0, width / 6, height * 0.122); //0.120 not 0.118 ???
//            console.log(container);
//add children
            container.addChild(card);
            container.addChild(attackValuesText);
            container.addChild(defenseValuesText);
            container.addChild(shoe);
            container.addChild(glove);
            container.addChild(border);
            this.opponentCardsContainer.addChild(container);
        }
        stage.addChild(this.opponentCardsContainer)
//        console.log(this.opponentCardsContainer);
    },
    checkGridForMatches: function () {
        let matches = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 6; col++) {
                let match = {
                    row: row,
                    col: col,
                    matchesRightward: 1,
                    matchesDownward: 1,
                    type: this.gridContainer.children[row].children[col].type
                };
//              check right
                for (let x = col; x < 6 - 1; x++) {
                    if (this.gridContainer.children[row].children[x].type === this.gridContainer.children[row].children[x + 1].type) {
                        match.matchesRightward++;
                    } else {
                        break;
                    }
                }
//              check down
                for (let y = row; y < 8 - 1; y++) {
                    if (this.gridContainer.children[y].children[col].type === this.gridContainer.children[y + 1].children[col].type) {
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
    },
    createLevelGrid: function () {
        _this = this;
        this.gridContainer = new PIXI.Container();
        this.gridContainer.name = "gridContainer";
        this.gridContainer.interactive = true;
//        console.log(this.moveCoordinates.startX);
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
//                        .on('pointerupoutside', onDragEnd)
                block.on('pointermove', this.onDragMove);
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
                    (dir === "down" && this.gridPosition_x === 7) ||
                    (dir === "up" && this.gridPosition_x === 0) ||
                    (dir === "right" && this.gridPosition_y === 5) ||
                    (dir === "left" && this.gridPosition_y === 0)
                    ) {
                return;
            }
            level.animationInProgress = true;
            level.swapBlocks(this.gridPosition_x, this.gridPosition_y, dir);
        }
    },
    onDragEnd: function (e) {
        this.dragging = false;
    },
    swapBlocks: function (block1_x, block1_y, dir) {
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
                if (level.checkGridForMatches().length !== 0) {
                    Main(level.checkGridForMatches());
                }
            }});
        TweenMax.to(item2, 0.2, {y: item1.y, x: item1.x, repeat: 0, yoyo: true, ease: Linear.easeNone});
    }
};