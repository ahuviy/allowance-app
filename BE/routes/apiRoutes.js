// get the modules
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const passport = require('passport');
const Promise = require('bluebird'); // use bluebird promises

// load db-models
const accountsModel = require('../models/accounts');
const transactionsModel = require('../models/transactions');
const usersModel = require('../models/users');
const uniqueModel = require('../models/uniqueAccountNumbers.js');

// use body-parser middleware to parse json requests
router.use(bodyParser.json());

// this module manages the JSON web-tokens and verifies user identities
const Verify = require('../verify');

/******************************************************************************
 * API
 *****************************************************************************/

/**
 * loginWithUsername
 */
router.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { next(err); }

        /**
         * Passport-local-mongoose attempts to validate the user. If validation
         * fails, user = false. If validation succeeds, user contains the user-model
         * for the user attempting to log-in.
         */

        // validation failed, will return a 401, "Password or username are incorrect"
        if (!user) {
            return res.status(401).json({ error: info.message });
        }

        // validation succeeded, define a custom callback
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Could not log in user' });
            }

            // Create a private token for the user and send it
            var token = Verify.getToken({
                "username": user.username,
                "name": user.name
            });
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req, res, next);
});

//-----------------------------------------------------------------------------

/**
 * addParent
 * Register a new parent-user. The user info is in the body of the request (json).
 * Server expects: 'username', 'password', 'name'
 * Optional field: 'email'
 */
router.post('/api/register', (req, res) => {
    var opt = {
        username: req.body.username,
        name: req.body.name,
        type: 'parent'
    };
    usersModel.register(new usersModel(opt), req.body.password, (err, parent) => {

        // error will almost certainly occur if the username already exists
        if (err) { return res.status(409).json({ error: err }); }

        if (req.body.email) { parent.email = req.body.email; }

        // save the new user
        parent.save((err) => {
            if (err) { return res.status(500).json({ error: err }); }
            passport.authenticate('local')(req, res, () => {
                return res.status(200).json({ status: 'Registration Successful!' });
            });
        });
    });
});

//-----------------------------------------------------------------------------

/**
 * loginWithFacebook - TODOahuvi
 */

//-----------------------------------------------------------------------------

/**
 * getChildren
 */
router.get('/api/children/:parentUsername', Verify.verifyParent, (req, res) => {
    usersModel
        .findOne({ username: req.params.parentUsername })
        .then(parent => usersModel.find({ parentId: parent._id }))
        .then(children => {
            res.status(200).send({
                children: children,
                parentName: req.decoded.name
            });
        });
});

//-----------------------------------------------------------------------------

/**
 * getChildById
 */
router.get('/api/children/get/:childId', Verify.verifyParent, (req, res) => {
    Promise
        .join(
        accountsModel.findOne({ userId: req.params.childId }),
        transactionsModel.find({ userId: req.params.childId }),
        usersModel.findById(req.params.childId),
        (account, transactions, user) => {
            res.json({
                account: account,
                transactions: transactions,
                user: user
            });
        })
        .catch(err => res.status(500).json(err));
});

//-----------------------------------------------------------------------------

/**
 * addChild
 */
router.post('/api/children/:parentUsername', Verify.verifyParent, (req, res) => {
    // find the parent-user
    var parentPromise = usersModel
        .findOne({ username: req.params.parentUsername })
        .catch(err => res.status(500).send({
            msg: 'error finding parent',
            err: err
        }));

    // create the child user
    var childPromise = parentPromise
        .then(parent => {
            var promise = usersModel.create({
                username: req.body.accountNo, // username is the account no.
                password: req.body.password,
                name: req.body.name,
                type: 'child',
                childrenIds: [],
                parentId: parent._id,
                fbUserId: '',
                email: ''
            });
            return promise;
        })
        .catch(err => res.status(500).send({
            msg: 'error creating child',
            err: err
        }));

    // add the childId to the parent-user childrenIds array
    Promise.join(parentPromise, childPromise, (parent, child) => {
        parent.childrenIds.push(child._id);
        parent.save();
    });

    // create the child account
    var accountPromise = childPromise
        .then(child => {
            var promise = accountsModel.create({
                userId: child._id, // from the child-user just created
                name: req.body.name,
                interestRate: req.body.interestRate,
                rebateRate: req.body.rebateRate,
                balance: 0,
                allowance: 'none',
                allowanceAmount: 0
            });
            return promise;
        })
        .catch(err => res.status(500).send({
            err: err,
            msg: 'error creating account'
        }));

    // respond with the child-user
    Promise
        .join(childPromise, accountPromise, (child, account) => {
            res.status(200).send(child);
        })
        .catch(err => res.status(500).send(err));
});

//-----------------------------------------------------------------------------

/**
 * updateChild
 */
router.post('/api/account/:childId/update', Verify.verifyParent, (req, res) => {
    console.log('received updateChild request');

    // update child account
    accountsModel.update({ userId: req.body.userId }, {
        $set: {
            name: req.body.name,
            interestRate: req.body.interestRate,
            rebateRate: req.body.rebateRate
        }
    }, (err, rawResponse) => {
        if (err) { res.status(500).json(err); }
        console.log('finished modifying the child account');

        // update child user
        usersModel.update({ _id: req.body.userId }, {
            $set: {
                name: req.body.name,
                password: req.body.password
            }
        }, (err, rawResponse) => {
            if (err) { res.status(500).json(err); }
            console.log('finished modifying the child user');

            // respond with newChild data
            res.status(200).send('Successfully updated child');
        });
    });
});

//-----------------------------------------------------------------------------

/**
 * deleteChild
 */
router.get('/api/account/:childId/delete', Verify.verifyParent, (req, res) => {
    var childPromise = usersModel
        .findById(req.params.childId)
        .catch(err => res.status(500).send({
            err: err,
            msg: 'can not find child'
        }));
    var parentPromise = childPromise
        .then(child => usersModel.findById(child.parentId))
        .catch(err => res.status(500).send({
            err: err,
            msg: 'can not find parent'
        }));
    Promise.join(
        childPromise,
        parentPromise,
        (child, parent) => {
            // remove childId from parent childId array
            parent.childrenIds = parent.childrenIds.filter(id => id.toString() !== child._id.toString());
            parent.save();
            // recycle the account-no
            uniqueModel.create({ number: child.username });
        })
        .catch(err => res.status(500).send({
            err: err,
            msg: 'problem in recycling account-no or removing childId from parent array' 
        }))
        .then(() => {
            // delete child account/transactions/user
            accountsModel.remove({ userId: req.params.childId }, () => {
                transactionsModel.remove({ userId: req.params.childId }, () => {
                    usersModel.remove({ _id: req.params.childId }, () => {
                        res.json('successfully deleted child');
                    });
                });    
            });
        });
});

//-----------------------------------------------------------------------------

/**
 * deposit
 */
router.post('/api/account/:accountId/deposit', Verify.verifyParent, (req, res) => {

    // set 'performedBy' field to parentId instead of parentUsername
    usersModel.findOne({ username: req.body.performedBy }, (err, parentUser) => {
        if (err) { res.status(500).send('db error'); }
        req.body.performedBy = parentUser._id;

        // check whether to set allowance or perform a deposit
        if (req.body.depositType !== 'single') {
            /**
             * SET ALLOWANCE
             */
            // modify allowance
            console.log('modifying the account allowance');

            // if sum is 0 allowance is set to 'none'
            var setAllowance = (req.body.sum === 0) ? 'none' : req.body.depositType;
            accountsModel.update({ userId: req.body.userId }, {
                $set: {
                    allowance: setAllowance,
                    allowanceAmount: req.body.sum
                }
            }, (err, rawResponse) => {
                if (err) { res.status(500).json(err); }
                console.log('finished modifying the account allowance');

                accountsModel.findOne({ userId: req.body.userId }, (err, account) => {

                    // respond with {account: accountObj, transaction: null}
                    res.json({
                        account: account,
                        transaction: null // there was no actual transaction
                    });
                });
            });
        } else {
            /**
             * PERFORM A DEPOSIT
             */
            // modify balance
            accountsModel.findOne({ userId: req.body.userId }, (err, account) => {
                console.log('updating account balance');
                account.balance = account.balance + req.body.sum;
                account.save((err, resp) => {
                    if (err) { res.status(500).json(err); }
                    console.log('finished updating account balance');

                    // add entry to the transactions
                    console.log('adding the new transaction');
                    transactionsModel.create(req.body, (err, transaction) => {
                        // respond with {accountObj, transactionsObj}
                        res.json({
                            account: account,
                            transaction: transaction
                        });
                    });
                });
            });
        }
    });

});

//-----------------------------------------------------------------------------

/**
 * withdraw
 */
router.post('/api/account/:accountId/withdraw', Verify.verifyParent, (req, res) => {

    // set 'performedBy' field to parentId instead of parentUsername
    usersModel.findOne({ username: req.body.performedBy }, (err, parentUser) => {
        if (err) { res.status(500).send('db error'); }
        req.body.performedBy = parentUser._id;

        // add entry to the transactions collection
        console.log('adding the new transaction');
        transactionsModel.create(req.body, (err, transaction) => {

            // modify the account balance
            accountsModel.findOne({ userId: transaction.userId }, (err, account) => {
                console.log('updating account balance');
                account.balance = account.balance - req.body.sum;
                account.save((err, resp) => {
                    if (err) { res.status(500).json(err); }

                    // respond with {accountObj, transactionsObj}
                    res.json({
                        account: account,
                        transaction: transaction
                    });
                });
            });
        });
    });
});

//-----------------------------------------------------------------------------

/**
 * WORKER FUNCTION:
 * INITIALIZE ACCOUNT NUMBER COLLECTION
 * Create a collection of unique account numbers. This is done only once.
 */
router.get('/api/account/init', (req, res) => {
    // TODOahuvi: generate using a smart algorithm:
    // get all the usernames that are numbers.
    // get all the available account numbers.
    // generate numbers that don't coincide with the current usernames or available
    // account numbers.
    initAccountNumCollection();

    function initAccountNumCollection() {
        for (var i = 100; i < 300; i++) {
            uniqueModel.create({ number: i });
        }
        res.status(200).send('generated new account numbers');
    }
});

//-----------------------------------------------------------------------------

/**
 * generateNewAccountNumber:
 * generate a new unique account number
 */
router.get('/api/account/generate', Verify.verifyParent, (req, res) => {
    // get a unique account number from the unique-model
    uniqueModel.findOne({}, (err, uniqueEntry) => {
        console.log('found a unique-account-number: ' + uniqueEntry.number);
        // remove the fetched unique entry from the db
        uniqueModel.remove({ number: uniqueEntry.number }, (err, resp) => {
            if (err) { res.status(500).json(err); }
            console.log('removed unique-account-number entry from db');
            // respond with the unique account-number
            // res.status(200).send(uniqueEntry.number);
            res.json(uniqueEntry.number);
        });
    });
});

//-----------------------------------------------------------------------------

/**
 * cancelNewAccountNumber:
 * cancel a uniquely generated account number
 */
router.post('/api/account/cancel/:accountNo', (req, res) => {
    uniqueModel.create({ number: req.params.accountNo }, (err, uniqueEntry) => {
        console.log('recycled the unique-account-number: ' + uniqueEntry.number);

        res.json(uniqueEntry.number);
    });
});

//-----------------------------------------------------------------------------

module.exports = router;