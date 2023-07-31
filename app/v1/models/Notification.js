const mongoose = require("mongoose");


const NotificationSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date:{
    type:Date,
    default: Date.now,
  }
});

const Notification = mongoose.model("Notification",NotificationSchema)

module.exports = Notification;