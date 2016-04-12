var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    index: true, // define index on email property
    match: [/.+\@.+\..+/, "Please fill a valid email address"] // predefined validator based on regular expression
  },
  username: {
    type: String,
    trim: true, // predefined modifier for trim space
    unique: true, // predifined unique index
    required: "Username is required" // predefined validator
  },
  password: {
    type: String,
    // custom validator
    validate: [
      function (password) {
        return password.length > 6;
      },
      'Password should be longer than 6 characters.'
    ]
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
  created: {
    type: Date,
    default: Date.now // Provide default value
  }
});

// virtual method to provide a calculated property
UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
})
.set(function (fullname) {
  var splitName = fullname.splitName(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
});

// define custom static methods
UserSchema.statics.findOneByUserName = function (username, callback) {
  this.findOne({ username: new RegExp(username,'i') }, callback);
};

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');
  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

// define custom instance methods
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

UserSchema.methods.hashPassword = function (password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

// pre middleware
UserSchema.pre('save', function (next) {
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

// post middleware - sample for logging
UserSchema.post('save', function (next) {
  if (this.isNew) {
    console.log('A new user was created.');
  } else {
    console.log('A user updated is details.');
  }
});

// force mongoose to include getters when converting the mongodb document to a JSON representation
UserSchema.set('toJSON', { getters: true, virtual: true });

mongoose.model('User', UserSchema);