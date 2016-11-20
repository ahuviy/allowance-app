/******************************************************************************
 * THE MONGOOSE MODEL FOR UNIQUE ACCOUNT NUMBERS
 *****************************************************************************/

// Grab required modules
var mongoose = require('mongoose');

// Create a schema for uniqueAccountNumbers
var Schema = mongoose.Schema;
var uniqueSchema = new Schema({
    number: {
        type: Number,
        required: true,
        unique: true // allow only 1 entry for each number
    }
});

// Create a model for uniqueAccountNumbers
var uniqueModel = mongoose.model('uniqueAccountNumbers', uniqueSchema);

module.exports = uniqueModel;