/**
 * Start a connection to MongoDB (in Heroku)
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://ahuviyearim:123456@ds139187.mlab.com:39187/heroku_20f228pt');
console.log('MongoDB connection OK');

//-----------------------------------------------------------------------------

/**
 * Create a model for tasks
 */
var taskModel = mongoose.model('Task', {
	text: String,
	createDate: String,
	userId: String
});

//-----------------------------------------------------------------------------

module.exports = taskModel;