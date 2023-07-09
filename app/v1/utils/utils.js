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
    throw new Error("Could not find the post")
  }
}


module.exports = {
   likePost,
  commentOnPost,
  unlikePost,
  retweetPost,
  unretweetPost
}