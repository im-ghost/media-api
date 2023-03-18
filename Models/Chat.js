const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
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
  image:String
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat