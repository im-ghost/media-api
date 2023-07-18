const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat