const { Schema,model } = require("mongoose")

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    default: [],
  },
  image: {
    type: String
  },
  caption: String,
  likes: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Like',
    }],
    default: [],
  },
  content: {
    type: String,
    required: true,
  },
   date: {
    type: Date,
    default: ()=> Date.now(),
  },
  retweets: {
    type:[{
      type: Schema.Types.ObjectId,
      ref:'Like'
    }] ,
    default: []
  },
});

const Post = model('Post', PostSchema);
module.exports = Post