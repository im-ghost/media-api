const Post = require("../models/Post")
const NodeCache = require( "node-cache" );
const postCache = new NodeCache();
const posts = async (query=undefined) =>{
  const posts = await Post.find({})
  if(query){
    const limit = query.limit || 10
  const startIndex = query.start ||  0 
  const endIndex =  limit
  const sortBy = query.sortBy || 'title'
  const sortOrder = query.sortOrder || 'asc'
  const filter = query.filter || ''

  const filteredPosts = posts.filter((post) =>
    post.name.toLowerCase().includes(filter.toLowerCase())
  )
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1
    }
  })
  const results = sortedPosts.slice(startIndex, endIndex)
  }
  return results 
}

const getPostById = async (id) =>{
  const cachedPost = await postCache.get(id)
  if(cachedPost){
    return cachedPost;
  }else{
  const post = await Post.findById(id)
 await postCache.set(id,post)
  return post
  }
}

const delPost = async (id) =>{
  const post = await Post.findById(id)
  if (post) {
   await Post.findByIdAndDelete(id)
   postCache.take(id)
    return true
  } else {
    return "Post not found"
  }
}

const getAllPostByUser = async (id,query) =>{
  const { posts } = await User.findById(id);
  
  if(posts) {
    const limit = req.query.limit || 10
  const startIndex = req.query.start ||  0 
  const endIndex =  limit
  const sortBy = req.query.sortBy || 'title'
  const sortOrder = req.query.sortOrder || 'asc'
  const filter = req.query.filter || ''

  const posts = []
  for(i=0;i<user.posts.length;i++){
    const post = await Quiz.findById(user.posts[i])
    posts.push(post)
  }
  const filteredPosts = posts.filter((post) =>
    post.name.toLowerCase().includes(filter.toLowerCase())
  )
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1
    }
  })
  const results = sortedPosts.slice(startIndex, endIndex)

  return results 
  }
  else return " Posts not found"
}

const createPost = async (body) =>{
  const post = await Post.create(body)
  if(post) {
    postCache.set(post._id,post)
    return post 
    
  }
  else return "Error while creating post"
}


module.exports = {
  posts,
  getAllPostByUser,
  getPostById,
  delPost,
  createPost,
  postCache
}