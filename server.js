const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
const app = express();
const bcrypt = require('bcryptjs');
const firebase = require("firebase/app");
require('firebase/auth');
require('firebase/database');
let port = process.env.PORT || 3000;
app.set('views', path.join(__dirname, ''));
app.disable('x-powered-by');
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(router);
app.use(bodyParser.urlencoded({ extended: false }));
router.get('*', function (req, res, next) {
    res.render('index.html', {});
});
const config_firebase = {
    apiKey: 'AIzaSyB6CoLU9BDQyk998IlqyIY7cVwSR-fvsSw',
    authDomain: 'football-d4256.firebaseapp.com',
    databaseURL: 'football-d4256.firebaseio.com',
    storageBucket: 'football-d4256.appspot.com'
};
app.listen(port, function () { });

firebase.initializeApp(config_firebase);

app.post('/login', async (req, res) => {

    let user = req.body.user;
    let pass = req.body.pass;

    firebase.database().ref("/users/").orderByChild("name").equalTo(user).once('value').then(function (snapshot) {

        let db_pass;
        res.set('Content-Type', 'application/json');
        //        res.set( "Access-Control-Allow-Origin", "*",);
        try {
            db_pass = Object.values(snapshot.val())[0].password;
        } catch (e) { // no such user
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
    firebase.database().ref("/users/").orderByChild("name").equalTo(user).once('value').then(function (snapshot) {
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
            firebase.database().ref('/users/' + user).set({
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
            res.status(500).send("error_");
        }
    };
});

app.post('/storageData', async (req, res) => {
    let data = req.body.data;
    firebase.database().ref("/users/").orderByChild("password").equalTo(data).once('value').then(function (snapshot) {
        res.set('Content-Type', 'application/json');
        res.status(200);
        res.json({
            authorized: Object.values(snapshot.val())[0].password !== undefined ? true : false
        });
    });
});

app.post('/getAllClubsData', async (req, res) => {
    firebase.database().ref("/clubs/").once('value').then(function (snapshot) {
        res.set('Content-Type', 'application/json');
        res.status(200);
        res.json({
            clubs: Object.values(snapshot.val())
        });
    });
});

app.post('/addClub', async (req, res) => {
    let name = req.body.name;
    let clubData = req.body.clubData;
    let players = req.body.players;

    firebase.database().ref('/clubs/' + name).set({
        name: name,
        clubData: clubData,
        players: players
    }, function (error) {
        if (error) {
            res.set('Content-Type', 'application/json');
            res.status(500);
            res.json({
                success: false
            });
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200);
            res.json({
                success: true,
                //                players:
            });
        }
    });
});

app.post('/getClubsPlayers', async (req, res) => {
    let name = req.body.name;
    firebase.database().ref("/clubs/").orderByChild("name").equalTo(name).once('value').then(function (snapshot) {
        res.status(200);
        res.json({
            clubData: Object.values(snapshot.val())[0]
        });
    });
});

app.post('/getClubData', async (req, res) => {
    let name = req.body.name;
    firebase.database().ref("/clubs/").orderByChild("name").equalTo(name).once('value').then(function (snapshot) {
        res.status(200);
        res.json({
            clubData: Object.values(snapshot.val())[0].clubData
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