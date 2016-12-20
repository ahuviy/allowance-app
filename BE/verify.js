/******************************************************************************
 * This is the verification module that supports JSON web tokens
 * and helps to validate users using JSON web tokens.
 *****************************************************************************/

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');

// Sign a new token for a supplied user. Returns the signed token.
exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        expiresIn: '365d'
    });
};

// Verify that the parent is logged-in and in the 'Users' database.
// Inserts the decoded token in the request object (request.decoded).
exports.verifyParent = (req, res, next) => {
    
    // check header or url-parameters or body for token
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
                next(err);
            } else {
                // if everything is good, save to the request object
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token, return an error
        var err = new Error('No token provided!');
        err.status = 403;
        next(err);
    }
};