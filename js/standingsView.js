import SeasonFixtures from "./SeasonFixtures.js";
import { generateResult } from "./generateResult.js";
import EditTeam from "./EditTeam.js";
import TopScorers from "./TopScorers.js";
import { serverRequest } from "./Request.js"
import GameTexture from "./GameTexture.js";
import Background from "./Background.js";
import RotatingButton from "./RotatingButton.js";
import Particles from "./AddParticles.js";

export function standingsView(data, increaseRound = false, lastGameRersult = null, generateResults = false) {
    this.data = data;
    this.fixturesHeader;
    this.fixturesContainer = new PIXI.Container;
    this.stage.alpha = 0;
    this.lastRoundGoals = {};
    if (!this.topScorers && this.data) this.topScorers = this.data.topScorers;

    this.backgroundImg = new Background(this, {
        gamePhase: "standingsViews",
        sprite: new GameTexture(this, "bg33"),
        bg_x: -this.width * 0.005,
        bg_y: -this.height * 0.005,
        bg_width: this.width * 1.005,
        bg_height: this.height * 1.005
    });
    this.backgroundImg.alpha = 0.5;
    this.stage.addChild(this.backgroundImg);

    let deleteProgress = () => {
        serverRequest(
            "deleteProgress",
            'POST',
            'application/json',
            JSON.stringify(
                {
                    user: this.user
                }
            )
        ).then(res => {
            console.log(res);
            console.log("progress deleted successfully");
        })
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
        serverRequest(
            "getAllClubsData",
            'POST',
            'application/json'
        ).then(res => {
            this.allClubs = res.clubs;
            this.allClubNames = this.allClubs.map(club => club.name);
            if (!this.seasonFixtures) {
                this.teams = [];
                this.topScorers = {};
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
                    this.topScorers[club] = [0, 0, 0, 0, 0, 0];
                })
                this.currentRound = 1;
                this.seasonFixtures = new SeasonFixtures(this.allClubNames).seasonFixtures;
            }
            createFixtures();
        })
    }

    if (data && typeof data !== "boolean") {
        this.seasonFixtures = data.seasonFixtures;
        this.playerClubData = data.playerClubData;
        this.teams = data.teams;
        this.currentRound = data.currentRound;
    }

    // increaseRound ? this.currentRound++ : null;

    let addButtons = () => {
        //---CONTIONUE BUTTON
        let continueOnPointerDown = () => {
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
            else if (this.selectedRound === 1 && this.currentRound === 1) {//this is lame but works
                ballParticle();
                this.stage.removeChildren();
                this.startLevel();
            }
            else if (this.selectedRound !== this.currentRound || (this.selectedRound === 2 && this.currentRound === 1)) {
                increaseRound = false;
                lastGameRersult = null;
                generateResults = false;
                scrollToCurrentRound(0, this.selectedRound === this.currentRound);
            }
            else {
                ballParticle();
                this.stage.removeChildren();
                this.startLevel();
            }
        }

        this.continueBtn = new RotatingButton(this, null, null, continueOnPointerDown);
        this.stage.addChild(this.continueBtn);
        this.continueBtn.setButtonSize(this.height * 0.2, this.width / 2, this.height * 0.87);
        this.continueBtn.addLabel(`Continue`, 0.24);

        //-----EDIT TEAM BTN
        let editTeamOnPointerDown = () => {
            TweenMax.to(this.stage, 0.35, {
                alpha: 0, onComplete: () => {
                    new EditTeam(this);
                }
            });
        }

        this.editTeameBtn = new RotatingButton(this, null, null, editTeamOnPointerDown);
        this.stage.addChild(this.editTeameBtn);
        this.editTeameBtn.setButtonSize(this.height * 0.15, this.width * 0.84, this.height * 0.89);
        this.editTeameBtn.addLabel(`Edit\nTeam`, 0.24);

        //-----TOP SCORERS TEAM BTN
        let topScorersOnPointerDown = () => {
            TweenMax.to(this.stage, 0.35, {
                alpha: 0, onComplete: () => {
                    this.topScorersContainer = new TopScorers(this);
                    this.stage.addChild(this.topScorersContainer);
                }
            });
        }

        this.topScorerBtn = new RotatingButton(this, null, null, topScorersOnPointerDown);
        this.stage.addChild(this.topScorerBtn);
        this.topScorerBtn.setButtonSize(this.height * 0.15, this.width * 0.16, this.height * 0.89);
        this.topScorerBtn.addLabel(`Top\nScorers`, 0.24);
    }

    serverRequest(
        "getPlayerLineUp",
        'POST',
        'application/json',
        JSON.stringify(
            {
                user: localStorage.getItem('user')
            }
        )
    ).then(res => {
        this.playerLineUp = res.players;
        addButtons();
        this.checkContinueAllowed();
    })
    getClubsData();

    let createText = (_text, x, y, anchorX = 0.5, isPlayerClub) => {
        let text = new PIXI.Text(_text, {
            fontFamily: this.config.mainFont,
            fontSize: this.height / 50,
            fill: isPlayerClub ? "#6ddd48" : '#dbb7b7',
            align: 'center',
            // stroke: '#000000',
            // strokeThickness: 3
        });
        text.position.set(x, y);
        text.anchor.set(anchorX, 0);
        return text;
    }

    let createStandings = () => {
        let standingsContainer = new PIXI.Container;
        let positionsX = {
            name: this.width * 0.08,
            won: this.width * 0.35,
            ties: this.width * 0.43,
            lost: this.width * 0.52,
            goalsFor: this.width * 0.64,
            goalsAgainst: this.width * 0.73,
            goalsDifference: this.width * 0.83,
            points: this.width * 0.93
        }
        let headersPositionsX = {
            club: this.width * 0.08,
            W: this.width * 0.35,
            T: this.width * 0.43,
            L: this.width * 0.52,
            GF: this.width * 0.64,
            GA: this.width * 0.73,
            GD: this.width * 0.83,
            P: this.width * 0.93
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
            row.addChild(createText("#", this.width * 0.03, y)); //this is position of the club 
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

        standingsContainer.y = this.height * 0.65 - standingsContainer.height / 2;

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
        serverRequest(
            "fixtures",
            'POST',
            'application/json',
            JSON.stringify(
                {
                    seasonFixtures: this.seasonFixtures,
                    user: this.user,
                    currentRound: currentRound,
                    playerClubData: this.playerClubData,
                    teams: this.teams,
                    topScorers: this.topScorers
                }
            )
        ).then(res => {
            console.log(res);
        })
    }

    let addLogo = (clubName, x, y, height, anchorX, anchorY) => {
        let logo = this.allClubs.filter(club => club.name === clubName)[0].clubData.logo;
        let clubLogo = new GameTexture(this, `${logo}`).sprite;
        clubLogo.height = height;
        clubLogo.x = x;
        clubLogo.y = y;
        clubLogo.scale.x = clubLogo.scale.y;
        clubLogo.anchor.set(anchorX, anchorY);
        return clubLogo;
    }

    let scrollToCurrentRound = (delay, additionalScroll = 0) => {
        this.prev.interactive = false;
        this.next.interactive = false;
        this.prev.alpha = 0.35;
        this.prev.alpha = 0.35;
        this.selectedRound = this.currentRound;
        if (additionalScroll) this.selectedRound++;
        let x = this.width * (this.currentRound - 1 + additionalScroll) * -1;

        if (increaseRound) {
            x += this.width;
            delay = 0;
        }
        TweenMax.to(this.fixturesContainer, 0.75,
            {
                delay: delay,
                // ease: Back.easeIn,
                x: x,
                onStart: () => { },
                onComplete: () => {
                    if (this.selectedRound !== 1) {
                        this.prev.interactive = true;
                        this.prev.alpha = 1;
                    }
                    this.next.interactive = true;
                    this.next.alpha = 1;
                    this.prev.interactive = this.selectedRound !== 1;
                    this.next.interactive = this.selectedRound !== this.leagueRounds;
                }
            }
        );
    }

    let createFixtures = () => {
        let displayFixtures = () => {

            let playerClub = this.playerClubData.name;

            this.leagueRounds = Array.isArray(this.seasonFixtures) ? this.seasonFixtures.length - 1 : [null, ...Object.values(this.seasonFixtures)].length - 1;
            for (let round = 1; round <= this.leagueRounds; round++) {
                //Header
                let _y = this.height * 0.2;
                this.fixturesHeader = createText(
                    `Round ${round}`,
                    this.width / 2 + this.width * (round - 1),
                    0,
                    0.5,
                    false
                );
                this.fixturesHeader.style.fontSize = this.height / 30;
                this.fixturesContainer.addChild(this.fixturesHeader);


                this.seasonFixtures[round].forEach((game, i) => {
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
                    let y = this.height * 0.1 + this.height * 0.05 * i

                    let generateResult = generateResults;
                    let result;

                    if (firstClub !== playerClub && secondClub !== playerClub) {
                        if (generateResult && round === this.currentRound) {
                            result = randomResult(firstClub, secondClub, i);
                        } else {
                            result = this.seasonFixtures[round][i].split(" ")[1];
                        }
                    } else {
                        if (lastGameRersult && round === this.currentRound) {
                            result = lastGameRersult;
                            if (firstClub !== playerClub) {
                                this.lastRoundGoals[firstClub] = result.split("-")[0];
                            } else {
                                this.lastRoundGoals[firstClub] = result.split("-")[1];
                            }
                            //this is dirty hack here to remove undefined...
                            this.seasonFixtures[round][i] = this.seasonFixtures[round][i].split(" ")[0];
                            this.seasonFixtures[round][i] += ` ${result}`;
                        } else {
                            result = this.seasonFixtures[round][i].split(" ")[1];
                        }
                        if (generateResults && round === this.currentRound) {
                            calculatePoints(firstClub, secondClub, result)
                        }
                    }

                    let team1 = game.split(" ")[0].split(":")[0];
                    let team2 = game.split(" ")[0].split(":")[1];

                    //result text
                    let _resultText = createText(
                        result,
                        this.width / 2 + (this.width * (round - 1)),
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
                    this.fixturesContainer.addChild(row);
                })
            }

            if (increaseRound) {
                generateRoundScorers();
            }
            increaseRound ? this.currentRound++ : null;
            recordFixtures(this.currentRound);

            this.fixturesContainer.y = this.height * 0.33 - this.fixturesContainer.height / 2;
            this.stage.addChild(this.fixturesContainer);
            createStandings();
        }

        let randomResult = (firstClub, secondClub, i) => {
            let result = generateResult(
                this.allClubs.find(club => club.name === firstClub).clubData.power,
                this.allClubs.find(club => club.name === secondClub).clubData.power
            );
            this.lastRoundGoals[firstClub] = result.split("-")[0];
            this.lastRoundGoals[secondClub] = result.split("-")[1];

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
        addPagination();
        scrollToCurrentRound(1.2);
    }

    let getWidth = () => {
        return this.width;
    }

    let addPagination = () => {
        this.prev = new GameTexture(this, `prev`).sprite;
        this.prev.x = this.width * 0.02;
        this.prev.y = this.height * 0.18;
        this.prev.width = this.width * 0.075;
        this.prev.scale.y = this.prev.scale.x;
        this.prev.anchor.set(0, 0);
        this.stage.addChild(this.prev);
        this.prev.interactive = true;
        this.prev.alpha = this.currentRound === 1 ? 0.35 : 1;
        this.prev.on('pointerdown', () => {
            let x = this.fixturesContainer.x;
            this.selectedRound--;
            TweenMax.to(this.fixturesContainer, 0.5,
                {
                    x: x += this.width,
                    ease: Back.easeInOut,
                    onStart: () => {
                        this.prev.interactive = false;
                        this.next.interactive = false;
                        this.prev.alpha = 0.35;
                        this.next.alpha = 0.35;
                    },
                    onComplete: () => {
                        if (this.selectedRound !== 1) {
                            this.prev.interactive = true;
                            this.prev.alpha = 1;
                        }
                        this.next.interactive = true;
                        this.next.alpha = 1;
                    }
                }
            );
        })

        this.next = new GameTexture(this, `next`).sprite;
        this.next.x = this.width * 0.98;
        this.next.y = this.height * 0.18;
        this.next.width = this.width * 0.075;
        this.next.scale.y = this.next.scale.x;
        this.next.anchor.set(1, 0);
        this.stage.addChild(this.next);
        this.next.interactive = true;
        this.next.alpha = this.currentRound === this.leagueRounds ? 0.35 : 1;
        this.next.on('pointerdown', () => {
            let x = this.fixturesContainer.x;
            this.selectedRound++;
            TweenMax.to(this.fixturesContainer, 0.5,
                {
                    x: x -= this.width,
                    ease: Back.easeInOut,
                    onStart: () => {
                        this.prev.interactive = false;
                        this.next.interactive = false;
                        this.prev.alpha = 0.35;
                        this.next.alpha = 0.35;
                    },
                    onComplete: () => {
                        this.prev.interactive = true;
                        this.prev.alpha = 1;
                        if (this.selectedRound !== this.leagueRounds) {
                            this.next.interactive = true;
                            this.next.alpha = 1;
                        }
                    }
                }
            );
        })
    }

    let generateRoundScorers = () => {

        Object.keys(this.lastRoundGoals).forEach((team, index) => {
            for (let index = 0; index < this.lastRoundGoals[team]; index++) {
                let rnd = Math.floor(Math.random() * 100) + 1;
                let scorerIndex;
                if (rnd <= 5) {
                    scorerIndex = 0;
                }
                else if (rnd <= 15) {
                    scorerIndex = 1;
                }
                else if (rnd <= 25) {
                    scorerIndex = 2;
                }
                else if (rnd <= 45) {
                    scorerIndex = 3;
                }
                else if (rnd <= 65) {
                    scorerIndex = 4;
                }
                else {
                    scorerIndex = 5;
                }
                this.topScorers[team][scorerIndex]++;
            }
        })
    }

    let ballParticle = ((action) => {
        let ballParticleConfig = {
            "alpha": {
                "start": 1,
                "end": 0.6
            },
            "scale": {
                "start": 0.035,
                "end": 0.035
            },
            "color": {
                "start": "#6c6c6c",
                "end": "#ababab"
            },
            "speed": {
                "start": 65,
                "end": 45
            },
            "startRotation": {
                "min": 80,
                "max": 100
            },
            "rotationSpeed": {
                "min": 0,
                "max": 360
            },
            "lifetime": {
                "min": 20,
                "max": 20
            },
            "blendMode": "normal",
            "frequency": 0.7,
            "emitterLifetime": 0,
            "maxParticles": 40,
            "pos": {
                "x": 0,
                "y": 0
            },
            "addAtBack": true,
            "spawnType": "rect",
            "spawnRect": {
                "x": 0,
                "y": 0,
                "w": getWidth(),
                "h": 1
            }
        }
        const textures = [
            "ball_prototype",
            "ball_red",
            "ball_green",
            "ball_blue",
            "ball_orange",
            "ball_purple",
            "ball_yellow"
        ]

        let emitter = new Particles(this, null, ballParticleConfig, textures);
        return (action) => {
            if (action === "add") {
                this.stage.addChildAt(emitter.container, 1);
                emitter.update();
            } else {
                emitter.emitter.destroy();
                emitter.emitter.cleanup();
                this.stage.removeChild(emitter.container);
                emitter.update = () => { };
            }
        }
    })()
    setTimeout(() => {
        ballParticle("add");
    }, 1000);
}
