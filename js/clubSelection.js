import { standingsView } from "./standingsView.js";

export function clubSelection(app, mode) {
    let clubs = [];
    let isPlayerTurn = true;
    let selectClub;

    let positions = [
        {
            x: app.width / 4,
            y: app.height * 0.5
        },
        {
            x: app.width * 0.75,
            y: app.height * 0.5
        },
        {
            x: app.width / 4,
            y: app.height * 0.85
        },
        {
            x: app.width * 0.75,
            y: app.height * 0.85
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

    $.ajax({
        url: "getAllClubsData",
        type: 'POST',
        contentType: 'application/json',
        success: (res) => {
            app.allClubs = res.clubs;
            createText(true);
            for (let clubIdx = 0; clubIdx < app.allClubs.length; clubIdx++) {
                showClub(app.allClubs[clubIdx], positions[clubIdx]);
            }
        }, error: (err) => {
            console.log(err);
        }
    });

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
            fontSize: app.height / 20,
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',
            fontWeight: 800,
            lineJoin: "bevel",
            strokeThickness: 6
        });
        name.position.set(
            position.x,
            position.y
        );
        name.anchor.set(0.5, 0.5);
        container.addChild(name);

        const logoTexture = app.loader.resources.logos.textures[`${club.clubData.logo}`];
        app.stage.alpha = 1;
        let logo = new PIXI.Sprite(logoTexture);
        logo.x = name.x;
        logo.y = name.y - name.height / 2;
        logo.height = app.height / 6;
        logo.scale.x = logo.scale.y;
        logo.anchor.set(0.5, 1);
        container.addChild(logo);
        logo.interactive = true;
        logo.on('pointerup', () => {
            container.visible = false;
            isPlayerTurn ? app.playerClubData = club.clubData : app.opponentClubData = club.clubData;
            app.stage.removeChild(selectClub);
            let friendly = mode === "friendly";
            // if (!friendly) {
            //     //TODO 
            //     // alert("League Selected")
            //     app.stage.removeChildren();
            //     standingsView.bind(app)(true);
            // }
            // else
             if (isPlayerTurn) {
                isPlayerTurn = false;
                createText(false);
            } else {
                app.stage.removeChildren();
                app.startLevel();
            }
        })

        let power = club.clubData.power;
        for (let s = 0; s < power; s++) {
            const starTexture = app.loader.resources.main1.textures[`star`];
            const star = new PIXI.Sprite(starTexture);
            star.height = app.height * 0.025;
            star.scale.x = star.scale.y;
            star.x = logo.x - star.width * s + star.width * power / 2;
            star.y = logo.y - logo.height;
            star.anchor.set(1, 1);
            container.addChild(star);
        }
    }
}
