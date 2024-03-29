export default {
    rendererResolution: window.devicePixelRatio,

    //skip login phase ...for tests
    hasLogin: true,

    mainFont: 'Girassol',

    //for tests and adding teams to DB
    // addTeam: false,

    //visibility  delay between game phases
    fadeTimeBetweenPhases: 0.5,

    // gridHasMask: true,            // UNUSED!!!

    // predetermened grid for debug
    isGridInDebug: false,

    // temporary
    isPlayerHome: true,

    debugGrid: [
        ["red_cross", "red_cross", "ball_red", "red_cross", "red_cross", "red_cross"],
        ["yellow_card", "yellow_card", "yellow_card", "ball_red", "red_card", "red_cross"],
        ["red_card", "yellow_card", "red_cross", "ball_red", "red_card", "ball_green"],
        ["ball_purple", "red_cross", "yellow_card", "red_cross", "red_card", "ball_blue"],
        ["ball_yellow", "red_cross", "ball_blue", "ball_yellow", "ball_blue", "yellow_card"],
        ["ball_red", "ball_red", "red_card", "yellow_card", "red_card", "red_card"],
        ["ball_red", "red_card", "ball_red", "ball_red", "red_cross", "red_card"],
        ["red_card", "red_card", "red_card", "red_cross", "red_card", "red_cross"]
    ],
    roundsInMatch: 20,

    // this may be for debug and test or may be default
    randomCardColors: true,

    //win chance depending on clubs power difference.random num from 1 to 100 is generated 
    winChance: {
        6: { "win": 95, "tie": 99, "lose": 100 },
        5: { "win": 85, "tie": 95, "lose": 100 },
        4: { "win": 75, "tie": 90, "lose": 100 },
        3: { "win": 65, "tie": 85, "lose": 100 },
        2: { "win": 55, "tie": 80, "lose": 100 },
        1: { "win": 45, "tie": 75, "lose": 100 },
        0: { "win": 30, "tie": 70, "lose": 100 },
    },

    // NOTE!    
    // color of every newly created block - for tests!
    // if this is not null - set isGridInDebug to true, otherwise game will crash!!!!
    predefinedBlockColor: null,

    maxInjuryDuration: 5,
    yellowCardsToMissGame: 5
}