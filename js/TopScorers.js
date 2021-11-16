import GameTexture from "./GameTexture.js";
import Background from "./Background.js";
import RotatingButton from "./RotatingButton.js";

export default class TopScorers extends PIXI.Container {
    constructor(app) {
        super();
        this.app = app;
        this.scorersData = this.app.topScorers;
        this.playerClub = this.app.playerClubData.name;
        this.players = this.app.playerLineUp;
        this.allScorers = [];
        this.containers = [];
        this.scorersData[this.playerClub] = this.players.map(player => player.goalsScored);
        Object.keys(this.scorersData).forEach((team, index) => {
            console.log(team);
            for (let index = 0; index < this.scorersData[team].length; index++) {
                let player = {};
                player.club = team;
                player.index = index;
                player.goals = this.scorersData[team][index];
                let players;
                if (this.playerClub === team) {
                    players = this.players;
                }
                else {
                    players = this.app.allClubs.find(c => c.name === team).players;
                }
                player.img = players[index].player_img_id;
                this.allScorers.push(player);
            }
        })
        console.log(this.allScorers);
        this.finalData = this.allScorers.sort((a, b) => a.goals - b.goals).reverse().slice(0, 10);
        console.log(this.finalData);
        this.addBackground();
        this.addHeader();
        this.addPlayers();
        this.addButtons();
        this.app.stage.alpha = 1
    }

    addBackground() {
        this.backgroundImg = new Background(this.app, {
            gamePhase: "topScorers",
            sprite: new GameTexture(this.app, "scorer"),
            bg_x: -this.app.width * 0.005,
            bg_y: -this.app.height * 0.005,
            bg_width: this.app.width * 1.005,
            bg_height: this.app.height * 1.005
        });
        this.backgroundImg.alpha = 1;
        this.backgroundImg.interactive = true;
        this.addChild(this.backgroundImg);
    }

    addHeader() {
        this.header = new PIXI.Text("TOP SCORERS", {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 20,
            // fill: isPlayerClub ? "#6ddd48" : '#dbb7b7',
            fill: '#dbb7b7',
            align: 'center',
            // stroke: '#000000',
            // strokeThickness: 3
        });
        this.header.position.set(this.app.width / 2, -200);
        this.header.anchor.set(0.5, 0);
        this.addChild(this.header);
        TweenMax.to(this.header, 0.3, {
            delay: 0.4,
            // ease: Back.easeOut,
            y: this.app.height * 0.03,
            onComplete: () => { }
        });
    }

    addPlayers() {
        this.finalData.forEach((el, idx) => {
            let cont = new PIXI.Container();
            const data = el;
            let y = this.app.height * 0.1 + this.app.height * 0.08 * idx

            let index = new PIXI.Text(idx + 1, {
                fontFamily: this.app.config.mainFont,
                fontSize: this.app.height / 25,
                fill: '#dbb7b7',
                // align: 'center',
                // stroke: '#000000',
                // strokeThickness: 3
            });
            index.position.set(this.app.width * 0.05, y + this.app.height * 0.01);
            index.anchor.set(0.5, 0);
            cont.addChild(index);

            let img = new GameTexture(this.app, `player_id_${data.img}`).sprite;
            img.width = this.app.width / 15;
            img.scale.y = img.scale.x;
            img.position.set(this.app.width * 0.15, y);
            img.anchor.set(0, 0);
            cont.addChild(img);

            let team = new PIXI.Text(data.club, {
                fontFamily: this.app.config.mainFont,
                fontSize: this.app.height / 30,
                fill: '#dbb7b7',
                // align: 'center',
                // stroke: '#000000',
                // strokeThickness: 3
            });
            team.position.set(this.app.width * 0.4, y + this.app.height * 0.01);
            team.anchor.set(0, 0);
            cont.addChild(team);

            let goals = new PIXI.Text(data.goals, {
                fontFamily: this.app.config.mainFont,
                fontSize: this.app.height / 25,
                fill: '#dbb7b7',
                // align: 'center',
                // stroke: '#000000',
                // strokeThickness: 3
            });
            goals.position.set(this.app.width * 0.75, y + this.app.height * 0.01);
            goals.anchor.set(0, 0);
            cont.addChild(goals);
            this.addChild(cont);
            this.containers.push(cont);
            cont.x -= this.app.width;
            console.log(cont.y);
            TweenMax.to(cont, 0.1, {
                delay: idx * 0.06,
                x: 0, onComplete: () => { }
            });
        });
    }

    addButtons() {
        //--BACK BUTTON
        let backOnPointerDown = () => {
            let counter = 0;
            for (let idx = this.containers.length - 1; idx >= 0; idx--) {
                TweenMax.to(this.containers[idx], 0.35, {
                    delay: counter * 0.06,
                    x: -this.app.width,
                    onStart: () => {
                        console.log(counter);
                    }
                });
                counter++;
            }
            TweenMax.to([this.backBtn, this.backBtn.label], 0.35, {
                x: this.app.width * 1.1,
                ease: Back.easeIn,
                onComplete: () => { }
            });
            TweenMax.to(this.header, 0.35, {
                y: -200,
                onComplete: () => { }
            });
            TweenMax.delayedCall(1, () => {
                this.removeChildren();
                this.parent.removeChild(this);
            })
        }
        this.backBtn = new RotatingButton(this.app, null, null, backOnPointerDown);
        this.addChild(this.backBtn);
        this.backBtn.setButtonSize(this.app.height * 0.1, this.app.width * 1.1, this.app.height * 0.1);
        this.backBtn.addLabel(`Back`, 0.4);

        TweenMax.to([this.backBtn, this.backBtn.label], 0.3, {
            delay: 0.3,
            ease: Back.easeOut,
            x: this.app.width * 0.9,
            onComplete: () => { }
        });
    }
}
