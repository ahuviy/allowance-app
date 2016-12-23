/******************************************************************************
 * THE MONGOOSE MODEL FOR TRANSACTIONS
 *****************************************************************************/

// Grab required modules
var mongoose = require('mongoose');

// Create a schema for transactions
var Schema = mongoose.Schema;
var transactionSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	type: {
		type: String, // 'deposit'/'withdraw'/'interest'/'rebate'
		required: true
	},
	description: {
		type: String,
		required: false,
		default: ''
	},
	sum: {
		type: Number,
		required: true
	},
	performedBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	timestamp: {
		type: Number, // the UTC date (milliseconds from 1970)
		required: true
	}
});

// create a model for transactions
var TransactionModel = mongoose.model('transactions', transactionSchema);

module.exports = TransactionModel;