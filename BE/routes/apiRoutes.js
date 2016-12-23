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
const verify = require('../verify');


/******************************************************************************
 * API
 *****************************************************************************/


router.post('/api/login', loginWithUsername);

function loginWithUsername(req, res, next) {
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
            var token = verify.createToken({
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
}


// Server expects body to contain (JSON): 'username', 'password', 'name'. Optional field: 'email'
router.post('/api/register', addParent);

function addParent(req, res) {
    usersModel.register(new usersModel({
        username: req.body.username,
        name: req.body.name,
        type: 'parent',
        email: req.body.email || ''
    }), req.body.password, (err, parent) => {
        if (err) {
            // error will almost certainly occur if username already exists
            res.status(409).json({ error: err });
        }

        parent.save((err) => {
            if (err) { res.status(500).json({ error: err }); }
            passport.authenticate('local')(req, res, () => {
                res.status(200).json({ status: 'Registration Successful!' });
            });
        });
    });
}


// TODOahuvi: loginWithFacebook


router.get('/api/children/:parentUsername', verify.loggedIn, getChildren);

function getChildren(req, res) {
    usersModel
        .findOne({ username: req.params.parentUsername })
        .then(parent => usersModel.find({ parentId: parent._id }))
        .then(children => {
            res.status(200).send({
                children: children,
                parentName: req.decoded.name
            });
        });
}


router.get('/api/children/get/:childId', verify.loggedIn, getChildById);

function getChildById(req, res) {
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
}


router.post('/api/children/:parentUsername', verify.loggedIn, addChild);

function addChild(req, res) {
    var findParentPromise = findParent();
    var createChildUserPromise = createChildUser(findParentPromise);
    var createChildAccountPromise = createChildAccount(createChildUserPromise);
    addChildIdToParentArray(findParentPromise, createChildUserPromise);
    respondWithChildUser(createChildAccountPromise, createChildUserPromise);

    function findParent() {
        return usersModel
            .findOne({ username: req.params.parentUsername })
            .catch(err => res.status(500).send({ msg: 'error finding parent', err: err }));
    }

    function createChildUser(findParentPromise) {
        return findParentPromise
            .then(parent => {
                var promise = usersModel.create({
                    username: req.body.accountNo,
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
            .catch(err => res.status(500).send({ msg: 'error creating child', err: err }));
    }

    function createChildAccount(createChildUserPromise) {
        createChildUserPromise
            .then(child => {
                var promise = accountsModel.create({
                    userId: child._id,
                    name: req.body.name,
                    interestRate: req.body.interestRate,
                    rebateRate: req.body.rebateRate,
                    balance: 0,
                    allowance: 'none',
                    allowanceAmount: 0
                });
                return promise;
            })
            .catch(err => res.status(500).send({ err: err, msg: 'error creating account' }));
    }

    function addChildIdToParentArray(findParentPromise, createChildUserPromise) {
        Promise.join(findParentPromise, createChildUserPromise, (parent, child) => {
            parent.childrenIds.push(child._id);
            parent.save();
        });
    }

    function respondWithChildUser(createChildAccountPromise, createChildUserPromise) {
        Promise
            .join(createChildAccountPromise, createChildUserPromise, (childAccount, childUser) => {
                res.status(200).send(childUser);
            })
            .catch(err => res.status(500).send(err));
    }
}


router.post('/api/account/:childId/update', verify.loggedIn, updateChild);

function updateChild(req, res) {
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
}


router.get('/api/account/:childId/delete', verify.loggedIn, deleteChild);

function deleteChild(req, res) {
    var childPromise = usersModel
        .findById(req.params.childId)
        .catch(err => res.status(500).send({ err: err, msg: 'can\'t find child' }));

    var parentPromise = childPromise
        .then(child => usersModel.findById(child.parentId))
        .catch(err => res.status(500).send({ err: err, msg: 'can\'t find parent' }));

    Promise
        .join(childPromise, parentPromise, (child, parent) => {
            removeChildIdFromParentArray(child, parent);
            recycleAccountNo(child);
        })
        .catch(err => res.status(500).send({
            err: err,
            msg: 'problem in recycling account-no or removing childId from parent array'
        }))
        .then(deleteAllChildDbModelsAndRespond);

    function removeChildIdFromParentArray(child, parent) {
        parent.childrenIds = parent.childrenIds.filter(id => id && id.toString() !== child._id.toString());
        parent.save();
    }

    function recycleAccountNo(child) {
        uniqueModel.create({ number: child.username });
    }

    function deleteAllChildDbModelsAndRespond() {
        accountsModel.remove({ userId: req.params.childId }, () => {
            transactionsModel.remove({ userId: req.params.childId }, () => {
                usersModel.remove({ _id: req.params.childId }, () => {
                    res.json('successfully deleted child');
                });
            });
        });
    }
}


router.post('/api/account/:accountId/deposit', verify.loggedIn, deposit);

function deposit(req, res) {
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
}


router.post('/api/account/:accountId/withdraw', verify.loggedIn, withdraw);

function withdraw(req, res) {

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
}


router.get('/api/account/generate', verify.loggedIn, generateNewAccountNumber);

function generateNewAccountNumber(req, res) {
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
}


router.post('/api/account/cancel/:accountNo', cancelNewAccountNumber);

function cancelNewAccountNumber(req, res) {
    uniqueModel.create({ number: req.params.accountNo }, (err, uniqueEntry) => {
        console.log('recycled the unique-account-number: ' + uniqueEntry.number);

        res.json(uniqueEntry.number);
    });
}


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


function RouteException(message, status) {
    this.type = 'RouteException';
    this.message = message || '';
    this.status = status || 500;
}
RouteException.prototype = new Error();


module.exports = router;