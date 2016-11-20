/******************************************************************************
 * This is the verification module that supports JSON web tokens
 * and helps to validate users using JSON web tokens.
 *****************************************************************************/

/**
 * Grab modules
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');

//-----------------------------------------------------------------------------

/**
 * Sign a new token for a supplied user.
 * Token is valid for 1h. Accepts user-info. Returns the signed token.
 */
exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        expiresIn: '365d' // valid for 1 year
    });
};

//-----------------------------------------------------------------------------

/**
 * Verify that the parent is logged-in and in the 'Users' database.
 * Inserts the decoded token in the request object (request.decoded).
 */
exports.verifyParent = (req, res, next) => {
    // check header or url-parameters or post-parameters for token
    var token = req.body.token ||
                req.query.token ||
                req.headers['x-access-token'];
    
    // decode token
    if (token) {
        // verifies secret and checks expiration
        jwt.verify(token, config.secretKey, (err, decoded) => {
            if (err) {
                err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to the request object
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token, return an error
        var msg = 'No token provided!';
        console.log(msg);
        var err = new Error(msg);
        err.status = 403;
        return next(err);
    }
};