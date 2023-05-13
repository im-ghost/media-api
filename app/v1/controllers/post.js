const post = require("../services/post")
const Post = require("../models/Post")


const createPost = async (req,res,next)=>{
  const dPost = post.createPost(req.body)
  if(typeof dPost === "object"){
    res.status(200).json({post:dPost})

  }else{
    res.status(400).json({error: dPost})
  }
}
const editPost = async (req,res)=>{
  const { body } = req;
  const dPost = Post.findById(id);
  const user = req.user;
  if (dPost) {
        dPost[key] = body[key] ? body[key] : dPost[key]
    await dPost.save()
    res.status(200).json({post:dPost})
  } else {
    res.status(404).json({error: "Could not find the post"})
  }
}
const commentPost = async (req,res)=>{
  const { id,comment,post } = req.body;
  const dPost = Post.findById(id);
  const user = req.user;
  if (dPost) {
    dPost.comment.push({
      author:user,
      likes:{
        author:user,
        post:post._id
      },
      content:comment,
      post:post._id
    })
    await dPost.save()
    res.status(200).json({post:dPost})
  } else {
    res.status(404).json({error: "Could not find the post"})
  }
}
const likePost = async (req,res)=>{
  const { id,post } = req.body;
  const dPost = Post.findById(id);
  const user = req.user;
  if (dPost) {
    dPost.likes.push({
        author:user,
        post:post._id
    })
    await dPost.save()
    res.status(200).json({post:dPost})
  } else {
    res.status(404).json({error: "Could not find the post"})
  }
}
const userPost = async (req,res)=>{
  const dPost = post.getAllPostByUser(req.body.id)
  if(typeof dPost === "object"){
    res.status(200).json({post:dPost})

  }else{
    res.status(400).json({error: dPost})
  }
}
const posts = async (req,res)=>{
  const dPosts = post.posts();
  if(typeof dPosts === "object"){
    res.status(200).json({posts:dPosts})

  }else{
    res.status(400).json({error: dPosts})
  }
}
const posT = async (req,res,next)=>{
  const dPost = post.getPostById(req.params.id);
  if(typeof dPost === "object"){
    res.status(200).json({post:dPost})

  }else{
    res.status(400).json({error: dPost})
  }
}
const delPost = async (req,res,next)=>{
  const dPost = post.delPost(req.params.id);
  if(dPost){
    res.status(200).json({posts:dPosts})

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