
export function createNewClub() {
    //possible options are: Levski , Barcelona
    const newClub = "Levski";
    $.ajax({
        url: "addClub",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(
            {
                name: newClub,
                clubData: teams[newClub].clubData,
                players: teams[newClub].players
            }
        ),
        success: (res) => {
            alert("successfully added")
        }, error: (err) => {
            alert("err");
        }
    });
}

const teams = {
    Levski: {
        clubData: {
            name: "Levski",
            colors: null,
            power: 3,
            logo: "testlogo1"
        },
        players: [
            {
                defense_current: 0,
                defense_color: "FF1D00",
                defense_full: 11,
                attack_current: 0,
                attack_color: "E2D841",
                attack_full: 26,
                special: null,
                position: "GK",
                player_img_id: '011'
            },
            {
                defense_current: 0,
                defense_color: "B200FF",
                defense_full: 14,
                attack_current: 0,
                attack_color: "2F7F07",
                attack_full: 21,
                special: null,
                position: "DF1",
                player_img_id: '001'
            },
            {
                defense_current: 0,
                defense_color: "FF1D00",
                defense_full: 14,
                attack_current: 0,
                attack_color: "3052FF",
                attack_full: 21,
                special: null,
                position: "DF2",
                player_img_id: '007'
            },
            {
                defense_current: 0,
                defense_color: "3052FF",
                defense_full: 18,
                attack_current: 0,
                attack_color: "FF1D00",
                attack_full: 18,
                special: null,
                position: "MD1",
                player_img_id: '008'
            },
            {
                defense_current: 0,
                defense_color: "2F7F07",
                defense_full: 18,
                attack_current: 0,
                attack_color: "E2D841",
                attack_full: 18,
                special: null,
                position: "MD2",
                player_img_id: '018'
            },
            {
                defense_current: 0,
                defense_color: "E2D841",
                defense_full: 21,
                attack_current: 0,
                attack_color: "B200FF",
                attack_full: 14,
                special: null,
                position: "F",
                player_img_id: '010'
            }
        ]
    },
    Barcelona: {
        clubData: {
            name: "Barcelona",
            colors: null,
            power: 7,
            logo: "testlogo2"
        },
        players: [
            {
                defense_current: 0,
                defense_color: "FF1D00",
                defense_full: 7,
                attack_current: 0,
                attack_color: "B200FF",
                attack_full: 22,
                special: null,
                position: "GK",
                opponent_img_id: '009'
            },
            {
                defense_current: 0,
                defense_color: "E2D841",
                defense_full: 10,
                attack_current: 0,
                attack_color: "2F7F07",
                attack_full: 17,
                special: null,
                position: "DF1",
                opponent_img_id: '003'
            },
            {
                defense_current: 0,
                defense_color: "B200FF",
                defense_full: 10,
                attack_current: 0,
                attack_color: "FF1D00",
                attack_full: 17,
                special: null,
                position: "DF2",
                opponent_img_id: '004'
            },
            {
                defense_current: 0,
                defense_color: "2F7F07",
                defense_full: 14,
                attack_current: 0,
                attack_color: "3052FF",
                attack_full: 14,
                special: null,
                position: "MD1",
                opponent_img_id: '005'
            },
            {
                defense_current: 0,
                defense_color: "3052FF",
                defense_full: 14,
                attack_current: 0,
                attack_color: "E2D841",
                attack_full: 14,
                special: null,
                position: "MD2",
                opponent_img_id: '006'
            },
            {
                defense_current: 0,
                defense_color: "E2D841",
                defense_full: 17,
                attack_current: 0,
                attack_color: "B200FF",
                attack_full: 10,
                special: null,
                position: "F",
                opponent_img_id: '007'
            }
        ]
    }
}

export function getClubData(clubName) {
    return $.ajax({
        url: "getClubData",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(
            {
                name: clubName
            }
        ),
        success: (res) => {
            console.log(res);
            // alert("successfully received")
        }, error: (err) => {
            // alert("err");
        }
    });
}
