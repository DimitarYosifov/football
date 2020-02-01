"use strict";
import Level from "./level.js";
import Stage from "./stage.js";
import ProtonEffects from "./protonEffects.js";
import LogIn from "./LogIn.js";
import config from "./Config.js";

// $(window).on('load', function() {alert() });
export default class App extends Stage {

    constructor() {
        super();

        $(window).bind("load", () => {

            this.config = config;
            this.storageData = localStorage.getItem('match3football');

            if (!config.hasLogin) {                   // REMOVES LOGIN PHASE..FOR TESTS ONLY
                this.startLevel();
            } else {
                if (this.storageData) {
                    this.checkUserData();
                } else {
                    this.login = new LogIn(this);
                }
            }
        });


        // setTimeout(() => {
        //     // this.startLevel();
        //     this.config = config;
        //     this.storageData = localStorage.getItem('match3football');
        //     if (this.storageData) {
        //         this.checkUserData();
        //     } else {
        //         this.login = new LogIn(this);
        //     }
        // }, 3000)

    }

    startLevel() {
        this.proton = new ProtonEffects();
        this.level = new Level(this);
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

