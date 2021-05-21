
export function EditTeamPositionsConfig(app) {

    const startingLineUp = [
        {
            card_x: (app.width / 6) * i,
            card_y: app.height * 0.88,
            card_width: app.width / 6,
            card_height: app.height * 0.12
        }
    ]
    return startingLineUp;
}