"use strict";

import Level from "./level.js";
import Stage from "./stage.js";
import LevelCards from "./LevelCards.js";

export default class App extends Stage {

    constructor() {
        super();
        this.level = new Level(this);
    }
}

new App;

