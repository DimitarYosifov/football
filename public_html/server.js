const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const router = express.Router();
const app = express();
let port = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.disable('x-powered-by');
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(router);
app.use(bodyParser.urlencoded({extended: false}));
//app.use(cors());

app.post('/login', function (req, res) {
    let user = JSON.stringify(req.body.user);
    let pass = JSON.stringify(req.body.pass);
    res.set('Content-Type', 'application/json');
    res.status(200);

//TODO check db 
// hash and solt from this https://www.youtube.com/watch?v=Ud5xKCYQTjM
    res.json({
        authorized: true
    });
    res.send(`You sent: ${user}=== ${pass}`);
});

router.get('*', function (req, res, next) {
    res.render('index.html', {});
});
app.listen(port, function () {});






