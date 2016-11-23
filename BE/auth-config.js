/*****************************************************************************
 * Configure passport authentication via local-strategy.
 * This strategy uses a combination of 'passport', 'passport-local',
 * and 'passport-local-mongoose' modules
 *****************************************************************************/

/**
 * Grab modules
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var usersModel = require('./models/users');

//----------------------------------------------------------------------------

/**
 * Export the strategy for local authentication
 */
exports.local = passport.use(new LocalStrategy(usersModel.authenticate()));
passport.serializeUser(usersModel.serializeUser());
passport.deserializeUser(usersModel.deserializeUser());