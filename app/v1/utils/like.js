const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Like");
const {
  generateToken
} = require("../middlewares/auth");


const likePost = async (id,userId)=>{
  const dPost = await Post.findById(id);
  const user = await User.findById(userId);
 
 
  if (dPost && user) {
    const { _id } = await Like.create({
      author:userId,
      post:id
    })
    dPost.likes.push(userId)
    await dPost.save()
 
       return {
         post:dPost,
         user:{
           ...user._doc,
           token: generateToken(user._id)
         }
       };
  } else {
   throw new Error("Couldn't find post")
  }
}

const unlikePost = async (id,userId)=>{
  
  const dPost = await Post.findById(id);
  if (dPost) {
    
    const newLikes = dPost.likes.filter(like=> like.toString() !== userId.toString())
    dPost.likes = newLikes
    await dPost.save()
    
    return dPost;
  } else {
    throw new Error("Couldn't get post")
  }
}

async function handleLikePost(io, socketId, postId, userId) {
  try {
    const post = await likePost(postId, userId);
    io.emit(`likedpost-${postId}`, post);
  } catch (e) {
    io.to(socketId).emit(`error`);
  }
}

async function handleUnlikePost(io, socketId, postId, userId) {
  try {
    const post = await unlikePost(postId, userId);
    io.emit(`unlikedpost-${postId}`, post);
  } catch (e) {
    io.to(socketId).emit(`error`);
  }
}

module.exports = {
  handleUnlikePost,
  handleLikePost
}