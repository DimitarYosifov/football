import { clubSelection } from "./clubSelection.js";
import Background from "./Background.js";
import GameTexture from "./GameTexture.js";

export function modeSelection(app) {
    app.stage.alpha = 0;
    setTimeout(() => {
        const loadingWrapper = document.getElementById("loading-wrapper");
        if (loadingWrapper) { loadingWrapper.remove() };
        TweenMax.to(app.stage, 1, { alpha: 1 });
    }, 1000);

    app.stage.visible = true;

    let backgroundImg = new Background(app, {
        gamePhase: "modeSelection",
        sprite: new GameTexture(app, "bg909"),
        bg_x: -app.width * 0.005,
        bg_y: -app.height * 0.005,
        bg_width: app.width * 1.005,
        bg_height: app.height * 1.005
    });
    app.stage.addChild(backgroundImg);

    let friendly = new PIXI.Text("Friendly", {
        fontFamily: "Girassol",
        // fontFamily: app.config.mainFont,
        fontSize: app.height / 13,
        fill: '#000000',
        align: 'center',
        stroke: '#ffffff',
        fontWeight: 800,
        lineJoin: "bevel",
        strokeThickness: 6
    });
    const targetX = app.width / 2
    friendly.position.set(-friendly.width / 2, app.height * 0.45);
    friendly.anchor.set(0.5, 0.5);
    friendly.interactive = true;
    friendly.on('pointerup', () => {
        selected("friendly");
    })
    const friendlyScale = friendly.scale.x;
    friendly.on('pointerover', () => {
        TweenMax.to(friendly.scale, 0.15,
            {
                x: friendlyScale * 1.05,
                y: friendlyScale * 1.05
            });
    })
    friendly.on('pointerout', () => {
        TweenMax.to(friendly.scale, 0.15,
            {
                x: friendlyScale,
                y: friendlyScale
            });
    })
    app.stage.addChild(friendly);

    TweenMax.delayedCall(1.35, () => {
        TweenMax.to(friendly, 0.3,
            {
                ease: Back.easeOut,
                x: targetX
            });
    });

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
    league.position.set(app.width + league.width / 2, app.height * 0.55);
    league.anchor.set(0.5, 0.5);
    league.interactive = true;
    league.on('pointerup', () => {
        selected("league");

    })
    app.stage.addChild(league);
    TweenMax.delayedCall(1.35, () => {
        TweenMax.to(league, 0.3,
            {
                ease: Back.easeOut,
                x: targetX
            });
    });
    const leagueScale = friendly.scale.x;
    league.on('pointerover', () => {
        TweenMax.to(league.scale, 0.15,
            {
                x: leagueScale * 1.05,
                y: leagueScale * 1.05
            });
    })
    league.on('pointerout', () => {
        TweenMax.to(league.scale, 0.15,
            {
                x: leagueScale,
                y: leagueScale
            });
    })

    let selected = (mode) => {
        let friendlyTimeline = new TimelineMax();
        friendlyTimeline.to(league, 0.3,
            {
                ease: Back.easeOut,
                x: app.width + league.width / 2
            }
        );
        friendlyTimeline.to(app.stage, 0.5,
            {
                alpha: 0,
                onComplete: () => {
                    app.stage.removeChildren();
                    clubSelection(app, mode);
                }
            }
        )
        let leagueTimeline = new TimelineMax();
        leagueTimeline.to(friendly, 0.3,
            {
                ease: Back.easeOut,
                x: -friendly.width / 2
            }
        );
        leagueTimeline.to(app.stage, 0.5,
            {
                alpha: 0
            }
        )
    }
}
