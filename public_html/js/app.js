"use strict";

import Level from "./level.js";
import Stage from "./stage.js";

export default class App extends Stage {
        
    constructor() {
        super();
        this.level = new Level(this);
    }
}

new App;

