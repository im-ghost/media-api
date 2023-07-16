const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Like");

const Comment = require("../models/Comment");
const {
  generateToken
} = require("../middlewares/auth");

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
    return {
      post,
      user:{
           ...user._doc,
           token: generateToken(user._id)
         }
    }
  } else {
    console.log(error);
    throw new Error("Could not find the post")
  }
}


const likecomment = async (commentId,userId)=>{
  const comment = await Comment.findById(commentId);
  const user = await User.findById(userId);
  
  if (comment && user) {
    const { _id } = await Like.create({
      author:userId,
      post:commentId
    })
    comment.likes.push(userId)
    await comment.save()
   
       return {
         comment,
         user:{
           ...user._doc,
           token: generateToken(user._id)
         }
       };
  } else {
    console.log("Error")
   throw new Error("Couldn't find post")
  }
}
const unlikecomment = async (commentId,userId)=>{
  
  const comment = await Comment.findById(commentId);
  if (comment) {
    
    const newLikes = comment.likes.filter(like=> like.toString() !== userId.toString())
    comment.likes = newLikes
    await comment.save()
  
    return comment;
  } else {
    console.log("Error");
    throw new Error("Couldn't get post")
  }
}


async function handleUnlikeComment(io, socketId, userId, commentId) {
  const post = unlikecomment(commentId,userId)
      post
      .then(res =>{
      io.emit(`unlikedcomment-${commentId}`,res)
      })
      .catch(e=>{
        io.to(socketId).emit("error")
      })
}

async function handleLikeComment(io, socketId,  userId, commentId) {
  const post = likecomment(commentId,userId)
      post
      .then(res =>{
        console.log("emmited");
      io.emit(`likedcomment-${commentId}`,res)
      })
      .catch(e=>{
        io.to(socketId).emit("error")
      })
}
async function handleCommentOnPost(io, socketId, postId, userId,comment) {
  const post = commentOnPost(comment,userId,postId)
      post
      .then(res =>{
      io.emit(`commentedonpost-${postId}`,res)
      })
      .catch(e=>{
        io.to(socketId).emit("error")
      })
}

module.exports = {
  handleLikeComment,
  handleUnlikeComment,
  handleCommentOnPost
}