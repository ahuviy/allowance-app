/******************************************************************************
 * This is the verification module that supports JSON web tokens
 * and helps to validate users using JSON web tokens.
 *****************************************************************************/

var jwt = require('jsonwebtoken');
var config = require('./config');
var exceptions = require('./exceptions');

// exported functions
module.exports = {
    createToken: createToken,
    isLoggedIn: isLoggedIn
};

function createToken(user) {
    return jwt.sign(user, config.secretKey, { expiresIn: '365d' });
}

function isLoggedIn(req, res, next) {
    var token = req.headers['x-access-token'];
    try {
        if (!token) {
            throw new exceptions.Verify('No token provided', 403);
        }
        jwt.verify(token, config.secretKey, (err, decoded) => {
            if (err) {
                throw new exceptions.Verify('You are not authenticated', 401);
            }
            req.decoded = decoded;      // decoded token will now be available on the req object
            next();
        });
    }
    catch (err) {
        next(err);
    }
}