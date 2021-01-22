
export function standingsView() {

    let standingsContainer = new PIXI.Container;

    let positionsX = {
        name: this.width * 0.05,
        won: this.width * 0.32,
        ties: this.width * 0.4,
        lost: this.width * 0.49,
        goalsFor: this.width * 0.61,
        goalsAgainst: this.width * 0.7,
        goalsDifference: this.width * 0.80,
        points: this.width * 0.9
    }
    let headersPositionsX = {
        club: this.width * 0.05,
        W: this.width * 0.32,
        T: this.width * 0.4,
        L: this.width * 0.49,
        GF: this.width * 0.61,
        GA: this.width * 0.7,
        GD: this.width * 0.80,
        P: this.width * 0.9
    }

    let separatorsPositionsX = {
        club: 0.05,
        W: this.width * 0.28,
        T: this.width * 0.36,
        L: this.width * 0.445,
        GF: this.width * 0.565,
        GA: this.width * 0.655,
        GD: this.width * 0.75,
        P: this.width * 0.85
    }

    let createSeparator = (x, y, width, height) => {
        let separator = new PIXI.Graphics();
        separator.lineStyle(1, 0xdbb7b7, 1);
        separator.drawRect(x, y, width, height);
        return separator;
    }

    let createText = (_text, x, y, anchorX = 0.5) => {
        let text = new PIXI.Text(_text, {
            fontFamily: this.config.mainFont,
            fontSize: this.height / 33,
            fill: '#dbb7b7',
            align: 'center',
            stroke: '#dbb7b7',
            strokeThickness: 0
        });
        text.position.set(x, y);
        text.anchor.set(anchorX, 0);
        return text;
    }

    let teams = [
        {
            name: "Barcelona",
            won: 33,
            ties: 13,
            lost: 13,
            goalsFor: 63,
            goalsAgainst: 13,
            goalsDifference: "+73",
            points: 50
        },
        {
            name: "Levski",
            won: 33,
            ties: 13,
            lost: 13,
            goalsFor: 63,
            goalsAgainst: 13,
            goalsDifference: "+53",
            points: 50
        },
        {
            name: "Dunav",
            won: 33,
            ties: 13,
            lost: 13,
            goalsFor: 63,
            goalsAgainst: 13,
            goalsDifference: "+63",
            points: 133
        }
    ]

    const comparingFunction = (club1, club2) => {
        if (club1.points < club2.points) {
            return 1;
        }
        if (club1.points > club2.points) {
            return -1;
        }

        if (club1.points == club2.points) {
            if (club1.goalsDifference < club2.goalsDifference) {
                return 1;
            }
            if (club1.goalsDifference > club2.goalsDifference) {
                return -1;
            }
            return 0;
        }
    };

    teams.sort(comparingFunction);

    let createHeaders = () => {
        let row = new PIXI.Container;
        let y = 0;
        row.addChild(createText("#", this.width * 0.02, y)); //this is position of the club 
        Object.keys(headersPositionsX).forEach((prop, index) => {
            let isName = prop === "club";
            let anchorX = isName ? 0 : 0.5;
            row.addChild(createText(prop, headersPositionsX[prop], y, anchorX));
        });
        standingsContainer.addChild(row);
    }
    createHeaders();

    teams.forEach((club, i) => {
        let row = new PIXI.Container;
        let y = standingsContainer.height;
        row.addChild(createText(i + 1, this.width * 0.02, y)); //this is position of the club 
        Object.keys(club).forEach((prop, index) => {
            let isName = prop === "name";
            let anchorX = isName ? 0 : 0.5;
            row.addChild(createText(club[prop], positionsX[prop], y, anchorX));
        });
        standingsContainer.addChild(row);
        standingsContainer.addChild(createSeparator(
            this.width * 0.02,
            y + row.height,
            row.width,
            this.height * 0.00001
        ));
    });

    standingsContainer.y = this.height / 2 - standingsContainer.height / 2;

    // Object.keys(headersPositionsX).forEach((prop, index) => {
    //     let separator = createSeparator(
    //         separatorsPositionsX[prop],
    //         0,
    //         this.width * 0.00001,
    //         standingsContainer.height
    //     )
    //     standingsContainer.addChild(separator);
    // });

    this.stage.addChild(standingsContainer);
}
