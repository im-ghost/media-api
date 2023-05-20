const Post = require("../models/Post")
const posts = async () =>{
  const posts = await Post.find({})
  return posts
}

const getPostById = async (id) =>{
  const post = await Post.findById(id)
  return post
}

const delPost = async (id) =>{
  const post = await Post.findById(id)
  if (post) {
   await Post.findByIdAndDelete(id)
    return true
  } else {
    return "Post not found"
  }
}

const getAllPostByUser = async (id) =>{
  const { posts } = await User.findById(id);
  if(posts)  return posts
  else return " Posts not found"
}

const createPost = async (body) =>{
  const post = await Post.create(body)
  if(post) return post
  else return "Error while creating post"
}


module.exports = {
  posts,
  getAllPostByUser,
  getPostById,
  delPost,
  createPost
}