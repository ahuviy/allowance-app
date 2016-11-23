/******************************************************************************
 * Server back-end main file
 *****************************************************************************/

/**
 * Initialize app and load modules
 */

var express = require('express');
var app = express();
var morgan = require('morgan');             // enables logging
var bodyParser = require('body-parser');    // parses json request-bodies
var config = require('./BE/config');        // contains app global vars

//-----------------------------------------------------------------------------

/**
 * Initialize MongoDB database
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');     // enables advanced mongoose promises
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected correctly to MongoDB server'));

//-----------------------------------------------------------------------------

/**
 * Configure passport authentication
 */

var passport = require('passport');
require('./BE/auth-config');    // configures the login strategies
app.use(passport.initialize());

//-----------------------------------------------------------------------------

// Refer static pages
app.use(express.static('FE/app'));

// enable server log messages
app.use(morgan('dev'));

// parse JSON request bodies
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
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server running on port ' + port);