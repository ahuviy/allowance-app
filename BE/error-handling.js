module.exports = function (err, req, res, next) {
    if (err.type === 'VerifyException') {
        res.status(err.status).json({ error: err });
    } else {
        console.log(err);
        console.log('unhandled error occured');
    }
};