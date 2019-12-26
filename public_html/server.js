const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const router = express.Router();
const app = express();
const bcrypt = require('bcryptjs');
const firebase = require("firebase/app");
require('firebase/auth');
require('firebase/database');
let port = process.env.PORT || 3000;
app.set('views', path.join(__dirname, ''));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.disable('x-powered-by');
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(router);
app.use(bodyParser.urlencoded({extended: false}));
//app.use(cors());
router.get('*', function (req, res, next) {
    res.render('index.html', {});
});
const config_firebase = {
    apiKey: 'AIzaSyDYp_KxuwRFcXue0uk3Cz1it5rBr0PlsOA',
    authDomain: 'meeting-5a6ef.firebaseapp.com',
    databaseURL: 'meeting-5a6ef.firebaseio.com',
    storageBucket: 'meeting-5a6ef.appspot.com'
};
app.listen(port, function () {});

firebase.initializeApp(config_firebase);


app.post('/login', async  (req, res) => {

    let user = req.body.user;
    let pass = req.body.pass;

    firebase.database().ref("/users_game/").orderByChild("name").equalTo(user).once('value').then(function (snapshot) {

        let db_pass;
        res.set('Content-Type', 'application/json');
        try {
            db_pass = Object.values(snapshot.val())[0].password;
        } catch (e) {                                            // no such user
            db_pass = null;
            res.status(200);
            res.json({
                authorized: false
            });
//            res.send(`Not Allowed`);
            return;
        }

        bcrypt.compare(pass, db_pass, function (err, result) {
            if (err) {
                res.status(500);
                res.json({
                    authorized: false
                });
            } else if (!result) {
                res.status(200);
                res.json({
                    authorized: false
                });
            } else {
                res.status(200);
                res.json({
                    storageItem: db_pass,
                    authorized: true
                });
            }
        });
    });
});

app.post('/register', async (req, res) => {
    let user = req.body.user;
    let pass = req.body.pass;
//    is name already taken
    firebase.database().ref("/users_game/").orderByChild("name").equalTo(user).once('value').then(function (snapshot) {
        let name;
        try {
            name = Object.values(snapshot.val())[0].name;
            res.status(200);
            res.json({
                authorized: false,
                nameInUse: true
            });
            return;
        } catch (e) {
            name = null;
            tryRegistration();
        }
    });
    let tryRegistration = async () => {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(pass, salt);
            res.set('Content-Type', 'application/json');
            firebase.database().ref('/users_game/' + user).set({
                name: user,
                password: hashedPassword
            }, function (error) {
                if (error) {
                    res.status(200);
                    res.json({
                        authorized: false
                    });
                } else {
                    res.status(200);
                    res.json({
                        storageItem: hashedPassword,
                        authorized: true
                    });
                }
            });
        } catch (e) {
            res.status(500).send("error22");
        }
    };
});

app.post('/storageData', async (req, res) => {
    let data = req.body.data;
    firebase.database().ref("/users_game/").orderByChild("password").equalTo(data).once('value').then(function (snapshot) {
        res.status(200);
        res.json({
            authorized: Object.values(snapshot.val())[0].password !== undefined ? true : false
        });
    });
});













signOutUser = function () {
//    firebase.auth().signOut().then(function () {
//        $scope.user = '';
//        $scope.username = '';
//        $scope.img = '';
//        $state.go('home');
//    }, function (error) {
//        console.error('Sign Out Error', error);
//    });
};
//authStateChange
user = function (callback) {
    firebase.auth().onAuthStateChanged(function (firebaseUser) {
        if (firebaseUser) {
            console.log(firebaseUser);
            let user = firebaseUser.uid;
            callback(user, firebaseUser.email)
        } else {
            callback(null, null)
        }
    });
};