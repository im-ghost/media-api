const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: String,
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  bio:String,
  image:String,
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group