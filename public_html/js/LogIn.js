"use strict";
export default class LogIn {

    constructor(app) {

        this.stage = app.stage;
        this.stage.alpha = 0;
        this.app = app;

        //apply inputs style
        this.wrapper = document.querySelector("#wrapper");
        this.wrapper.style.width = this.app.width * 0.8 + "px";
        this.wrapper.style.height = this.app.height / 5 + "px";
        this.wrapper.style.opacity = 0;
        this.wrapper.style.pointerEvents = "none";

        this.username = document.querySelector("#username");
        this.username.style.marginBottom = app.height * 0.05 + "px";
        this.username.oninput = this.inputLength;

        this.password = document.querySelector("#password");
        this.password.oninput = this.inputLength;

//      GO BUTTON
        this.goBtnStyle = new PIXI.TextStyle({
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height * 0.06 + "px",
            fontWeight: 'bold',
            fill: ['#ffffff'],
            dropShadow: true,
            dropShadowColor: '#c3c3c3',
            dropShadowBlur: 1,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 1,
            wordWrap: true,
            wordWrapWidth: 800,
            padding: 10
        });
        this.goText = new PIXI.Text("Go", this.goBtnStyle);
        this.goText.x = app.width * 0.90 - this.goText.width //* 0.5;
        this.goText.y = app.height * 0.47;
        this.goText.buttonMode = true;
        this.goText.interactive = false;
        this.goText.on("pointerdown", () => {
            this.validate();
        });
        this.goText.alpha = 0;
        this.stage.addChild(this.goText);
//      BUTTON  LOGIN
        this.btnStyle = new PIXI.TextStyle({
            fontFamily: this.app.config.mainFont,
            fontSize: this.app.height * 0.04 + "px",
            fontWeight: 'bold',
            fill: ['#ffffff'],
            dropShadow: true,
            dropShadowColor: '#c3c3c3',
            dropShadowBlur: 1,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 1,
            wordWrap: true,
            wordWrapWidth: 800,
            padding: 10
        });
        this.loginText = new PIXI.Text("Login", this.btnStyle);
        this.loginText.x = app.width * 0.9 - this.loginText.width //* 0.5;
        this.loginText.y = app.height * 0.57;
        this.loginText.buttonMode = true;
        this.loginText.interactive = true;
        this.loginText.on("pointerdown", () => {
            this.action = "login";
            this.registerText.interactive = true;
            this.enableInputs();
            TweenMax.to(this.registerText, 0.5, {alpha: 0.5});
            TweenMax.to(this.loginText, 0.5, {alpha: 1});
            this.loginText.interactive = false;
        });
        this.stage.addChild(this.loginText);
//      BUTTON  REGISTER
        this.registerText = new PIXI.Text("Register", this.btnStyle);
        this.registerText.x = app.width * 0.9 - this.registerText.width //* 0.5;
        this.registerText.y = app.height * 0.63;
        this.registerText.buttonMode = true;
        this.registerText.interactive = true;
        this.registerText.on("pointerdown", () => {
            this.action = "register";
            this.enableInputs();
            TweenMax.to(this.loginText, 0.5, {alpha: 0.5});
            TweenMax.to(this.registerText, 0.5, {alpha: 1});
            this.registerText.interactive = false;
            this.loginText.interactive = true;
        });
        this.stage.addChild(this.registerText);
        this.wrapper.style.display = "block";

        TweenMax.delayedCall(1.2, () => {
            TweenMax.to(this.wrapper, 0.5, {opacity: 0.6});
            TweenMax.to(this.stage, 0.5, {alpha: 1});
        })

    }

    enableInputs = () => {
        TweenMax.to(this.wrapper, 0.5, {opacity: 1});
        this.wrapper.style.pointerEvents = "auto";
        if (!this.picked) {
            TweenMax.to(this.loginText, 0.5, {y: this.app.height * 0.63, x: this.app.width * 0.9 - this.loginText.width / 2});
            TweenMax.to(this.loginText.scale, 0.5, {y: .5, x: .5});
            TweenMax.to(this.registerText, 0.5, {y: this.app.height * 0.69, x: this.app.width * 0.9 - this.registerText.width / 2});
            TweenMax.to(this.registerText.scale, 0.5, {y: .5, x: .5});
            TweenMax.to(this.goText, 1, {alpha: 0.6});
        }
        this.picked = true;
    }

    validate() {
        $.ajax({
            url: "https://determined-edison-e0fe82.netlify.com/login", //login or register
            type: 'POST',
//            mode: 'cors',
            contentType: 'application/json',
//            Accept: 'application/json',
//            Origin: "http://localhost:3000",
//            "Access-Control-Allow-Origin": "*",
            data: JSON.stringify({user: this.username.value, pass: this.password.value}),
            success: (res) => {
                if (res.nameInUse) {
                    this.clearUserInput();
                    window.alert("name in use!"); //TODO... 
                    return;
                }
                if (res.authorized) {
                    localStorage.setItem("match3football", res.storageItem);
                    TweenMax.to(this.wrapper, 0.7, {opacity: 0});
                    TweenMax.to(this.stage, 0.7, {alpha: 0, onComplete: () => {
                            this.stage.removeChildren();
                            this.app.startLevel();
                            TweenMax.killAll();
                            this.wrapper.remove();
                            this.wrapper.style.display = "none"
                        }});
                } else if (!res.authorized) {
                    this.clearUserInput();
                    window.alert("invalid username or password!"); //TODO...
                }
            }
        });
    }

    clearUserInput() {
        this.username.value = "";
        this.password.value = "";
        this.inputLength();
    }

//on input change. if any is empty, disable GO btn
    inputLength = () => {
        if (this.username.value === "" || this.password.value === "") {
            this.goText.disabled = true;
            TweenMax.to(this.goText, 0.15, {alpha: 0.6, interactive: false});
            return;
        }
        TweenMax.to(this.goText, 0.3, {alpha: 1, interactive: true});
    }
}