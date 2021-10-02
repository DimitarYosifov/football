import { clubSelection } from "./clubSelection.js";
import Background from "./Background.js";
import GameTexture from "./GameTexture.js";
import Particles from "./AddParticles.js";

export default class modeSelection {

    constructor(app) {
        this.app = app;
        this.app.stage.alpha = 0;
        this.app.stage.visible = true;
        this.targetX = this.app.width / 2;
        this.addBG();
        this.addFriendly();
        this.addLeague();
        this.setParticleConfigs();
        TweenMax.delayedCall(1, () => {
            const loadingWrapper = document.getElementById("loading-wrapper");
            if (loadingWrapper) { loadingWrapper.remove() };
            TweenMax.to(app.stage, 1, {
                alpha: 1, onComplete: () => {
                    this.createFlyingBall();
                    this.createflyingBallTimeline();
                }
            });
        });
    }

    addBG() {
        this.backgroundImg = new Background(this.app, {
            gamePhase: "modeSelection",
            sprite: new GameTexture(this.app, "bg909"),
            bg_x: -this.app.width * 0.005,
            bg_y: -this.app.height * 0.005,
            bg_width: this.app.width * 1.005,
            bg_height: this.app.height * 1.005
        });
        this.app.stage.addChild(this.backgroundImg);
    }

    addFriendly() {
        this.friendly = new PIXI.Text("Friendly", {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 13,
            fill: '#000000',
            align: 'center',
            stroke: '#ffffff',
            fontWeight: 800,
            lineJoin: "bevel",
            strokeThickness: 6
        });

        this.friendly.position.set(-this.friendly.width / 2, this.app.height * 0.45);
        this.friendly.anchor.set(0.5, 0.5);
        this.friendly.interactive = true;
        this.friendly.on('pointerup', () => {
            this.modeSelected("friendly");
        })
        const friendlyScale = this.friendly.scale.x;
        this.friendly.on('pointerover', () => {
            TweenMax.to(this.friendly.scale, 0.15,
                {
                    x: friendlyScale * 1.05,
                    y: friendlyScale * 1.05
                });
        })
        this.friendly.on('pointerout', () => {
            TweenMax.to(this.friendly.scale, 0.15,
                {
                    x: friendlyScale,
                    y: friendlyScale
                });
        })
        this.app.stage.addChild(this.friendly);
    }

    addLeague() {
        this.league = new PIXI.Text("League", {
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height / 13,
            fill: '#000000',
            align: 'center',
            stroke: '#ffffff',
            fontWeight: 800,
            lineJoin: "bevel",
            strokeThickness: 6
        });
        this.league.position.set(this.app.width + this.league.width / 2, this.app.height * 0.55);
        this.league.anchor.set(0.5, 0.5);
        this.league.interactive = true;
        this.league.on('pointerup', () => {
            this.modeSelected("league");

        })
        this.app.stage.addChild(this.league);
        const leagueScale = this.friendly.scale.x;
        this.league.on('pointerover', () => {
            TweenMax.to(this.league.scale, 0.15,
                {
                    x: leagueScale * 1.05,
                    y: leagueScale * 1.05
                });
        })
        this.league.on('pointerout', () => {
            TweenMax.to(this.league.scale, 0.15,
                {
                    x: leagueScale,
                    y: leagueScale
                });
        })
    }

    modeSelected(mode) {
        
        this.friendly.interactive = false;
        this.league.interactive = false;

        this.star_Particles();
        if (mode === "friendly") {
            TweenMax.to(this.league, 0.35,
                {
                    alpha: 0.3
                });
        } else {
            TweenMax.to(this.friendly, 0.35,
                {
                    alpha: 0.3
                });
        }

        TweenMax.delayedCall(1, () => {
            let friendlyTimeline = new TimelineMax();
            friendlyTimeline.to(this.league, 0.3,
                {
                    ease: Back.easeOut,
                    x: this.app.width + this.league.width / 2
                }
            );
            friendlyTimeline.to(this.app.stage, 0.5,
                {
                    alpha: 0,
                    onComplete: () => {
                        this.app.stage.removeChildren();
                        clubSelection(this.app, mode);
                    }
                }
            )
            let leagueTimeline = new TimelineMax();
            leagueTimeline.to(this.friendly, 0.3,
                {
                    delay: 0.1,
                    ease: Back.easeOut,
                    x: -this.friendly.width / 2
                }
            );
            leagueTimeline.to(this.app.stage, 0.5,
                {
                    alpha: 0
                }
            )
        })
    }

    //particles-----
    setParticleConfigs() {
        this.friendlyParticleConfig = {
            "alpha": {
                "start": 0.7,
                "end": 0
            },
            "scale": {
                "start": 0.05,
                "end": 0.1
            },
            "color": {
                "start": "#6c6c6c",
                "end": "#ababab"
            },
            "speed": {
                "start": 50,
                "end": 200
            },
            "startRotation": {
                "min": 270,
                "max": 270
            },
            "rotationSpeed": {
                "min": 0,
                "max": 0
            },
            "lifetime": {
                "min": 0.1,
                "max": 1.3
            },
            "blendMode": "normal",
            "frequency": 0.0005,
            "emitterLifetime": 0,
            "maxParticles": 5000,
            "pos": {
                "x": 0,
                "y": 0
            },
            "addAtBack": true,
            "spawnType": "rect",
            "spawnRect": {
                "x": this.app.x,
                "y": this.app.height * 0.43,
                "w": this.app.width * 0.26,
                "h": this.app.height * 0.05
            }
        }

        this.leagueParticleConfig = {
            "alpha": {
                "start": 0.7,
                "end": 0
            },
            "scale": {
                "start": 0.05,
                "end": 0.1
            },
            "color": {
                "start": "#6c6c6c",
                "end": "#ababab"
            },
            "speed": {
                "start": 50,
                "end": 200
            },
            "startRotation": {
                "min": 270,
                "max": 270
            },
            "rotationSpeed": {
                "min": 0,
                "max": 0
            },
            "lifetime": {
                "min": 0.1,
                "max": 1.3
            },
            "blendMode": "normal",
            "frequency": 0.0005,
            "emitterLifetime": 0,
            "maxParticles": 5000,
            "pos": {
                "x": 0,
                "y": 0
            },
            "addAtBack": true,
            "spawnType": "rect",
            "spawnRect": {
                "x": this.app.width * 0.7,
                "y": this.app.height * 0.53,
                "w": this.app.width * 0.30,
                "h": this.app.height * 0.05
            }
        }

        this.starParticleConfig = {
            "alpha": {
                "start": 0.8,
                "end": 0.1
            },
            "scale": {
                "start": 0.6,
                "end": 0.4
            },
            "color": {
                "start": "#6c6c6c",
                "end": "#ababab"
            },
            "speed": {
                "start": 750,
                "end": 50
            },
            "startRotation": {
                "min": 0,
                "max": 360
            },
            "rotationSpeed": {
                "min": 0,
                "max": 360
            },
            "lifetime": {
                "min": 0.75,
                "max": 1.25
            },
            "blendMode": "normal",
            "frequency": 0.002,
            "emitterLifetime": 0,
            "maxParticles": 1000,
            "pos": {
                "x": this.app.width * 0.5,
                "y": this.app.height * 0.5
            },
            "addAtBack": true,
            "spawnType": "circle",
            "spawnCircle": {
                "x": 0,
                "y": 0,
                "r": 0
            }
        }
    }

    startParticles() {
        //tween friendly text
        TweenMax.to(this.friendly, 0.4,
            {
                ease: Back.easeOut,
                x: this.targetX
            });
        //friendly particle
        let emitter = new Particles(this.app, this, this.friendlyParticleConfig, "flame");
        this.app.stage.addChild(emitter.container);
        emitter.update();

        TweenMax.delayedCall(0.2, () => {
            emitter.emitter.emit = false;
            TweenMax.delayedCall(1, () => {
                emitter.emitter.destroy();
                emitter.emitter.cleanup();
                this.app.stage.removeChild(emitter.container);
                emitter.update = () => { };
            });
        });
        //tween league text
        TweenMax.delayedCall(0.4, () => {
            TweenMax.to(this.league, 0.4,
                {
                    ease: Back.easeOut,
                    x: this.targetX,
                    onComplete: () => {
                        TweenMax.to(this.backgroundImg, 0.6, {
                            alpha: 0.6
                        })
                    }
                });
        });
        // league particle
        TweenMax.delayedCall(0.4, () => {
            let emitter = new Particles(this.app, this, this.leagueParticleConfig, "flame");
            this.app.stage.addChild(emitter.container);
            emitter.update();
            TweenMax.delayedCall(0.2, () => {
                emitter.emitter.emit = false;
                TweenMax.delayedCall(1, () => {
                    emitter.emitter.destroy();
                    emitter.emitter.cleanup();
                    this.app.stage.removeChild(emitter.container);
                    emitter.update = () => { };
                });
            });
        });
    }

    //flying ball
    createFlyingBall() {
        this.flyingBall = new GameTexture(this.app, "ball_prototype").sprite;
        this.flyingBall.anchor.set(0.5);
        this.flyingBall.height = this.app.height * 0.01;
        this.flyingBall.scale.x = this.flyingBall.scale.y;
        this.app.stage.addChildAt(this.flyingBall, 1);
        this.flyingBall.position.set(this.app.width / 2, this.app.height * 0.91);
    }

    createflyingBallTimeline() {
        let startW = this.flyingBall.width;
        let startH = this.flyingBall.height;

        this.flyingBallTimeline = new TimelineMax({ paused: false });
        this.flyingBallTimeline.timeScale(3.5);
        this.flyingBallTimeline.to(this.flyingBall, 1.5,
            {
                x: this.app.width / 2,
                y: this.app.height * 0.3,
                width: startW * 2.5,
                height: startH * 2.5,
                ease: Linear.easeNone
            }
        );
        this.flyingBallTimeline.to(this.flyingBall, 0.15,
            {
                y: this.app.height * 0.25,
                width: startW * 3.25,
                height: startH * 3.25,
                ease: Linear.easeNone
            }
        );
        this.flyingBallTimeline.to(this.flyingBall, 0.15,
            {
                y: this.app.height * 0.2,
                width: startW * 4,
                height: startH * 4,
                ease: Linear.easeNone
            }
        );
        this.flyingBallTimeline.to(this.flyingBall, 0.15,
            {
                y: this.app.height * 0.15,
                width: startW * 5,
                height: startH * 5,
                ease: Linear.easeNone
            }
        );
        this.flyingBallTimeline.to(this.flyingBall, 0.15,
            {
                y: this.app.height * 0.1,
                width: startW * 5.75,
                height: startH * 5.75,
                ease: Linear.easeNone
            }
        );
        this.flyingBallTimeline.to(this.flyingBall, 0.15,
            {
                y: this.app.height * 0.09,
                width: startW * 6.5,
                height: startH * 6.5,
                ease: Linear.easeNone
            }
        );
        this.flyingBallTimeline.to(this.flyingBall, 0.15,
            {
                y: this.app.height * 0.09,
                width: startW * 7.25,
                height: startH * 7.25,
                ease: Linear.easeNone
            }
        );
        this.flyingBallTimeline.to(this.flyingBall, 0.15,
            {
                y: this.app.height * 0.1,
                width: startW * 8,
                height: startH * 8,
                ease: Linear.easeNone
            }
        );
        this.flyingBallTimeline.to(this.flyingBall, 0.15,
            {
                y: this.app.height * 0.12,
                width: startW * 9,
                height: startH * 9,
                ease: Linear.easeNone,
                onStart: () => {
                    TweenMax.delayedCall(0.14, () => {
                        this.star_Particles();
                        TweenMax.delayedCall(0.4, () => {
                            this.startParticles();
                        })
                    })
                }
            }
        );

        this.flyingBallTimeline.to(this.flyingBall, 0.6,
            {
                y: this.app.height * 0.5,
                width: startW * 30,
                height: startH * 30,
                ease: Linear.easeNone
            }
        );
    }

    star_Particles() {
        let emitter = new Particles(this.app, this, this.starParticleConfig, "star-particle");
        this.app.stage.addChildAt(emitter.container, 1);
        emitter.update();

        TweenMax.delayedCall(0.3, () => {
            emitter.emitter.emit = false;
            TweenMax.delayedCall(1, () => {
                emitter.emitter.destroy();
                emitter.emitter.cleanup();
                this.app.stage.removeChild(emitter.container);
                emitter.update = () => { };
            });
        });
    }
}
