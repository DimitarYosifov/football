"use strict";

import Level from "./level.js";
import Stage from "./stage.js";
import ProtonEffects from "./ProtonEffects.js";
import LogIn from "./LogIn.js";
import config from "./Config.js";



export default class App extends Stage {

    constructor() {
        
        super();
        
        this.config = config;
        this.storageData = localStorage.getItem('match3football');
        
        if (this.storageData) {
            this.checkUserData();
        }

        if (this.config.hasLogin && !this.validUser) {
            this.login = new LogIn(this);
        } else {
            this.startLevel();
        }
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
            data: JSON.stringify({data: this.storageData}),
            success: function (res) {
                this.validUser = res.authorized;
                console.log(res.authorized);
            }
        });
    }
}

new App;

