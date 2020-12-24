export default class MatchStartPopup extends PIXI.Container {
    constructor(app) {
        super();
        this.delayBetweenSteps = .15;
        this.playerClubStars = [];
        this.opponentClubStars = [];
        this.app = app;
        this.homeTeamScore = this.app.level.isPlayerHome ? this.app.level.playerScore : this.app.level.opponentScore;
        this.awayTeamScore = this.app.level.isPlayerHome ? this.app.level.opponentScore : this.app.level.playerScore;
        this.create();
    }

    create() {

        this.container1 = new PIXI.Container;
        this.container1.alpha = 0;
        this.addChild(this.container1);

        TweenMax.delayedCall(1, () => {
            this.showPlayerLogo();
        })
    }

    bounceOpponentStars() {
        for (let starIdx = 0; starIdx < this.app.opponentClubData.clubData.power; starIdx++) {
            let newAtkVal;
            let newDefVal;
            for (let cardIdx = 0; cardIdx < this.app.level.playerCards.children.length; cardIdx++) {
                TweenMax.delayedCall(starIdx * this.delayBetweenSteps, () => {
                    this.app.level.playerCards.children[cardIdx].stats.attack_full++;
                    this.app.level.playerCards.children[cardIdx].stats.defense_full++
                    newAtkVal = this.app.level.playerCards.children[cardIdx].stats.attack_full;
                    newDefVal = this.app.level.playerCards.children[cardIdx].stats.defense_full;
                    this.app.level.playerCards.children[cardIdx].attackValuesText.text = `0/${newAtkVal}`
                    this.app.level.playerCards.children[cardIdx].defenseValuesText.text = `0/${newDefVal}`
                })
            }

            let target = this.opponentClubStars[starIdx];
            let scaleValue = target.scale.x;

            TweenMax.to(target.scale, .4, {
                x: scaleValue * 1.5,
                y: scaleValue * 1.5,
                yoyo: true,
                repeat: 1,
                delay: starIdx * this.delayBetweenSteps
            });
        }
        TweenMax.delayedCall(this.app.opponentClubData.clubData.power * this.delayBetweenSteps + 1, () => {
            TweenMax.to(this.container2, .5, {
                width: 0,
                height: 0,
                alpha: 0,
                y: this.app.height / 2,
                x: this.app.width / 2,
                onComplete: () => {
                    this.parent.removeChild(this);
                    this.app.level.onIntroFinish();
                }
            });

        })
    }

    bouncePlayerStars() {
        for (let starIdx = 0; starIdx < this.app.playerClubData.clubData.power; starIdx++) {
            let newAtkVal;
            let newDefVal;
            for (let cardIdx = 0; cardIdx < this.app.level.opponentCards.children.length; cardIdx++) {
                TweenMax.delayedCall(starIdx * this.delayBetweenSteps, () => {
                    this.app.level.opponentCards.children[cardIdx].stats.attack_full++;
                    this.app.level.opponentCards.children[cardIdx].stats.defense_full++
                    newAtkVal = this.app.level.opponentCards.children[cardIdx].stats.attack_full;
                    newDefVal = this.app.level.opponentCards.children[cardIdx].stats.defense_full;
                    this.app.level.opponentCards.children[cardIdx].attackValuesText.text = `0/${newAtkVal}`
                    this.app.level.opponentCards.children[cardIdx].defenseValuesText.text = `0/${newDefVal}`
                })
            }

            let target = this.playerClubStars[starIdx];
            let scaleValue = target.scale.x;

            TweenMax.to(target.scale, .4, {
                x: scaleValue * 1.5,
                y: scaleValue * 1.5,
                yoyo: true,
                repeat: 1,
                delay: starIdx * this.delayBetweenSteps
            });
        }
        TweenMax.delayedCall(this.app.playerClubData.clubData.power * this.delayBetweenSteps + 1, () => {
            TweenMax.to(this.container1, .5, {
                width: 0,
                height: 0,
                alpha: 0,
                y: this.app.height / 2,
                x: this.app.width / 2,
                onComplete: () => {
                    this.removeChildren();
                    this.showOpponentLogo();
                }
            });

        })
    }

    showPlayerLogo() {
        //PLAYER CLUB LOGO
        const playerLogoTexture = this.app.loader.resources.logos.textures[`${this.app.playerClubData.clubData.logo}`];
        this.playerClubLogo = new PIXI.Sprite(playerLogoTexture);
        this.playerClubLogo.x = this.app.width / 2;
        this.playerClubLogo.y = this.app.height / 2;
        this.playerClubLogo.height = this.app.height / 2;
        this.playerClubLogo.scale.x = this.playerClubLogo.scale.y;
        this.playerClubLogo.anchor.set(0.5, 0.5);
        this.container1.addChild(this.playerClubLogo);

        //PLAYER CLUB STARS
        this.playerClubPower = this.app.playerClubData.clubData.power;
        for (let s = 0; s < this.playerClubPower; s++) {
            const starTexture = this.app.loader.resources.main1.textures[`star`];
            const star = new PIXI.Sprite(starTexture);
            star.height = this.app.height * 0.07;
            star.scale.x = star.scale.y;
            star.x = this.playerClubLogo.x - star.width * s + star.width * this.playerClubPower / 2 - star.width / 2;
            star.y = this.playerClubLogo.y - this.playerClubLogo.height / 2 - star.height / 2;
            star.anchor.set(0.5, 0.5);
            this.container1.addChild(star);
            this.playerClubStars.push(star);
        }

        let initialWidth = this.container1.width;
        let initialHeight = this.container1.height;

        this.container1.x = this.app.width / 2;
        this.container1.y = this.app.height / 2;
        this.container1.width = 0;
        this.container1.height = 0;

        TweenMax.to(this.container1, .5, {
            width: initialWidth,
            height: initialHeight,
            alpha: 1,
            y: 0,
            x: 0,
            onComplete: () => {
                this.bouncePlayerStars();
            }
        });
    }

    showOpponentLogo() {

        this.container2 = new PIXI.Container;
        this.container2.alpha = 0;
        this.addChild(this.container2);

        //OPPONENT CLUB LOGO
        const opponentLogoTexture = this.app.loader.resources.logos.textures[`${this.app.opponentClubData.clubData.logo}`];
        this.opponentClubLogo = new PIXI.Sprite(opponentLogoTexture);
        this.opponentClubLogo.x = this.app.width / 2;
        this.opponentClubLogo.y = this.app.height / 2;
        this.opponentClubLogo.height = this.app.height / 2;
        this.opponentClubLogo.scale.x = this.opponentClubLogo.scale.y;
        this.opponentClubLogo.anchor.set(0.5, 0.5);
        this.container2.addChild(this.opponentClubLogo);

        //OPPONENT CLUB STARS
        this.opponentClubPower = this.app.opponentClubData.clubData.power;
        for (let s = 0; s < this.opponentClubPower; s++) {
            const starTexture = this.app.loader.resources.main1.textures[`star`];
            const star = new PIXI.Sprite(starTexture);
            star.height = this.app.height * 0.07;
            star.scale.x = star.scale.y;
            star.x = this.opponentClubLogo.x - star.width * s + star.width * this.opponentClubPower / 2 - star.width / 2;
            star.y = this.opponentClubLogo.y - this.opponentClubLogo.height / 2 - star.height / 2;
            star.anchor.set(0.5, 0.5);
            this.container2.addChild(star);
            this.opponentClubStars.push(star);
        }
        let initialWidth = this.container2.width;
        let initialHeight = this.container2.height;

        this.container2.x = this.app.width / 2;
        this.container2.y = this.app.height / 2;
        this.container2.width = 0;
        this.container2.height = 0;

        TweenMax.to(this.container2, .5, {
            width: initialWidth,
            height: initialHeight,
            alpha: 1,
            y: 0,
            x: 0,
            onComplete: () => {
                this.bounceOpponentStars();
            }
        });
    }
}
