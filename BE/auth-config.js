/*****************************************************************************
 * Configure passport authentication via local-strategy.
 * This strategy uses a combination of 'passport', 'passport-local',
 * and 'passport-local-mongoose' modules
 *****************************************************************************/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var usersModel = require('./models/users');

// Here, we are using a function provided by passport-local-mongoose
// to set-up the passport local-strategy.
exports.local = passport.use(new LocalStrategy(usersModel.authenticate()));

// Set-up the passport functions that enter a user into a session.
// Here, we are using functions provided by passport-local-mongoose.
passport.serializeUser(usersModel.serializeUser());
passport.deserializeUser(usersModel.deserializeUser());


// TODOahuvi: configure loginWithFacebook