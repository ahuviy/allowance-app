/******************************************************************************
 * This is the verification module that supports JSON web tokens
 * and helps to validate users using JSON web tokens.
 *****************************************************************************/

var jwt = require('jsonwebtoken');
var config = require('./config');

// exported functions
module.exports = {
    createToken: createToken,
    loggedIn: loggedIn
};

function createToken(user) {
    return jwt.sign(user, config.secretKey, { expiresIn: '365d' });
}

function loggedIn(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    try {
        if (!token) { throw new VerifyException('No token provided', 403); }
        
        jwt.verify(token, config.secretKey, (err, decoded) => {
            if (err) { throw new VerifyException('You are not authenticated', 401); }
            req.decoded = decoded;      // decoded token will now be available on the req object
            next();
        });
    }
    catch (err) { next(err); }
}

function VerifyException(message, status) {
    this.type = 'VerifyException';
    this.message = message || '';
    this.status = status || 500;
}
VerifyException.prototype = new Error();
