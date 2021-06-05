import config from "./Config.js";

export function recordClubPlayersParams(app, matchEnd = false) {

    let team = app.playerClubData.name;
    let players;
    let initialParamsPlayers = app.allClubs.find(t => t.name === team).players;

    if (matchEnd) {
        players = app.level.children.find(child => child.clubName === team).lineUps.player;
        for (let playerIdx = 0; playerIdx < 6; playerIdx++) {

            if (players[playerIdx].leagueYellowCards === config.yellowCardsToMissGame) {
                players[playerIdx].leagueYellowCards = 0;
            }

            if (players[playerIdx].leagueRedCards) {
                players[playerIdx].leagueRedCards = false
            }
            else if (app.level.playerCards.children[playerIdx].hasRedCard) {
                players[playerIdx].leagueRedCards = true;
            }
            players[playerIdx].leagueYellowCards += app.level.playerCards.children[playerIdx].hasYellowCard;

            players[playerIdx].goalsScored += app.level.playerCards.children[playerIdx].goalsScored;
            if (app.level.playerCards.children[playerIdx].hasInjury && players[playerIdx].injured === 0) {
                players[playerIdx].injured = Math.floor(Math.random() * config.maxInjuryDuration) + 1;
            }
            if (players[playerIdx].injured > 0) {
                players[playerIdx].injured--;
            }

            players[playerIdx].attack_full = initialParamsPlayers[playerIdx].attack_full;
            players[playerIdx].attack_current = initialParamsPlayers[playerIdx].attack_current;
            players[playerIdx].defense_full = initialParamsPlayers[playerIdx].defense_full;
            players[playerIdx].defense_current = initialParamsPlayers[playerIdx].defense_current;

        }
    } else {
        players = initialParamsPlayers;
    }

    // let one = players[6];
    // let rwo = players[7];
    // console.log(`[5] =>  sub -${one.substitute} attack -${one.attack_full}`);
    // console.log(`[17] =>  sub -${rwo.substitute} attack -${rwo.attack_full}`);
    console.log();
    $.ajax({
        url: "playersParams",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(
            {
                players: players,
                user: localStorage.getItem('user')
            }
        ),
        success: (res) => {

        }, error: (err) => {

        }
    });

}
