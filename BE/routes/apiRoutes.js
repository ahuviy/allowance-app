// get the modules
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Promise = require('bluebird'); // use bluebird promises

// load db-models
const AccountModel = require('../models/accounts');
const TransactionModel = require('../models/transactions');
const UserModel = require('../models/users');
const UniqueModel = require('../models/uniqueAccountNumbers.js');

// use body-parser middleware to parse json requests
const bodyParser = require('body-parser');
router.use(bodyParser.json());

// this module manages the JSON web-tokens and verifies user identities
const verify = require('../verify');


function RouteException(message, status) {
    Error.call(this, message);
    this.type = 'RouteException';
    this.status = status || 500;
}
RouteException.prototype = Object.create(Error.prototype);


/******************************************************************************
 * API
 *****************************************************************************/


router.post('/login', loginWithUsername);

function loginWithUsername(req, res, next) {
    passport.authenticate('local', { session: false }, authCallback)(req, res, next);

    // Passport-local-mongoose attempts to validate the user by adding the 'salt'
    // to the password, hashing the concatenated string, and comparing to the 'hash'
    // field in the user-model. If validation fails, user = false. If validation
    // succeeds, user contains the user-model.
    function authCallback(err, user, info) {
        // this error will probably occur because of a db connection-error
        // TODOahuvi: address this error specifically in error-handling.js
        if (err) {
            next(err);
        }

        // validation failed, will return a 401, "Password or username are incorrect"
        if (!user) {
            return res.status(401).json({ error: info.message });
        }

        // Create a private token for the user and send it
        var token = verify.createToken({
            username: user.username,
            name: user.name
        });
        res.status(200).json({
            status: 'Login successful!',
            success: true,
            token: token
        });
    }
}


router.post('/register', addParent);

function addParent(req, res) {
    var newParent = new UserModel({
        username: req.body.username,
        name: req.body.name,
        type: 'parent',
        email: req.body.email || ''
    });
    UserModel.register(newParent, req.body.password, registrationCallback);

    function registrationCallback(err) {
        if (err) {
            // error will almost certainly occur if username already exists
            res.status(409).json({ error: err });
        }
        res.status(200).json({ status: 'Registration successful' });
    }
}


// TODOahuvi: loginWithFacebook


router.get('/children/:parentUsername', verify.isLoggedIn, getChildren);

function getChildren(req, res) {
    UserModel
        .findOne({ username: req.params.parentUsername })
        .then(parent => UserModel.find({ parentId: parent._id }))
        .then(children => {
            res.status(200).send({
                children: children,
                parentName: req.decoded.name
            });
        });
}


router.get('/children/get/:childId', verify.isLoggedIn, getChildById);

function getChildById(req, res) {
    Promise
        .join(
        AccountModel.findOne({ userId: req.params.childId }),
        TransactionModel.find({ userId: req.params.childId }),
        UserModel.findById(req.params.childId),
        (account, transactions, user) => {
            res.json({
                account: account,
                transactions: transactions,
                user: user
            });
        })
        .catch(err => res.status(500).json(err));
}


router.post('/children/:parentUsername', verify.isLoggedIn, addChild);

function addChild(req, res) {
    var findParentPromise = findParent();
    var createChildUserPromise = createChildUser(findParentPromise);
    var createChildAccountPromise = createChildAccount(createChildUserPromise);
    addChildIdToParentArray(findParentPromise, createChildUserPromise);
    respondWithChildUser(createChildAccountPromise, createChildUserPromise);

    function findParent() {
        return UserModel
            .findOne({ username: req.params.parentUsername })
            .catch(err => res.status(500).send({ msg: 'error finding parent', err: err }));
    }

    function createChildUser(findParentPromise) {
        return findParentPromise
            .then(parent => {
                var promise = UserModel.create({
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
                var promise = AccountModel.create({
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


router.post('/account/:childId/update', verify.isLoggedIn, updateChild);

function updateChild(req, res) {
    var updateAccountPromise = updateChildAccount();
    var updateUserPromise = updateChildUser();
    Promise.join(
        updateAccountPromise,
        updateUserPromise,
        res.status(200).send('Successfully updated child')
    );

    function updateChildAccount() {
        return AccountModel
            .update({ userId: req.body.userId }, {
                $set: {
                    name: req.body.name,
                    interestRate: req.body.interestRate,
                    rebateRate: req.body.rebateRate
                }
            })
            .exec()
            .catch(err => res.status(500).json(err));
    }

    function updateChildUser() {
        return UserModel
            .update({ _id: req.body.userId }, {
                $set: {
                    name: req.body.name,
                    password: req.body.password
                }
            })
            .exec()
            .catch(err => res.status(500).json(err));
    }
}


router.get('/account/:childId/delete', verify.isLoggedIn, deleteChild);

function deleteChild(req, res) {
    var childPromise = UserModel
        .findById(req.params.childId)
        .catch(err => res.status(500).send({ err: err, msg: 'can\'t find child' }));

    var parentPromise = childPromise
        .then(child => UserModel.findById(child.parentId))
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
        UniqueModel.create({ number: child.username });
    }

    function deleteAllChildDbModelsAndRespond() {
        AccountModel.remove({ userId: req.params.childId }, () => {
            TransactionModel.remove({ userId: req.params.childId }, () => {
                UserModel.remove({ _id: req.params.childId }, () => {
                    res.json('successfully deleted child');
                });
            });
        });
    }
}


router.post('/account/:accountId/deposit', verify.isLoggedIn, deposit);

function deposit(req, res) {
    // set 'performedBy' field to parentId instead of parentUsername
    UserModel.findOne({ username: req.body.performedBy }, (err, parentUser) => {
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
            AccountModel.update({ userId: req.body.userId }, {
                $set: {
                    allowance: setAllowance,
                    allowanceAmount: req.body.sum
                }
            }, (err, rawResponse) => {
                if (err) { res.status(500).json(err); }
                console.log('finished modifying the account allowance');

                AccountModel.findOne({ userId: req.body.userId }, (err, account) => {

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
            AccountModel.findOne({ userId: req.body.userId }, (err, account) => {
                console.log('updating account balance');
                account.balance = account.balance + req.body.sum;
                account.save((err, resp) => {
                    if (err) { res.status(500).json(err); }
                    console.log('finished updating account balance');

                    // add entry to the transactions
                    console.log('adding the new transaction');
                    TransactionModel.create(req.body, (err, transaction) => {
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


router.post('/account/:accountId/withdraw', verify.isLoggedIn, withdraw);

function withdraw(req, res) {

    // set 'performedBy' field to parentId instead of parentUsername
    UserModel.findOne({ username: req.body.performedBy }, (err, parentUser) => {
        if (err) { res.status(500).send('db error'); }
        req.body.performedBy = parentUser._id;

        // add entry to the transactions collection
        console.log('adding the new transaction');
        TransactionModel.create(req.body, (err, transaction) => {

            // modify the account balance
            AccountModel.findOne({ userId: transaction.userId }, (err, account) => {
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


router.get('/account/generate', verify.isLoggedIn, generateNewAccountNumber);

function generateNewAccountNumber(req, res) {
    // get a unique account number from the unique-model
    UniqueModel.findOne({}, (err, uniqueEntry) => {
        console.log('found a unique-account-number: ' + uniqueEntry.number);
        // remove the fetched unique entry from the db
        UniqueModel.remove({ number: uniqueEntry.number }, (err, resp) => {
            if (err) { res.status(500).json(err); }
            console.log('removed unique-account-number entry from db');
            // respond with the unique account-number
            // res.status(200).send(uniqueEntry.number);
            res.json(uniqueEntry.number);
        });
    });
}


router.post('/account/cancel/:accountNo', cancelNewAccountNumber);

function cancelNewAccountNumber(req, res) {
    UniqueModel.create({ number: req.params.accountNo }, (err, uniqueEntry) => {
        console.log('recycled the unique-account-number: ' + uniqueEntry.number);

        res.json(uniqueEntry.number);
    });
}


/**
 * WORKER FUNCTION:
 * INITIALIZE ACCOUNT NUMBER COLLECTION
 * Create a collection of unique account numbers. This is done only once.
 */
router.get('/account/init', (req, res) => {
    // TODOahuvi: generate using a smart algorithm:
    // get all the usernames that are numbers.
    // get all the available account numbers.
    // generate numbers that don't coincide with the current usernames or available
    // account numbers.
    initAccountNumCollection();

    function initAccountNumCollection() {
        for (var i = 100; i < 500; i++) {
            UniqueModel.create({ number: i });
        }
        res.status(200).send('generated new account numbers');
    }
});


module.exports = router;