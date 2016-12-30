/*****************************************************************************
 * User-defined custom exceptions
 *****************************************************************************/

function BaseException() { }
BaseException.prototype = Object.create(Error.prototype);
BaseException.prototype.capturePrettyStacktrace = function (length) {
    Error.stackTraceLimit = length;
    Error.captureStackTrace(this, this.constructor);
    this.stack = this.stack.split(/\n\s*at\s/).slice(1);
};


function VerifyException(message, status) {
    this.message = message || '';
    this.status = status || 500;
    this.capturePrettyStacktrace(100);
}
VerifyException.prototype = Object.create(BaseException.prototype);
VerifyException.prototype.name = 'VerifyException';
VerifyException.prototype.constructor = VerifyException;


function RouteException(err, message, status) {
    this.err = err || null;
    this.message = message || '';
    this.status = status || 500;
    this.capturePrettyStacktrace(100);
}
RouteException.prototype = Object.create(BaseException.prototype);
RouteException.prototype.name = 'RouteException';
RouteException.prototype.constructor = RouteException;


module.exports = {
    Verify: VerifyException,
    Route: RouteException
};