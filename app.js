const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const session = require('express-session');
const controllers = require('./controllers/controllers.js');
const parseurl = require('parseurl');
const routes = require('./router');
const path = require('path');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//register session
// app.use(session({
//   secret: 'unicorn cats',
//   resave: false,
//   saveUninitialized: true
// }));

//require user to be logged in
// app.use(req, res, next){
//   let pathname = parseurl(req).pathname;
//   ...
// }

routes(app);



app.listen(3000);
