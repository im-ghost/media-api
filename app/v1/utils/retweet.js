const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const {
  generateToken
} = require("../middlewares/auth");


const retweetPost = async (id,userId)=>{
  
  const dPost = await Post.findById(id);
  const user = await User.findById(userId);
  if (dPost && user) {
    
    user.retweets.push(dPost._id)
    dPost.retweets.push(userId)
    await user.save()
    await dPost.save()
   
    return {
      dPost,
      user:{
           ...user._doc,
           token: generateToken(user._id)
         }
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
 
    return{
      dPost,
      user:{
           ...user._doc,
           token: generateToken(user._id)
         }
    }
  } else {
   throw new Error("An error occured")
  }
}


async function handleRetweetPost(io, socketId, postId, userId) {
 const res = retweetPost(postId,userId)
       res
       .then(data =>{
          io.emit(`retweetedpost-${postId}`,data)
       }).catch(e=>{
         io.to(socketId).emit("error")
       })
}
async function handleUnretweetPost(io, socketId, postId, userId) {
  const res = unretweetPost(postId,userId)
       res
       .then(data =>{
          io.emit(`unretweetedpost-${postId}`,data)
       }).catch(e=>{
         io.to(socketId).emit("error")
       })
}

module.exports ={
  handleRetweetPost,
  handleUnretweetPost
}