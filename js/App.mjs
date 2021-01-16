import Level from "./Level.js";
import Stage from "./Stage.js";
// import ProtonEffects from "./ProtonEffects.js";
import LogIn from "./LogIn.js";
import config from "./Config.js";
import { createNewClub, getClubData } from "./newClub.js";
import { clubSelection } from "./clubSelection.js";
import { standingsView } from "./standingsView.js";
import LoadingView from "./LoadingView.js";

export default class App extends Stage {

    constructor() {
        super();
        this.loadingView = new LoadingView(this.width, this.height);
        this.stage.addChild(this.loadingView.loadingBar);
        this.stage.addChild(this.loadingView.loadingBarFull);
        this.stage.addChild(this.loadingView.progress);
        this.stage.addChild(this.loadingView.loadingText);
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
        this.stage.removeChildren();
        this.config = config;
        this.storageData = localStorage.getItem('match3football');
        if (!config.hasLogin) {                   // REMOVES LOGIN PHASE..FOR TESTS ONLY
            clubSelection(this);
        } else {
            if (this.storageData) {
                this.checkUserData();
            } else {
                // let standings = standingsView.bind(this)();
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
                    clubSelection(this);
                }
            }
        });
    }
}

new App;

