export default class LogIn {

    constructor(app) {
        this.stage = app.stage;


//USERNAME
        this.username = new PIXI.TextInput({
            input: {
                fontSize: '36px',
                padding: '12px',
                width: app.width * 0.8 + 'px',
                color: '#26272E'
            },
            box: {
                default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
                focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
                disabled: {fill: 0xDBDBDB, rounded: 12}
            }
        })
        this.username.disabled = true;
        this.username.alpha = 0.2;
        this.username.placeholder = 'Username'
        this.username.x = app.width * 0.08;
        this.username.y = app.height * 0.25
        this.stage.addChild(this.username)
        this.username.on('keydown', keycode => {
            console.log(this.username)
        })


        //PASSWORD
        this.password = new PIXI.TextInput({
            input: {
                fontSize: '36px',
                padding: '12px',
                width: app.width * 0.8 + 'px',
                color: '#26272E'
            },
            box: {
                default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
                focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
                disabled: {fill: 0xDBDBDB, rounded: 12}
            }
        })

        this.password.disabled = true;
        this.password.alpha = 0.2;
        this.password.placeholder = 'Password'
        this.password.x = app.width * 0.08;
        this.password.y = app.height * 0.4

        this.pass = ""

//        this.password.on('keydown', keycode => {
//            this.password.pass=this.password.text.slice(-1);
//        })

        this.password.on('keyup', keycode => {
            let asterisk = "*";
            let lastLetter = this.password.text.slice(-1);
            console.log(lastLetter);
            this.password.text = asterisk.repeat(this.password.text.length);
            this.pass += lastLetter;
        })
        this.stage.addChild(this.password)

//      BUTTON  LOGIN
        this.btnStyle = new PIXI.TextStyle({
//        fontFamily: fontFamily,
            fontSize: "36px", //make it percentage of width or height
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
        this.loginText.x = app.width * 0.92 - this.loginText.width //* 0.5;
        this.loginText.y = app.height * 0.55;
        this.loginText.buttonMode = true;
        this.loginText.interactive = true;
        this.loginText.on("pointerdown", () => {
//            this.enableInputs.apply([this.username, this.password]);
            this.enableInputs();

        });
        this.stage.addChild(this.loginText);

//      BUTTON  REGISTER
//        this.btnStyle = new PIXI.TextStyle({                                          //REPETATIVE!!!
////        fontFamily: fontFamily,
//            fontSize: "36px",    //make it percentage of width or height
//            fontWeight: 'bold',
//            fill: ['#ffffff'],
//            dropShadow: true,
//            dropShadowColor: '#c3c3c3',
//            dropShadowBlur: 1,
//            dropShadowAngle: Math.PI / 6,
//            dropShadowDistance: 1,
//            wordWrap: true,
//            wordWrapWidth: 800,
//            padding: 10
//        });
        this.registerText = new PIXI.Text("Register", this.btnStyle);
        this.registerText.x = app.width * 0.92 - this.registerText.width //* 0.5;
        this.registerText.y = app.height * 0.63;
        this.registerText.buttonMode = true;
        this.registerText.interactive = true;
        this.enableInputs.bind(this.registerText)
        this.registerText.on("pointerdown", () => {
//            this.enableInputs.apply([this.username, this.password])
            this.enableInputs();

//                        alert();
        });
        this.stage.addChild(this.registerText);
    }

    enableInputs = function () {

        TweenMax.to(this.username, 0.5, {alpha: 1});
        this.username.disabled = false;
        TweenMax.to(this.password, 0.5, {alpha: 1});
        this.password.disabled = false;
        this.username.focus();
    }

}

