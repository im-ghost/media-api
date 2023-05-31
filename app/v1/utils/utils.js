const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");


const likePost = async (postId,userId) =>{
  const post = await Post.findById(postId);
   const user = await User.findById(userId)
  if (post) {
    const { _id } = await Like.create({
      author:user._id,
      post:id
    })
    post.likes.push(_id)
    await post.save()
    return post;
  } else {
   return "Could not find the post"
  }
}

const commentOnPost = async(comment,userId,postId) =>{
 
  const post = await Post.findById(postId);
  const user = await User.findById(userId)
  if (post) {
    const { _id } = await Comment.create({
      author:user._id,
      content:comment,
      post:id
    })
    post.comments.push(_id)
    await post.save()
    return post
  } else {
    return "Could not find the post"
  }
}


module.exports = {
   likePost,
  commentOnPost
}