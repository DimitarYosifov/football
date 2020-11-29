export default {
    rendererResolution: window.devicePixelRatio,
    hasLogin: false,              //skip login phase ...for tests
    mainFont: 'Girassol',
    addTeam: false,                //for tests and adding teams to DB
    fadeTimeBetweenPhases: 0.5,   //visibility  delay between game phases
    gridHasMask: true,            // UNUSED!!!
    isGridInDebug: false,         // predetermened grid for debug
    debugGrid: [
        ["ball_purple", "ball_red", "ball_yellow", "ball_red", "yellow_card", "ball_red"],
        ["ball_red", "ball_purple", "yellow_card", "ball_blue", "ball_green", "ball_blue"],
        ["ball_green", "yellow_card", "ball_yellow", "ball_yellow", "red_cross", "ball_green"],
        ["ball_orange", "ball_blue", "ball_purple", "ball_purple", "ball_orange", "ball_blue"],
        ["ball_red", "ball_red", "ball_green", "red_cross", "ball_green", "ball_yellow"],
        ["ball_blue", "ball_yellow", "ball_green", "red_cross", "red_card", "ball_orange"],
        ["ball_red", "ball_orange", "red_card", "ball_red", "ball_purple", "ball_red"],
        ["ball_blue", "red_card", "ball_red", "ball_yellow", "ball_blue", "ball_red"]
    ]
}