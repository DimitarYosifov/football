import SeasonFixtures from "./SeasonFixtures.js";
import { generateResult } from "./generateResult.js";
import EditTeam from "./EditTeam.js";

export function standingsView(data, increaseRound = false, lastGameRersult = null, generateResults = false) {
    this.data = data;
    this.fixturesHeader;
    let fixturesContainer = new PIXI.Container;
    this.stage.alpha = 0;

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

    this.checkContinueAllowed = () => {
        const continueDisabled = this.playerLineUp
            .slice(0, 6)
            .find(el => el.leagueRedCards || el.leagueYellowCards === 5 || el.injured > 0);
        if (continueDisabled) {
            this.continueBtn.interactive = false;
            this.continueBtn.alpha = 0.4;
        } else {
            this.continueBtn.interactive = true;
            this.continueBtn.alpha = 1;
        }
    }
    
    setTimeout(() => {
        const loadingWrapper = document.getElementById("loading-wrapper");
        if (loadingWrapper) { loadingWrapper.remove() };
        TweenMax.to(this.stage, 0.5, { alpha: 1 });
    }, 1000);
    let getClubsData = () => {
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

    let addButton = () => {
        const btnTexture = this.loader.resources.buttons.textures[`btn1`];
        this.continueBtn = new PIXI.Sprite(btnTexture);
        this.continueBtn.height = this.height * 0.1;
        this.continueBtn.scale.x = this.continueBtn.scale.y;
        this.continueBtn.x = this.width / 2;
        this.continueBtn.y = this.height * 0.7;
        this.continueBtn.anchor.set(0.5);
        this.continueBtn.interactive = true;
        this.continueBtn.interactive = true;
        this.continueBtn.on('pointerdown', () => {
            if (
                !this.seasonFixtures[this.currentRound + 1] &&
                lastGameRersult &&
                typeof this.data === "boolean"
            ) {
                /*
                    ONE HELL OF A TODO - HANDLE END OF SEASON IN A NORMAL SENSE VISUALLY 
                    instead of an alert !!!!!!!!!!!!
                */
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

        this.stage.addChild(this.continueBtn);

        let continueBtnLabel = new PIXI.Text(`Continue`, {
            fontFamily: this.config.mainFont,
            fontSize: this.continueBtn.height / 2.5,
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',
            fontWeight: 200,
            lineJoin: "bevel",
            strokeThickness: 2
        });
        continueBtnLabel.position.set(
            this.continueBtn.x,
            this.continueBtn.y
        );
        continueBtnLabel.anchor.set(0.5, 0.5);
        this.stage.addChild(continueBtnLabel);

        //EDIT TEAM BTN
        const editBtnTexture = this.loader.resources.buttons.textures[`btn1`];
        let editTeamBtn = new PIXI.Sprite(editBtnTexture);
        editTeamBtn.height = this.height * 0.06;
        editTeamBtn.scale.x = editTeamBtn.scale.y;
        editTeamBtn.x = this.width * 0.7;
        editTeamBtn.y = this.height * 0.9;
        editTeamBtn.anchor.set(0.5);
        editTeamBtn.interactive = true;
        editTeamBtn.interactive = true;
        editTeamBtn.on('pointerdown', () => {
            new EditTeam(this);
        });

        this.stage.addChild(editTeamBtn);

        let editBtnLabel = new PIXI.Text(`edit team`, {
            fontFamily: this.config.mainFont,
            fontSize: editTeamBtn.height / 2.5,
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',
            fontWeight: 200,
            lineJoin: "bevel",
            strokeThickness: 2
        });
        editBtnLabel.position.set(
            editTeamBtn.x,
            editTeamBtn.y
        );
        editBtnLabel.anchor.set(0.5, 0.5);
        this.stage.addChild(editBtnLabel);
    }

    $.ajax({
        url: "getPlayerLineUp",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(
            {
                user: localStorage.getItem('user')
            }
        ),
        success: (res) => {
            this.playerLineUp = res.players;
            console.log(this.playerLineUp);
            addButton();
            this.checkContinueAllowed();
        }, error: (err) => {
            alert("err")
        }
    });
    getClubsData();

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
        //this.app.allClubsData
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

                let generateResult = generateResults;
                let result;

                if (firstClub !== playerClub && secondClub !== playerClub) {
                    if (generateResult) {
                        result = randomResult(firstClub, secondClub, i);
                    } else {
                        result = this.seasonFixtures[this.currentRound][i].split(" ")[1];
                    }
                } else {
                    if (lastGameRersult) {
                        result = lastGameRersult;
                        //this is dirty hack here to remove undefined...
                        this.seasonFixtures[this.currentRound][i] = this.seasonFixtures[this.currentRound][i].split(" ")[0];
                        this.seasonFixtures[this.currentRound][i] += ` ${result}`;
                    } else {
                        result = this.seasonFixtures[this.currentRound][i].split(" ")[1];
                    }
                    if (generateResults) {
                        calculatePoints(firstClub, secondClub, result)
                    }
                }

                let team1 = game.split(" ")[0].split(":")[0];
                let team2 = game.split(" ")[0].split(":")[1];

                //result text
                let _resultText = createText(
                    result,
                    this.width / 2,
                    y,
                    0.5,
                    false
                );
                _resultText.style.fontSize = this.height / 30;
                row.addChild(_resultText);

                let logo1 = addLogo(firstClub, _resultText.x - _resultText.width, _resultText.y, _resultText.height * 1.25, 1, 0)
                row.addChild(logo1);

                //first club
                let _team1 = createText(
                    `${team1} `,
                    logo1.x - logo1.width,
                    y,
                    1,
                    false
                );
                _team1.style.fontSize = this.height / 30;
                row.addChild(_team1);


                let logo2 = addLogo(secondClub, _resultText.x + _resultText.width, _resultText.y, _resultText.height * 1.25, 0, 0)
                row.addChild(logo2);

                //second club
                let _team2 = createText(
                    ` ${team2}`,
                    logo2.x + logo2.width,
                    y,
                    0,
                    false
                );
                _team2.style.fontSize = this.height / 30;
                row.addChild(_team2);
                fixturesContainer.addChild(row);
            })

            recordFixtures(this.currentRound);

            fixturesContainer.y = this.height / 4 - fixturesContainer.height / 2;
            this.stage.addChild(fixturesContainer);
            createStandings();
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
            first.won += +result.split('-')[0] > +result.split('-')[1] ? 1 : 0;
            first.ties += +result.split('-')[0] === +result.split('-')[1] ? 1 : 0;
            first.lost += +result.split('-')[0] < +result.split('-')[1] ? 1 : 0;
            first.goalsFor += +result.split('-')[0];
            first.goalsAgainst += +result.split('-')[1];
            first.goalsDifference = first.goalsFor - first.goalsAgainst;
            first.points = first.won * 3 + first.ties;

            let second = this.teams.find(t => t.name === secondClub);
            second.won += +result.split('-')[0] < +result.split('-')[1] ? 1 : 0;
            second.ties += +result.split('-')[0] === +result.split('-')[1] ? 1 : 0;
            second.lost += +result.split('-')[0] > +result.split('-')[1] ? 1 : 0;
            second.goalsFor += +result.split('-')[1];
            second.goalsAgainst += +result.split('-')[0];
            second.goalsDifference = second.goalsFor - second.goalsAgainst;
            second.points = second.won * 3 + second.ties;
        }

        displayFixtures();
    }
}
