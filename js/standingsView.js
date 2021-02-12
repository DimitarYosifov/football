import SeasonFixtures from "./SeasonFixtures.js";
import { generateResult } from "./generateResult.js";

export function standingsView(newLeague, round) {
    let currentRound = round || 1;
    let teams = []; // TODO !!!!!!!!  take clubs from DB here!!!!!!!!

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

        console.log(newLeague);
        console.log(this.stage);




        //testing!!!
        // let teams = [
        //     {
        //         name: "Barcelona",
        //         won: 33,
        //         ties: 13,
        //         lost: 13,
        //         goalsFor: 63,
        //         goalsAgainst: 13,
        //         goalsDifference: "+73",
        //         points: 50
        //     },
        //     {
        //         name: "Levski",
        //         won: 33,
        //         ties: 13,
        //         lost: 13,
        //         goalsFor: 63,
        //         goalsAgainst: 13,
        //         goalsDifference: "+53",
        //         points: 50
        //     },
        //     {
        //         name: "Dunav",
        //         won: 33,
        //         ties: 13,
        //         lost: 13,
        //         goalsFor: 63,
        //         goalsAgainst: 13,
        //         goalsDifference: "+63",
        //         points: 133
        //     }
        // ]

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

        teams.sort(comparingFunction);

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

        teams.forEach((club, i) => {
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

    let createFixtures = () => {
        this.allClubNames = this.allClubs.map(club => club.name);
        if (newLeague) {
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
                teams.push(team);
            })
            //TODO record this in player;s table !!!!!!!!!! + selected club by the player!!!
            //TODO display results before game
            this.seasonFixtures = new SeasonFixtures(this.allClubNames).seasonFixtures;
            console.log(this.seasonFixtures);
        } else {
            //TODO get standings from DB...! important !!!!!
        }

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
            let fixturesContainer = new PIXI.Container;
            let playerClub = this.playerClubData.name;
            this.seasonFixtures[currentRound].forEach((game, i) => {
                let firstClub = game.split(":")[0];
                let secondClub = game.split(":")[1];

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

                if (firstClub !== playerClub && secondClub !== playerClub) {
                    let textResult = createText(
                        randomResult(firstClub, secondClub, i),
                        text.x + text.width / 2 + logo2.width * 2,
                        y,
                        0,
                        false
                    );
                    textResult.style.fontSize = this.height / 25;
                    row.addChild(textResult);
                }

                fixturesContainer.addChild(row);
            })

            // TODO !!!!!! here record this in the DB !!!!!!!!!!!!!!!!!!

            fixturesContainer.y = this.height / 4 - fixturesContainer.height / 2;
            this.stage.addChild(fixturesContainer);
            createStandings();
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
                this.opponentClubData
                this.startLevel();
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

            this.seasonFixtures[currentRound][i] += ` ${result}`;

            let first = teams.find(t => t.name === firstClub);
            first.won += +result.split(':')[0] > +result.split(':')[1] ? 1 : 0;
            first.ties += +result.split(':')[0] === +result.split(':')[1] ? 1 : 0;
            first.lost += +result.split(':')[0] < +result.split(':')[1] ? 1 : 0;
            first.goalsFor += +result.split(':')[0];
            first.goalsAgainst += +result.split(':')[1];
            first.goalsDifference = first.goalsFor - first.goalsAgainst;
            first.points = first.won * 3 + first.ties;

            let second = teams.find(t => t.name === secondClub);
            second.won += +result.split(':')[0] < +result.split(':')[1] ? 1 : 0;
            second.ties += +result.split(':')[0] === +result.split(':')[1] ? 1 : 0;
            second.lost += +result.split(':')[0] > +result.split(':')[1] ? 1 : 0;
            second.goalsFor += +result.split(':')[1];
            second.goalsAgainst += +result.split(':')[0];
            second.goalsDifference = second.goalsFor - second.goalsAgainst;
            second.points = second.won * 3 + second.ties;

            return result;
        }

        displayFixtures();
        addButton();
    }

    createFixtures();
}
