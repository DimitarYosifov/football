// import Background from "./Background.js";

export default class SeasonFixtures {
    constructor(teams) {

        for (let i = teams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [teams[i], teams[j]] = [teams[j], teams[i]];
        }

        const rounds = teams.length * 2 - 2;
        this.seasonFixtures = {};
        let stringMatrix = {};
        let matrix = [];

        for (let round = 1; round <= rounds / 2; round++) {
            stringMatrix[round] = "1 ";
            this.seasonFixtures[round] = [];
            for (let teamIdx = 1; teamIdx <= teams.length - 1; teamIdx++) {
                let n = teamIdx + round > teams.length ? ((teamIdx + round) % teams.length) + 1 : teamIdx + round;
                stringMatrix[round] += `${n} `;
            }
            matrix.push(stringMatrix[round].trim().split(" "));
        }

        matrix.forEach((element, index) => {
            if (index % 2 !== 0) {
                let temp = element[0];
                element[0] = element[1];
                element[1] = temp;
            }
            let item = element.slice().reverse();
            matrix.push(item);
        });

        for (let index = 0; index < matrix.length; index++) {
            let data = matrix[index];
            this.seasonFixtures[index + 1] = [];
            for (let n = 0; n < data.length; n += 2) {
                let team1 = data[n] - 1;
                let team2 = Number(data[n + 1] - 1);
                this.seasonFixtures[index + 1].push(`${teams[team1]}:${teams[team2]}`);
            }
        }
    }
}
