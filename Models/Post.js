const { Schema,model } = require("mongoose")

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String
  },
  caption: String,
  likes: {
    type: Number,
    default: 0,
  },
  content: {
    type: String,
    required: true,
  },
  retweets: {
    type: Number,
    default: 0,
  },
});

const Post = model('Post', PostSchema);
module.exports = Post