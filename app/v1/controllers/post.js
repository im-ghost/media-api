const post = require("../services/post")
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const createPost = async (req,res,next)=>{
  const dPost = await post.createPost(req.body)
  const user = req.user;
  user.posts.push(dPost._id)
  await user.save()
  if(typeof dPost === "object"){
    console.log(dPost)
    res.status(200).json({post:dPost})

  }else{
    res.status(400).json({error: dPost})
  }
}
const editPost = async (req,res)=>{
  const { body,params } = req;
  const dPost = await Post.findById(params.id);
  const user = req.user;
  if (dPost) {
    for(key in dPost){
        dPost[key] = body[key] ? body[key] : dPost[key]
    }
    await dPost.save()
    res.status(200).json({post:dPost})
  } else {
    res.status(404).json({error: "Could not find the post"})
  }
}
const commentPost = async (req,res)=>{
  const { comment } = req.body;
  const { id } = req.params
  const dPost = await Post.findById(id);
  const user = req.user;
  if (dPost) {
    const { _id } = await Comment.create({
      author:user._id,
      content:comment,
      post:id
    })
    dPost.comments.push(_id)
    await dPost.save()
    res.status(200).json({post:dPost})
  } else {
    res.status(404).json({error: "Could not find the post"})
  }
}
const likePost = async (req,res)=>{
  const { id } = req.params;
  const dPost = await Post.findById(id);
  const user = req.user;
  if (dPost) {
    const { _id } = await Like.create({
      author:user._id,
      post:id
    })
    dPost.likes.push(_id)
    await dPost.save()
    res.status(200).json({post:dPost})
  } else {
    res.status(404).json({error: "Could not find the post"})
  }
}
const userPost = async (req,res)=>{
  const dPost = await post.getAllPostByUser(req.body.id)
  if(typeof dPost === "object"){
    res.status(200).json({post:dPost})

  }else{
    res.status(400).json({error: dPost})
  }
}
const posts = async (req,res)=>{
  const dPosts = await post.posts();
  if(typeof dPosts === "object"){
    res.status(200).json({posts:dPosts})

  }else{
    res.status(400).json({error: dPosts})
  }
}
const posT = async (req,res,next)=>{
  const dPost = await post.getPostById(req.params.id);
  if(typeof dPost === "object"){
    res.status(200).json({post:dPost})

  }else{
    res.status(400).json({error: dPost})
  }
}
const delPost = async (req,res,next)=>{
  const dPost = await post.delPost(req.params.id);
  if(dPost){
    res.status(200).json({posts:dPost})

  }else{
    res.status(400).json({error: dPosts})
  }
}



module.exports = {
  createPost,
  delPost,
  editPost,
  posts,
  posT,
  userPost,
  commentPost,
  likePost
}