/******************************************************************************
 * THE MONGOOSE MODEL FOR USERS
 * 
 * When using registration/login through passport-local-mongoose, the 'password'
 * field is unnecessary as the raw password is never stored on disk.
 * The password will be concatenated with a 'salt' and then hashed (SHA256) and
 * saved as 'hash'. The 'salt' field will be saved, specifying the salt value that
 * was added to the password before hashing it.
 * When a parent logs-in, he submits his password. The server concatenates the
 * pasword with the user-specific-salt and hashes the concatenated string. It
 * then compares the result with the 'hash' field in the db. If they match,
 * log-in is successful.  
 *****************************************************************************/

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var usersSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: String, // will not be used for parents. only for children
	name: {
		type: String,
		required: true
	},
	type: {
		type: String, // 'parent'|'child'
		required: true,
	},
	childrenIds: [mongoose.Schema.Types.ObjectId], // if user is a parent
	parentId: mongoose.Schema.Types.ObjectId, // if user is a child
	fbUserId: String, // facebook user-id (jwt)
	email: String 
}, {
	timestamps: true
});

// pluging-in passport-local-mongoose will put some methods
// on the model (authenticate, serializeUser, deserializeUser, ...).
usersSchema.plugin(passportLocalMongoose);

var usersModel = mongoose.model('Users', usersSchema);
module.exports = usersModel;