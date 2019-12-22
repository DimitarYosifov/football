"use strict";

import Level from "./level.js";
import Stage from "./stage.js";
import ProtonEffects from "./ProtonEffects.js";
import LogIn from "./LogIn.js";


export default class App extends Stage {

    constructor() {
        super();
        this.login = new LogIn(this);
    }

    startLevel() {
        this.proton = new ProtonEffects();
        this.level = new Level(this);
    }
}

new App;

