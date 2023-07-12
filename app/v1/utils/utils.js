const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");


const likePost = async (id,userId)=>{
  const dPost = await Post.findById(id);
  if (dPost) {
    const { _id } = await Like.create({
      author:userId,
      post:id
    })
    dPost.likes.push(userId)
    await dPost.save()
    console.log(dPost)
       return dPost;
  } else {
   throw new Error("Couldn't find post")
  }
}
const likecomment = async (commentId,userId)=>{
  console.log("likecomment");
  console.log(commentId);
  const comment = await Comment.findById(commentId);
  console.log(comment);
  if (comment) {
    const { _id } = await Like.create({
      author:userId,
      post:commentId
    })
    comment.likes.push(userId)
    await comment.save()
    console.log(comment)
       return comment;
  } else {
    console.log("Error");
   throw new Error("Couldn't find post")
  }
}
const unlikePost = async (id,userId)=>{
  
  const dPost = await Post.findById(id);
  if (dPost) {
    
    const newLikes = dPost.likes.filter(like=> like.toString() !== userId.toString())
    dPost.likes = newLikes
    await dPost.save()
    console.log(dPost)
    return dPost;
  } else {
    throw new Error("Couldn't get post")
  }
}
const unlikecomment = async (commentId,userId)=>{
  
  const comment = await Comment.findById(commentId);
  if (comment) {
    
    const newLikes = comment.likes.filter(like=> like.toString() !== userId.toString())
    comment.likes = newLikes
    await comment.save()
    console.log(comment)
    return comment;
  } else {
    console.log("Error");
    throw new Error("Couldn't get post")
  }
}
const retweetPost = async (id,userId)=>{
  
  const dPost = await Post.findById(id);
  const user = await User.findById(userId);
  if (dPost && user) {
    
    user.retweets.push(dPost._id)
    dPost.retweets.push(userId)
    await user.save()
    await dPost.save()
    console.log(user)
    return {
      dPost,user
    }
  } else {
    throw new Error("An error occurred ")
  }
}
const unretweetPost = async (id,userId)=>{
  
  const dPost = await Post.findById(id);
  const user = await User.findById(userId)
  if (dPost) {
    
    const newPosts = user.retweets.filter(postId => postId.toString() !== dPost._id.toString())
    
    const newPost = dPost.retweets.filter(postId => postId.toString() !== user._id.toString())
    user.retweets = newPosts
    dPost.retweets = newPost
   await user.save()
   await dPost.save()
    console.log(user)
    return{
      dPost,user
    }
  } else {
   throw new Error("An error occured")
  }
}
const commentOnPost = async(comment,userId,postId) =>{
 
  const post = await Post.findById(postId);
  const user = await User.findById(userId);
 
  if(post && user) {
    console.log("no error");
    const { _id } = await Comment.create({
      author:userId,
      content:comment,
      post:postId
    })
    post.comments.push(_id)
    await post.save()
    return post
  } else {
    console.log(error);
    throw new Error("Could not find the post")
  }
}


module.exports = {
   likePost,
  commentOnPost,
  unlikePost,
  retweetPost,
  unretweetPost,
  likecomment,
  unlikecomment
}