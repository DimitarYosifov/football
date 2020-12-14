export default {
    rendererResolution: window.devicePixelRatio,
    hasLogin: false,              //skip login phase ...for tests
    mainFont: 'Girassol',
    addTeam: false,                //for tests and adding teams to DB
    fadeTimeBetweenPhases: 0.5,   //visibility  delay between game phases
    // gridHasMask: true,            // UNUSED!!!
    isGridInDebug: false,         // predetermened grid for debug
    debugGrid: [
        ["ball_purple", "ball_red", "ball_red", "ball_red", "yellow_card", "ball_red"],
        ["ball_red", "ball_purple", "yellow_card", "yellow_card", "ball_green", "yellow_card"],
        ["red_card", "yellow_card", "ball_green", "ball_yellow", "yellow_card", "ball_green"],
        ["ball_purple", "red_card", "ball_purple", "red_cross", "red_card", "ball_blue"],
        ["yellow_card", "ball_red", "ball_green", "red_card", "red_cross", "yellow_card"],
        ["yellow_card", "ball_yellow", "ball_green", "red_cross", "red_card", "red_cross"],
        ["ball_red", "yellow_card", "red_card", "ball_red", "red_cross", "yellow_card"],
        ["ball_blue", "red_card", "yellow_card", "ball_yellow", "ball_blue", "red_cross"]
    ]
}