var express = require('express');
var morgan = require('morgan');
var wikiRouter = require('./routes/wiki.js');
var models = require('./models');
var swig = require('swig');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
// var pg = require('pg');
// var conString = 'postgres://localhost:5432/wikistack';
// var client = new pg.Client(conString);
// client.connect();

var app = express();


app.set('views', path.join(__dirname, '/views')); // where to find the views
app.set('view engine', 'html'); // what file extension do our templates have
app.engine('html', swig.renderFile); // how to render html templates
swig.setDefaults({ cache: false });

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

app.use(express.static(path.join(__dirname, '/public')));

app.use('/wiki', wikiRouter);

//------------- database config --------------

models.User.sync({})
.then(function () {
    return models.Page.sync({});
})
.then(function () {
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);


// // start the server
// var server = app.listen(1337, function(){
//   console.log('listening on port 1337');
// });
