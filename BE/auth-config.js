/*****************************************************************************
 * Configure passport authentication via local-strategy.
 * This strategy uses a combination of 'passport', 'passport-local',
 * and 'passport-local-mongoose' modules
 *****************************************************************************/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('./models/users');

// Here, we are using a function provided by passport-local-mongoose
// to set-up the passport local-strategy.
passport.use(new LocalStrategy(UserModel.authenticate()));


// TODOahuvi: configure loginWithFacebook