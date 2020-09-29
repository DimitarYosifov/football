// // import LineUps from "./LineUps.js";
// // import Card from "./LevelCards.js";
// // import SetBackground from "./SetBackground.js";
// // import Level from "./Level.js";

// export default class MatchPoint {


//     constructor(card, matches) {

//         this.colors = {
//             'FF1D00': "ball_red",     // RED:
//             '3052FF': "ball_blue",    // BLUE:
//             '2F7F07': "ball_green",   // GREEN:
//             'E2D841': "ball_yellow",  // YELLOW:
//             'FF9702': "ball_orange",  // ORANGE
//             'B200FF': "ball_purple"   // PURPLE:
//         }

//         this.card = card;
//         this.matches = matches;

//         this.defenceColor = this.colors[card.stats.defense_color];
//         this.attackColor = this.colors[card.stats.attack_color];
//         this.def_points = matches.filter(e => e.type === this.defenceColor).length;
//         this.atk_points = matches.filter(e => e.type === this.attackColor).length;

//         this.cardImg = card.children[0]

//         this.initialScaleX = this.cardImg.scale.x;
//         this.initialScaley = this.cardImg.scale.y;
//     }


//     checkDefensePoints() {
//         if (this.def_points > 0) {




//             this.card.stats.defense_current += def_points;
//             this.card.getChildByName("defenseValuesText").text = `${this.card.stats.defense_current}/${this.card.stats.defense_full}`;
//             this.cardImg.tint = "0x" + this.card.stats.defense_color;
//             TweenMax.to(this.cardImg, .15, {
//                 delay: .7,
//                 onComplete: () => {
//                     this.cardImg.tint = 16777215
//                 }
//             });

//             TweenMax.to(this.cardImg.scale, .15, {
//                 x: initialScaleX * 1.05,
//                 y: initialScaley * 1.05,
//                 yoyo: true,
//                 repeat: 1
//             })




//             //TODO  create separate class for this and add some delay between text tweens
//             let def_text = new PIXI.Text("+" + this.def_points, {
//                 fontFamily: this.config.mainFont,
//                 fontSize: this.cardImg.height / 2,
//                 fill: '#' + this.card.stats.defense_color,
//                 align: 'center',
//                 stroke: '#000000',
//                 strokeThickness: 3
//             });
//             def_text.position.set(this.cardImg.x + this.cardImg.width / 2, this.cardImg.y + this.cardImg.height / 2);
//             def_text.anchor.x = 0.5;
//             def_text.anchor.y = 0.5;

//             this.stage.addChild(def_text);// TODO add picture to +3 for example!!!

//             TweenMax.to(def_text, 1.5, {
//                 y: this.height / 2,
//                 // alpha: 0.75,
//                 ease: Linear.easeNone,  //TODO... change ease
//                 onComplete: () => {
//                     def_text.alpha = 0;
//                 }
//             })


//         }
//     }
// }