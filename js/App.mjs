import Level from "./Level.js";
import Stage from "./Stage.js";
// import ProtonEffects from "./ProtonEffects.js";
import LogIn from "./LogIn.js";
import config from "./Config.js";
import { createNewClub, getClubData } from "./newClub.js";
import { clubSelection } from "./clubSelection.js";
import { modeSelection } from "./modeSelection.js";
import { standingsView } from "./standingsView.js";
import { generateResult } from "./generateResult.js";
import LoadingView from "./LoadingView.js";

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
        // this.stage.removeChildren();
        this.config = config;
        this.storageData = localStorage.getItem('match3football');
        if (!config.hasLogin) {
            this.checkGameInProgress();                // REMOVES LOGIN PHASE..FOR TESTS ONLY
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
        this.level = new Level(this);
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
                    this.user = localStorage.getItem('user');
                    this.checkGameInProgress();
                }
            }
        });
    }

    checkGameInProgress() {
        $.ajax({
            url: "getFixtures",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ user: this.user }),
            success: (res) => {
                if (res.data) {
                    standingsView.bind(this)(res.data);
                } else {
                    modeSelection(this);
                }
            }
        });
    }
}

new App;

