/******************************************************************************
 * Server back-end main file
 *****************************************************************************/

// Initialize app
var express = require('express');
var app = express();
var config = require('./BE/config');        // contains app global vars

// Initialize MongoDB database
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');     // enables advanced mongoose promises
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', console.log.bind(console, 'Connected correctly to MongoDB server'));

// Configure passport authentication
var passport = require('passport');
require('./BE/auth-config');
app.use(passport.initialize());

// Refer static pages
app.use(express.static('FE/app'));

// enable server log messages
var morgan = require('morgan');
app.use(morgan('dev'));

// parse JSON request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// REST API routing
var apiRouter = require('./BE/routes/apiRoutes');
app.use('/', apiRouter);

// Error handling
var errorHandler = require('./BE/error-handling');
app.use(errorHandler);

// Open the back-end server
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server running on port ' + port);