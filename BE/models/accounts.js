/******************************************************************************
 * THE MONGOOSE MODEL FOR ACCOUNTS
 *****************************************************************************/

// Grab required modules
var mongoose = require('mongoose');

// Create a schema for accounts
var Schema = mongoose.Schema;
var accountsSchema = new Schema({
	userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true // allow only 1 entry for each userId
    },
    name: {
        type: String,
        required: false,
        default: ''
    },
    interestRate: {
        type: Number,
        required: false,
        default: 0,
        min: 0
    },
    rebateRate: {
        type: Number,
        required: false,
        default: 0,
        min: 0
    },
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    allowance: {
        type: String, // 'monthly'/'weekly'/'none'
        required: false,
        default: 'none'
    },
    allowanceAmount: {
        type: Number,
        required: false,
        default: 0
    }
}, {
	timestamps: true
});

// Create a model for accounts
var accountsModel = mongoose.model('Accounts', accountsSchema);

module.exports = accountsModel;