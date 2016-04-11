var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // DBRef type
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Post', PostSchema);