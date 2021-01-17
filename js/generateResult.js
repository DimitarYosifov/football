import config from "./Config.js";
import exactResultConfig from "./ExactResultConfig.js";


//club power is in range 1-7 
export function generateResult(power1, power2) {

    const areClubsEqual = power1 === power2;
    const isFirstClubStronger = power1 > power2;
    let powerDifference = Math.abs(power1 - power2);

    const actualPower1 = power1 - power2;
    const actualPower2 = power2 - power1;

    let winChanceConfig = config.winChance[powerDifference];

    //determine if stronger club wins
    const randomWinNumber = Math.floor(Math.random() * 100) + 1;
    let result;

    if (randomWinNumber <= winChanceConfig.win) {
        result = "win";
    } else if (randomWinNumber <= winChanceConfig.tie) {
        result = "tie";
    } else {
        result = "lose";
    }

    if (result = "lose") {
        powerDifference = 0;
    }

    if (result = "tie") {

    }

    let exactResult = null;

    while (!exactResult) {
        let chances = exactResultConfig.exactWin[powerDifference];
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
            });
        }
    }

    console.log(exactResult);

    //TODO reverse result if second club wins !!!!!
    //TODO check if all chances are === 100 !!!!!!
}
