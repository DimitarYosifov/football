import config from "./Config.js";
import exactResultConfig from "./ExactResultConfig.js";

//club power is in range 1-7 
export function generateResult(power1, power2) {

    const areClubsEqual = power1 === power2;
    const isFirstClubStronger = power1 > power2;
    const isSecondClubStronger = power2 > power1;
    let powerDifference = Math.abs(power1 - power2);
    let winChanceConfig = config.winChance[powerDifference];

    //determine if stronger club wins
    const randomWinNumber = Math.floor(Math.random() * 100) + 1;
    let result;
    let exactResult = null;

    if (randomWinNumber <= winChanceConfig.win) {
        result = "win";
    } else if (randomWinNumber <= winChanceConfig.tie) {
        result = "tie";
    } else {
        result = "lose";
    }

    if (result === "lose") {
        powerDifference = 0;
    }
    while (!exactResult) {
        let chances = result === "tie" ?
            exactResultConfig.exactTie :
            exactResultConfig.exactWin[powerDifference];
        while (!exactResult) {
            Object.keys(chances).forEach((element, index) => {
                let percentChance = chances[element];
                for (let i = 0; i < percentChance; i++) {
                    const n = Math.floor(Math.random() * 100) + 1;
                    if (n === 100) {
                        exactResult = element;
                        break;
                    }
                }
                return;
            });
        }
    }

    if ((result === "lose" && !isSecondClubStronger) || (isSecondClubStronger && result === "win")) {
        exactResult = exactResult.split("").reverse().join("");
    }

    let a = 0
    Object.keys(exactResultConfig.exactWin[5]).forEach((element, index) => {
        a += exactResultConfig.exactWin[5][element];
    });
    console.log(exactResult);
    return exactResult;
}
