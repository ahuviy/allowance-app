function ErrorHandler(err, req, res, next) {
    this.err = err;
    this.req = req;
    this.res = res;
    this.next = next;
}
ErrorHandler.prototype.handleExceptions = function () {
    switch (this.err.type) {
        case 'VerifyException':
            this._handleVerifyExceptions();
            break;
        case 'RouteException':
            this._handleRouteExceptions();
            break;
        default:
            this._defaultHandler();
    }
};
ErrorHandler.prototype._handleVerifyExceptions = function () {
    this.res.status(this.err.status).json({
        message: this.err.message || '',
        stack: this.err.stack || '',
        error: this.err
    });
};
ErrorHandler.prototype._handleRouteExceptions = function () {
    this.res.status(this.err.status).json({
        message: this.err.message || '',
        error: this.err.err || '',
        stack: this.err.stack || ''
    });
};
ErrorHandler.prototype._defaultHandler = function () {
    console.log(this.err);
    console.log('unhandled error occured');
};


module.exports = function (err, req, res, next) {
    var eh = new ErrorHandler(err, req, res, next);
    eh.handleExceptions();
};