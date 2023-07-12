const Post = require("../models/Post")
const NodeCache = require( "node-cache" );
const postCache = new NodeCache();
const posts = async () =>{
  const posts = await Post.find({})

  

  return posts
}

const getPostById = async (id) =>{
  if(id && id !== undefined){
    
  const post = await Post.findById(id)
 await postCache.set(id,JSON.stringify(post))
  return post
  }else{
    return "No id"
  }
}

const delPost = async (id) =>{
  const post = await Post.findById(id)
  
  if (post) {
    const author= post.author;
  const user= await User.findById(author);
  const newPosts = user.posts.filter(post=> post !== id);
  user.posts = newPosts;
  await user.sav()
   await Post.findByIdAndDelete(id)
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
    console.log(post);
    postCache.set(post._id.toString(),JSON.stringify(post))
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