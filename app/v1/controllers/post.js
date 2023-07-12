const post = require("../services/post")
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const createPost = async (req,res,next)=>{
  const dPost = await post.createPost(req.body)
  if(typeof dPost === "object"){
  const user = req.user;
  user.posts.push(dPost._id)
  await user.save()
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
const editComment = async (req,res)=>{
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (comment) {
    comment.content = req.body.content;
    await comment.save()
    res.status(200).json({comment:comment})
  } else {
    res.status(404).json({error: "Could not find the post"})
  }
}
const userPost = async (req,res)=>{
  const dPost = await post.getAllPostByUser(req.body.id,req.query)
  if(typeof dPost === "object"){
    res.status(200).json({post:dPost})

  }else{
    res.status(400).json({error: dPost})
  }
}
const posts = async (req,res)=>{
  const dPosts = await post.posts(req.query);
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
const getComment = async (req,res,next)=>{
  const comment = await Comment.findById(req.params.id.toString());
  if(comment){
    res.status(200).json({comment:comment})
  }else{
    res.status(400).json({error: "Couldn't find comment"})
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
const deleteComment = async (req,res,next)=>{
  const comment = await Comment.findById(req.params.id)
  if(comment){
  const post = await Post.findById(comment.post);
  const newComments = post.comments.filter(com=>com !== req.params.id)
  post.comments = newComments;
  await post.save()
   await Comment.findByIdAndDelete(req.params.id)
    res.status(200).json({response:"Successful"})
  }else{
    res.status(400).json({error: "Unabale to delete comment"})
  }
}
module.exports = {
  createPost,
  delPost,
  editPost,
  posts,
  posT,
  userPost,
  getComment,
  deleteComment,
  editComment
}