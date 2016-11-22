/******************************************************************************
 * SERVER BACK-END MAIN-FILE
 *****************************************************************************/

// load modules
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');

// load config file
var config = require('./BE/config');

// load bluebird to enable advanced mongoose promises
mongoose.Promise = require('bluebird');

//-----------------------------------------------------------------------------

// configure passport authentication
var authenticate = require('./BE/authenticate');

//-----------------------------------------------------------------------------

// initialize app and globals
var app = express();
var port = process.env.PORT || 3000;

//-----------------------------------------------------------------------------

// open connection to the MongoDB database server
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { console.log('Connected correctly to MongoDB server'); });

//-----------------------------------------------------------------------------

// passport config
app.use(passport.initialize());

//-----------------------------------------------------------------------------

// Refer static pages from the /FE/app directory
app.use(express.static('FE/app'));

//-----------------------------------------------------------------------------

// use some middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

//-----------------------------------------------------------------------------

/**
 * REST API routing
 */

// get the routes
var apiRouter = require('./BE/routes/apiRoutes');

// mount the routes
app.use('/', apiRouter);

//-----------------------------------------------------------------------------

// Open the back-end server
app.listen(port);
console.log('server running on port ' + port);