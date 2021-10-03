import { standingsView } from "./standingsView.js";
import { recordClubPlayersParams } from "./recordClubPlayersParams.js";
import { serverRequest } from "./Request.js"
import Background from "./Background.js";
import GameTexture from "./GameTexture.js";

export function clubSelection(app, mode) {
    let clubContainers = [];
    let isPlayerTurn = true;
    let selectClub;
    app.stage.alpha = 0;
    TweenMax.to(app.stage, 1, { alpha: 1 });
    let backgroundImg = new Background(app, {
        gamePhase: "level",
        sprite: new GameTexture(app, "bg435"),
        bg_x: -app.width * 0.005,
        bg_y: -app.height * 0.005,
        bg_width: app.width * 1.005,
        bg_height: app.height * 1.005
    });
    app.stage.addChild(backgroundImg);

    let positions = [
        {
            x: app.width / 4,
            y: app.height * 0.37
        },
        {
            x: app.width * 0.75,
            y: app.height * 0.37
        },
        {
            x: app.width / 4,
            y: app.height * 0.55
        },
        {
            x: app.width * 0.75,
            y: app.height * 0.55
        },
        {
            x: app.width / 4,
            y: app.height * 0.73
        },
        {
            x: app.width * 0.75,
            y: app.height * 0.73
        },
        {
            x: app.width / 4,
            y: app.height * 0.91
        },
        {
            x: app.width * 0.75,
            y: app.height * 0.91
        }
    ]

    //BG
    let bg = new PIXI.Graphics();
    bg.beginFill(0x000000, 0.75);
    bg.drawRect(
        0,
        0,
        app.width,
        app.height
    );
    bg.endFill();
    app.stage.addChild(bg);

    serverRequest(
        "getAllClubsData",
        'POST',
        'application/json',
    ).then(res => {
        app.allClubs = res.clubs;
        createText(true);
        for (let clubIdx = 0; clubIdx < app.allClubs.length; clubIdx++) {
            showClub(app.allClubs[clubIdx], positions[clubIdx]);
        }
    })

    let createText = () => {
        let text = isPlayerTurn ? "Select club" : "Select opponent"
        selectClub = new PIXI.Text(text, {
            fontFamily: app.config.mainFont,
            fontSize: app.height / 13,
            fill: '#000000',
            align: 'center',
            stroke: '#ffffff',
            fontWeight: 800,
            lineJoin: "bevel",
            strokeThickness: 6
        });
        selectClub.position.set(app.width / 2, app.height * 0.15);
        selectClub.anchor.set(0.5, 0.5);
        app.stage.addChild(selectClub);
    }

    let showClub = (club, position) => {
        let container = new PIXI.Container;
        app.stage.addChild(container);

        let name = new PIXI.Text(`${club.name}`, {
            fontFamily: app.config.mainFont,
            fontSize: app.height / 30,
            fill: '#ffffff',
            align: 'center',
            // stroke: '#000000',
            // fontWeight: 800,
            // lineJoin: "bevel",
            // strokeThickness: 6
        });

        name.position.set(
            position.x,
            position.y
        );
        name.anchor.set(0.5, 0.5);
        container.addChild(name);

        let logo = new GameTexture(app, `${club.clubData.logo}`).sprite;
        logo.x = name.x;
        logo.y = name.y - name.height / 2;
        logo.height = app.height / 10;
        logo.scale.x = logo.scale.y;
        logo.anchor.set(0.5, 1);
        container.addChild(logo);
        logo.interactive = true;
        logo.on('pointerup', () => {
            logo.interactive = false;
            isPlayerTurn ? app.playerClubData = club.clubData : app.opponentClubData = club.clubData;
            app.stage.removeChild(selectClub);
            app.friendly = mode === "friendly";
            if (!app.friendly) {
                clubContainers.forEach(element => {
                    if (element !== container) {
                        TweenMax.to(element, 1,
                            {
                                alpha: 0
                            }
                        );
                    } else {
                        let x = app.width / 2 - container.getLocalBounds().x - container.width / 2;
                        let y = app.height / 2 - container.getLocalBounds().y - container.height / 2;
                        TweenMax.to(container, 0.3,
                            {
                                delay: 1,
                                x: x,
                                y: y,
                                ease: Back.easeOut,
                                onComplete: () => {

                                    let w = app.stage.width;
                                    let h = app.stage.height;

                                    TweenMax.to(app.stage, 0.5,
                                        {
                                            x: -w,
                                            y: -h,
                                            width: w * 3,
                                            height: h * 3,
                                            ease: Bounce.easeOut,
                                            onComplete: () => {
                                                TweenMax.delayedCall(1, () => {
                                                    recordClubPlayersParams(app);
                                                    app.stage.removeChildren();
                                                    standingsView.bind(app)();
                                                    app.stage.width = w;
                                                    app.stage.height = h;
                                                    app.stage.x = 0;
                                                    app.stage.y = 0;
                                                })
                                            }
                                        },
                                    );
                                }
                            },
                        );
                    }
                });
            }
            else {
                if (isPlayerTurn) {
                    container.alpha = 0;
                    isPlayerTurn = false;
                    createText(false);
                } else {
                    app.stage.removeChildren();
                    app.isPlayerHome = true;
                    app.startLevel();
                }
            }
        })

        let power = club.clubData.power;
        for (let s = 0; s < power; s++) {
            const star = new GameTexture(app, `star`).sprite;
            star.height = app.height * 0.015;
            star.scale.x = star.scale.y;
            star.x = logo.x - star.width * s + star.width * power / 2;
            star.y = logo.y - logo.height;
            star.anchor.set(1, 1);
            container.addChild(star);
        }
        clubContainers.push(container);
    }
}
