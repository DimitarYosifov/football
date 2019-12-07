let fillingCardsPoints = {
    colors: {
        "RED": 'FF1D00',
        "BLUE": '3052FF',
        "GREEN": '2F7F07',
        "YELLOW": 'E2D841',
        "ORANGE": 'FF9702',
        "PURPLE": 'B200FF'
    },
    matchColor: function (color, matchesCount) {
        let matchColor = this.colors[color.split('_')[1].toUpperCase()];
        let cards;
        level.playerTurn ? cards = stage.children[2] : cards = stage.children[3]
        for (let i = 0; i < 6; i++) {
            let defenseColor = cards.children[i].stats.defense_color;
            let attackColor = cards.children[i].stats.attack_color;
            if (matchColor === defenseColor) {
                let currentPoints = Number(cards.children[i].children[2].text.split('/')[0]);
                let neededPoints = Number(cards.children[i].children[2].text.split('/')[1]);
                cards.children[i].children[2].text = (currentPoints += matchesCount) + "/" + neededPoints;
            }
            if (matchColor === attackColor) {
                let currentPoints = Number(cards.children[i].children[1].text.split('/')[0]);
                let neededPoints = Number(cards.children[i].children[1].text.split('/')[1]);
                cards.children[i].children[1].text = (currentPoints += matchesCount) + "/" + neededPoints;
            }
        }
    }
};