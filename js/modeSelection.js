import { clubSelection } from "./clubSelection.js";


export function modeSelection(app) {

    app.stage.alpha = 1;
    app.stage.visible = true;
    //BG
    let bg = new PIXI.Graphics();
    bg.beginFill(0x000000, 1);
    bg.drawRect(
        0,
        0,
        app.width,
        app.height
    );
    bg.endFill();
    app.stage.addChild(bg);

    let friendly = new PIXI.Text("Friendly", {
        fontFamily: app.config.mainFont,
        fontSize: app.height / 13,
        fill: '#000000',
        align: 'center',
        stroke: '#ffffff',
        fontWeight: 800,
        lineJoin: "bevel",
        strokeThickness: 6
    });
    friendly.position.set(app.width / 2, app.height * 0.4);
    friendly.anchor.set(0.5, 0.5);
    app.stage.addChild(friendly);
    friendly.interactive = true;
    friendly.on('pointerup', () => {
        app.stage.removeChildren();
        clubSelection(app, "friendly");
    })


    let league = new PIXI.Text("League", {
        fontFamily: app.config.mainFont,
        fontSize: app.height / 13,
        fill: '#000000',
        align: 'center',
        stroke: '#ffffff',
        fontWeight: 800,
        lineJoin: "bevel",
        strokeThickness: 6
    });
    league.position.set(app.width / 2, app.height * 0.5);
    league.anchor.set(0.5, 0.5);
    app.stage.addChild(league);
    league.interactive = true;
    league.on('pointerup', () => {
        app.stage.removeChildren();
        clubSelection(app, "league");
    })
}
