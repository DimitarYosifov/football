import Level from "./Level.js";
import Stage from "./Stage.js";
// import ProtonEffects from "./ProtonEffects.js";
import LogIn from "./LogIn.js";
import config from "./Config.js";
import { createNewClub, getClubData } from "./newClub.js";
import { clubSelection } from "./clubSelection.js";
// import ClubData from "./newClub.js";

export default class App extends Stage {

    constructor() {

        super();

        window.onload = () => {
            this.windowLoaded = true;
            if (config.addTeam) {
                createNewClub();
            }
            else {
                this.checkLoaded();
            }
        };
    }

    loadComplete() {
        this.config = config;
        this.storageData = localStorage.getItem('match3football');
        if (!config.hasLogin) {                   // REMOVES LOGIN PHASE..FOR TESTS ONLY
            // this.startLevel();
            clubSelection(this);
        } else {
            if (this.storageData) {
                this.checkUserData();
            } else {
                this.login = new LogIn(this);
            }
        }
    }

    checkLoaded() {
        if (this.loaderLoaded && this.windowLoaded && this.isAppStarted) {
            this.loadComplete();
        }
    }

    startLevel() {
        // this.proton = new ProtonEffects(this);
        // Promise.all(
        //     [
        //         new Promise((resolve, reject) => {
        //             resolve(getClubData("Levski"))
        //         }),
        //         new Promise((resolve, reject) => {
        //             resolve(getClubData("Ludogorets"))
        //         })
        //     ]
        // ).then((x) => {
        //     this.playerClubData = x[0];
        //     this.opponentClubData = x[1];
        //     this.level = new Level(this, this.config.isPlayerHome);
        //     this.stage.addChild(this.level);
        // });

        // this.playerClubData = x[0];
        //     this.opponentClubData = x[1];
            this.level = new Level(this, this.config.isPlayerHome);
            this.stage.addChild(this.level);
    }

    getLevel() {
        return this.level;
    }

    checkUserData() {
        $.ajax({
            url: "storageData",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: this.storageData }),
            success: (res) => {
                if (!res.authorized) {
                    this.login = new LogIn(this);
                } else {

                    this.startLevel();
                }
            }
        });
    }
}

new App;

