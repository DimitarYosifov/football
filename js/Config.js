export default {
    rendererResolution: window.devicePixelRatio,
    hasLogin: false,              //skip login phase ...for tests
    mainFont: 'Girassol',
    addTeam: false,                //for tests and adding teams to DB
    fadeTimeBetweenPhases: 0.5,   //visibility  delay between game phases
    // gridHasMask: true,            // UNUSED!!!
    isGridInDebug: false,         // predetermened grid for debug
    isPlayerHome: true,         // temporary
    debugGrid: [
        ["ball_purple", "red_cross", "ball_red", "ball_red", "ball_blue", "ball_red"],
        ["ball_green", "ball_yellow", "yellow_card", "red_card", "ball_green", "ball_yellow"],
        ["red_card", "yellow_card", "ball_green", "ball_yellow", "ball_red", "ball_green"],
        ["ball_purple", "red_card", "ball_purple", "red_cross", "red_card", "ball_blue"],
        ["ball_yellow", "ball_red", "ball_blue", "ball_yellow", "ball_blue", "yellow_card"],
        ["yellow_card", "ball_yellow", "yellow_card", "red_cross", "ball_green", "red_cross"],
        ["ball_red", "yellow_card", "red_card", "yellow_card", "ball_blue", "yellow_card"],
        ["ball_green", "red_card", "ball_green", "ball_yellow", "ball_green", "red_cross"]
    ],
    roundsInMatch: 20
}