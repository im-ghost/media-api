const mongoose = require("mongoose");


const CommentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', 
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Like', 
    }],
    default: [],
  },
});

const Comment = mongoose.model("Comment",CommentSchema)

module.exports = Comment;