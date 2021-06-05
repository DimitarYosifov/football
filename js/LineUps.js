import config from "./Config.js";

export default class LineUps {
    constructor(clubName, onCardsData, targetDeck, friendly) {
        this.clubName = clubName;
        this.onCardsData = onCardsData;
        this.targetDeck = targetDeck;
        const playerReq = this.targetDeck === "player"
        this.friendly = friendly;
        this.clubData();
    }
    clubData = () => {
        if (this.targetDeck === "player" && !this.friendly) {
            $.ajax({
                url: "getPlayerLineUp",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(
                    {
                        user: localStorage.getItem('user')
                    }
                ),
                success: (res) => {
                    console.log(res);
                    this[this.targetDeck] = res.players;
                    this.onCardsData();
                }, error: (err) => {
                    alert("err")
                }
            });
        } else {
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
}
