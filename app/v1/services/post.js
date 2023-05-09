const Post = require("../models/Post")
const getAllPost = async () =>{
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
    Post.findByIdAndDelete(id)
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


module.exports = {
  getAllPost,
  getAllPostByUser,
  getPostById,
  delPost
}