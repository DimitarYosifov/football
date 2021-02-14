import SeasonFixtures from "./SeasonFixtures.js";
import { generateResult } from "./generateResult.js";

export function standingsView(data, increaseRound = false, lastGameRersult = null, generateResults = false) {

    this.fixturesHeader;
    let fixturesContainer = new PIXI.Container;
    this.stage.alpha = 1;
    let getClubData = () => {
        $.ajax({
            url: "getAllClubsData",
            type: 'POST',
            contentType: 'application/json',
            success: (res) => {
                this.allClubs = res.clubs;
                this.allClubNames = this.allClubs.map(club => club.name);
                if (!this.seasonFixtures) {
                    this.teams = [];
                    this.allClubNames.forEach((club, clubIdx) => {
                        let team = {};
                        team.name = club;
                        team.won = 0;
                        team.ties = 0;
                        team.lost = 0;
                        team.goalsFor = 0;
                        team.goalsAgainst = 0;
                        team.goalsDifference = "0";
                        team.points = 0;
                        this.teams.push(team);
                    })
                    this.currentRound = 1;
                    this.seasonFixtures = new SeasonFixtures(this.allClubNames).seasonFixtures;
                }
                createFixtures();
            }, error: (err) => {
                console.log(err);
            }
        });
    }

    if (data && typeof data !== "boolean") {
        this.seasonFixtures = data.seasonFixtures;
        this.playerClubData = data.playerClubData;
        this.teams = data.teams;
        this.currentRound = data.currentRound;
    }

    increaseRound ? this.currentRound++ : null;

    getClubData();

    let createText = (_text, x, y, anchorX = 0.5, isPlayerClub) => {
        let text = new PIXI.Text(_text, {
            fontFamily: this.config.mainFont,
            fontSize: this.height / 50,
            fill: isPlayerClub ? "#6ddd48" : '#dbb7b7',
            align: 'center',
            // stroke: '#dbb7b7',
            strokeThickness: 0
        });
        text.position.set(x, y);
        text.anchor.set(anchorX, 0);
        return text;
    }

    let createStandings = () => {
        let standingsContainer = new PIXI.Container;
        let positionsX = {
            name: this.width * 0.05,
            won: this.width * 0.32,
            ties: this.width * 0.4,
            lost: this.width * 0.49,
            goalsFor: this.width * 0.61,
            goalsAgainst: this.width * 0.7,
            goalsDifference: this.width * 0.80,
            points: this.width * 0.9
        }
        let headersPositionsX = {
            club: this.width * 0.05,
            W: this.width * 0.32,
            T: this.width * 0.4,
            L: this.width * 0.49,
            GF: this.width * 0.61,
            GA: this.width * 0.7,
            GD: this.width * 0.80,
            P: this.width * 0.9
        }

        let separatorsPositionsX = {
            club: 0.05,
            W: this.width * 0.28,
            T: this.width * 0.36,
            L: this.width * 0.445,
            GF: this.width * 0.565,
            GA: this.width * 0.655,
            GD: this.width * 0.75,
            P: this.width * 0.85
        }

        let createSeparator = (x, y, width, height) => {
            let separator = new PIXI.Graphics();
            separator.lineStyle(1, 0xdbb7b7, 1);
            separator.drawRect(x, y, width, height);
            return separator;
        }

        const comparingFunction = (club1, club2) => {
            if (club1.points < club2.points) {
                return 1;
            }
            if (club1.points > club2.points) {
                return -1;
            }

            if (club1.points == club2.points) {
                if (club1.goalsDifference < club2.goalsDifference) {
                    return 1;
                }
                if (club1.goalsDifference > club2.goalsDifference) {
                    return -1;
                }
                return 0;
            }
        };

        this.teams.sort(comparingFunction);

        let createHeaders = () => {
            let row = new PIXI.Container;
            let y = 0;
            row.addChild(createText("#", this.width * 0.02, y)); //this is position of the club 
            Object.keys(headersPositionsX).forEach((prop, index) => {
                let isName = prop === "club";
                let anchorX = isName ? 0 : 0.5;
                row.addChild(createText(prop, headersPositionsX[prop], y, anchorX));
            });
            standingsContainer.addChild(row);
        }
        createHeaders();

        this.teams.forEach((club, i) => {
            let row = new PIXI.Container;
            let y = standingsContainer.height;
            row.addChild(createText(i + 1, this.width * 0.02, y, null, club.name === this.playerClubData.name)); //this is position of the club 
            Object.keys(club).forEach((prop, index) => {
                let isName = prop === "name";
                let anchorX = isName ? 0 : 0.5;
                row.addChild(createText(club[prop], positionsX[prop], y, anchorX, club.name === this.playerClubData.name));
            });
            standingsContainer.addChild(row);
            standingsContainer.addChild(createSeparator(
                this.width * 0.02,
                y + row.height,
                row.width,
                this.height * 0.00001
            ));
        });

        standingsContainer.y = this.height / 2 - standingsContainer.height / 2;

        // Object.keys(headersPositionsX).forEach((prop, index) => {
        //     let separator = createSeparator(
        //         separatorsPositionsX[prop],
        //         0,
        //         this.width * 0.00001,
        //         standingsContainer.height
        //     )
        //     standingsContainer.addChild(separator);
        // });

        this.stage.addChild(standingsContainer);
    }

    let recordFixtures = (currentRound) => {
        console.log(this);
        $.ajax({
            url: "fixtures",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                seasonFixtures: this.seasonFixtures,
                user: this.user,
                currentRound: currentRound,
                playerClubData: this.playerClubData,
                teams: this.teams
            }),
            success: (res) => {
                console.log(res);
            }
        });
    }

    let createFixtures = () => {

        let addLogo = (clubName, x, y, height, anchorX, anchorY) => {
            let logo = this.allClubs.filter(club => club.name === clubName)[0].clubData.logo;
            let logoTexture = this.loader.resources.logos.textures[`${logo}`];
            let clubLogo = new PIXI.Sprite(logoTexture);
            clubLogo.x = x;
            clubLogo.y = y;
            clubLogo.height = height;
            clubLogo.scale.x = clubLogo.scale.y;
            clubLogo.anchor.set(anchorX, anchorY);
            return clubLogo;
        }

        let displayFixtures = () => {

            //Header
            let _y = this.height * 0.1;
            this.fixturesHeader = createText(
                `Round ${this.currentRound}. Today's games:`,
                this.width / 2,
                _y,
                0.5,
                false
            );
            this.fixturesHeader.style.fontSize = this.height / 30;
            this.stage.addChild(this.fixturesHeader);

            let playerClub = this.playerClubData.name;
            this.seasonFixtures[this.currentRound].forEach((game, i) => {
                let splitGame = game.split(' ')[0];
                let firstClub = splitGame.split(":")[0];
                let secondClub = splitGame.split(":")[1];

                if (firstClub === playerClub) {
                    this.opponentClubData = this.allClubs.find(c => c.name === secondClub).clubData;
                    this.isPlayerHome = true;
                } else if (secondClub === playerClub) {
                    this.opponentClubData = this.allClubs.find(c => c.name === firstClub).clubData;
                    this.isPlayerHome = false;
                }

                let row = new PIXI.Container;
                let y = fixturesContainer.height;
                let text = createText(
                    game,
                    this.width / 2,
                    y,
                    0.5,
                    false
                );
                text.style.fontSize = this.height / 30;
                row.addChild(text);
                let logo1 = addLogo(firstClub, text.x - text.width / 2, text.y, text.height * 1.25, 1, 0)
                row.addChild(logo1);
                let logo2 = addLogo(secondClub, text.x + text.width / 2, text.y, text.height, 0, 0)
                row.addChild(logo2);

                // let generateResult = !text.text.split(" ")[1];
                let generateResult = generateResults;
                let textResult;

                if (firstClub !== playerClub && secondClub !== playerClub) {
                    textResult = createText(
                        generateResult ? randomResult(firstClub, secondClub, i) : "",
                        text.x + text.width / 2 + logo2.width * 2,
                        text.y,
                        0.5,
                        false
                    );
                    textResult.style.fontSize = this.height / 30;
                    row.addChild(textResult);
                } else {
                    textResult = createText(
                        lastGameRersult ? lastGameRersult : "",
                        text.x + text.width / 2 + logo2.width * 2,
                        text.y,
                        0.5,
                        false
                    );
                    // text.text += textResult.text;
                    this.seasonFixtures[this.currentRound][i] += ` ${textResult.text}`;

                    if (generateResults) {
                        calculatePoints(firstClub, secondClub, textResult.text)
                    }

                    textResult.style.fontSize = this.height / 30;
                    row.addChild(textResult);
                }
                fixturesContainer.addChild(row);
            })

            recordFixtures(this.currentRound);

            fixturesContainer.y = this.height / 4 - fixturesContainer.height / 2;
            this.stage.addChild(fixturesContainer);
            createStandings();
        }

        let deleteProgress = () => {
            console.log(this);
            $.ajax({
                url: "deleteProgress",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    user: this.user
                }),
                success: (res) => {
                    console.log(res);
                    console.log("progress deleted successfully");
                }, error: (er) => {
                    console.log(er);
                    console.log("ERRor");
                }
            });
        }

        let addButton = () => {
            const btnTexture = this.loader.resources.buttons.textures[`btn1`];
            let continueBtn = new PIXI.Sprite(btnTexture);
            continueBtn.height = this.height * 0.1;
            continueBtn.scale.x = continueBtn.scale.y;
            continueBtn.x = this.width / 2;
            continueBtn.y = this.height * 0.8;
            continueBtn.anchor.set(0.5);
            continueBtn.interactive = true;
            continueBtn.interactive = true;
            continueBtn.on('pointerdown', () => {
                if (!this.seasonFixtures[this.currentRound + 1]) {
                    // season has ended . TODO - congrat player.... and delete progress from DB
                    deleteProgress();
                    alert("You have reached the end of the season.Thank you for playing :)");
                    location.reload();
                }
                else if (lastGameRersult || this.seasonFixtures[this.currentRound][0].split(" ")[1]) {
                    this.currentRound++;
                    increaseRound = false;
                    lastGameRersult = null;
                    generateResults = false;
                    this.stage.removeChild(this.fixturesHeader);
                    fixturesContainer.removeChildren();
                    createFixtures();
                }
                else {
                    this.stage.removeChildren();
                    this.startLevel();
                }
            });

            this.stage.addChild(continueBtn);

            let continueBtnLabel = new PIXI.Text(`Continue`, {
                fontFamily: this.config.mainFont,
                fontSize: continueBtn.height / 2.5,
                fill: '#ffffff',
                align: 'center',
                stroke: '#000000',
                fontWeight: 800,
                lineJoin: "bevel",
                strokeThickness: 6
            });
            continueBtnLabel.position.set(
                continueBtn.x,
                continueBtn.y
            );
            continueBtnLabel.anchor.set(0.5, 0.5);
            this.stage.addChild(continueBtnLabel);
        }

        let randomResult = (firstClub, secondClub, i) => {

            let result = generateResult(
                this.allClubs.find(club => club.name === firstClub).clubData.power,
                this.allClubs.find(club => club.name === secondClub).clubData.power
            );

            this.seasonFixtures[this.currentRound][i] += ` ${result}`;
            calculatePoints(firstClub, secondClub, result);
            return result;
        }

        let calculatePoints = (firstClub, secondClub, result) => {
            let first = this.teams.find(t => t.name === firstClub);
            first.won += +result.split(':')[0] > +result.split(':')[1] ? 1 : 0;
            first.ties += +result.split(':')[0] === +result.split(':')[1] ? 1 : 0;
            first.lost += +result.split(':')[0] < +result.split(':')[1] ? 1 : 0;
            first.goalsFor += +result.split(':')[0];
            first.goalsAgainst += +result.split(':')[1];
            first.goalsDifference = first.goalsFor - first.goalsAgainst;
            first.points = first.won * 3 + first.ties;

            let second = this.teams.find(t => t.name === secondClub);
            second.won += +result.split(':')[0] < +result.split(':')[1] ? 1 : 0;
            second.ties += +result.split(':')[0] === +result.split(':')[1] ? 1 : 0;
            second.lost += +result.split(':')[0] > +result.split(':')[1] ? 1 : 0;
            second.goalsFor += +result.split(':')[1];
            second.goalsAgainst += +result.split(':')[0];
            second.goalsDifference = second.goalsFor - second.goalsAgainst;
            second.points = second.won * 3 + second.ties;
        }

        displayFixtures();
        addButton();
    }
}
