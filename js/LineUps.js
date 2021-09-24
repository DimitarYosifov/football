import config from "./Config.js";
import { serverRequest } from "./Request.js"

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
            serverRequest(
                "getPlayerLineUp",
                'POST',
                'application/json',
                JSON.stringify({ user: localStorage.getItem('user') })
            ).then(res => {
                this[this.targetDeck] = res.players;
                this.onCardsData();
            })
        } else {
            serverRequest(
                "getClubsPlayers",
                'POST',
                'application/json',
                JSON.stringify({ name: this.clubName })
            ).then(res => {
                this[this.targetDeck] = res.clubData.players;
                this.onCardsData();
            })
        }
    }
}
