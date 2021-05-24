
export function recordClubPlayersParams(app) {

    const team = app.playerClubData.name;
    const players = app.allClubs.find(t => t.name === team).players;

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
