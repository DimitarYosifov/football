export default class LineUps {
    constructor() {
        
//      at some point this data will come from DB....TODO
        this.player = [
            {
                defense_current: 0,
                defense_color: "FF1D00",
                defense_full: 20,
                attack_current: 0,
                attack_color: "B200FF",
                attack_full: 20,
                special: null,
                position: "GK",
                player_img_id: '011'
            },
            {
                defense_current: 0,
                defense_color: "B200FF",
                defense_full: 20,
                attack_current: 0,
                attack_color: "2F7F07",
                attack_full: 20,
                special: null,
                position: "DF1",
                player_img_id: '001'
            },
            {
                defense_current: 0,
                defense_color: "FF1D00",
                defense_full: 20,
                attack_current: 0,
                attack_color: "3052FF",
                attack_full: 20,
                special: null,
                position: "DF2",
                player_img_id: '007'
            },
            {
                defense_current: 0,
                defense_color: "FF9702",
                defense_full: 20,
                attack_current: 0,
                attack_color: "FF9702",
                attack_full: 20,
                special: null,
                position: "MD1",
                player_img_id: '008'
            },
            {
                defense_current: 0,
                defense_color: "2F7F07",
                defense_full: 20,
                attack_current: 0,
                attack_color: "E2D841",
                attack_full: 20,
                special: null,
                position: "MD2",
                player_img_id: '018'
            },
            {
                defense_current: 0,
                defense_color: "E2D841",
                defense_full: 20,
                attack_current: 0,
                attack_color: "FF9702",
                attack_full: 20,
                special: null,
                position: "F",
                player_img_id: '010'
            }
        ];
        this.opponent = [
            {
                defense_current: 0,
                defense_color: "FF1D00",
                defense_full: 20,
                attack_current: 0,
                attack_color: "B200FF",
                attack_full: 20,
                special: null,
                position: "GK",
                opponent_img_id: '009'
            },
            {
                defense_current: 0,
                defense_color: "B200FF",
                defense_full: 20,
                attack_current: 0,
                attack_color: "2F7F07",
                attack_full: 20,
                special: null,
                position: "DF1",
                opponent_img_id: '003'
            },
            {
                defense_current: 0,
                defense_color: "B200FF",
                defense_full: 20,
                attack_current: 0,
                attack_color: "FF1D00",
                attack_full: 20,
                special: null,
                position: "DF2",
                opponent_img_id: '004'
            },
            {
                defense_current: 0,
                defense_color: "E2D841",
                defense_full: 20,
                attack_current: 0,
                attack_color: "FF9702",
                attack_full: 20,
                special: null,
                position: "MD1",
                opponent_img_id: '005'
            },
            {
                defense_current: 0,
                defense_color: "3052FF",
                defense_full: 20,
                attack_current: 0,
                attack_color: "E2D841",
                attack_full: 20,
                special: null,
                position: "MD2",
                opponent_img_id: '006'
            },
            {
                defense_current: 0,
                defense_color: "E2D841",
                defense_full: 20,
                attack_current: 0,
                attack_color: "B200FF",
                attack_full: 20,
                special: null,
                position: "F",
                opponent_img_id: '007'
            }
        ]
    }
}