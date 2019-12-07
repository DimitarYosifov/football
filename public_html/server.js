const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();
let port = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 
app.engine('html', require('ejs').renderFile); 
app.disable('x-powered-by');
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
const router = express.Router();
router.get('*', function (req, res, next) {
    res.render('index.html', {});
});
app.listen(port, function () {});



