import config from "./Config.js";

export default class LineUps {
    constructor(clubName, onCardsData, targetDeck) {
        this.clubName = clubName;
        this.onCardsData = onCardsData;
        this.targetDeck = targetDeck;
        this.clubData();
    }
    clubData = () => {
        $.ajax({
            url: "getClubsPlayers",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name: this.clubName }),
            success: (res) => {
                this[this.targetDeck] = res.clubData.players;
                this.onCardsData();
            }, error: (err) => {
                alert("err")
            }
        });
    }
}
