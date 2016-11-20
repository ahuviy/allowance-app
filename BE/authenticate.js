/*****************************************************************************
 * CONFIGURE PASSPORT AUTHENTICATION VIA LOCAL-STRATEGY
 * - THIS STRATEGY USES A COMBINATION OF 'PASSPORT', 'PASSPORT-LOCAL',
 *   AND 'PASSPORT-LOCAL-MONGOOSE' MODULES.
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
