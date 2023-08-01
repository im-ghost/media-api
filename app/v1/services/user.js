const User = require("../models/User");
const Post = require("../models/Post");
const NodeCache = require( "node-cache" );
const userCache = new NodeCache();
const {
  generateToken
} = require("../middlewares/auth");
const bcrypt = require("bcryptjs");

const delUser = async (id) =>{
  const user = await User.findById(id)
  
  if (user) {
    await User.findByIdAndDelete(id)
    userCache.take(id)
    return true
  } else {
    return false
  }
}
const createUser = async (name, email,password, phone, bio,image,imageName) =>{
  
    if(!email){
    return "No Email"
  } 
    else if(!password){
    return "No password"
  } 
   else if(!bio){
    return "No bio"
  } 
   else if(!name){
    return "No name"
  } 
  else if(!phone){
    return "No phone number"
  } else{
  const userExists = await User.findOne({ email })
  const salt = await bcrypt.genSalt(10);
 
   const hash = await bcrypt.hash(password,salt)
  
    const pass = hash 
  if (userExists) {
    return 'User already exists'
  }

  const user = await User.create({
    name:name,
    email:email,
    password: pass,
   posts: [],
   followers: [],
   following: [],
   bio: bio,
   chats: [],
   phone: phone,
  image:image,
  retweets:[],
  imageName:imageName
  })

  if (user) {
    let id = user._id.toString()
   
      return {
      _id: user._id,
      name: user.name,
      email: user.email,
      posts: user.posts,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      chats: user.chats,
      phone: user.phone,
       password:user.password,
       image:response.image,
       retweets:[],
       token:generateToken(user._id)
    }
  } else {
    return 'Invalid user data'
  }
  }
}
const followUser = async (usER,id) =>{
  
  const user = await User.findById(id);
  const userFollowing = usER;
  if (user && userFollowing) {
    if(!user.followers.includes(userFollowing._id) && !userFollowing.following.includes(user._id)){
   user.followers.push(userFollowing._id)
   userFollowing.following.push(id)
  const userFollowed = await user.save();
    const updatedUser = await userFollowing.save()
    userCache.set(user._id,JSON.stringify(updatedUser))
    return {userFollowing:updatedUser,userFollowed:userFollowed}
    }else{
      return "Already following user"
    }
  } else {
    return "User not found"
  }
}
const unfollowUser = async (usER,id) =>{
  
  const user = await User.findById(id);
  const userFollowing = usER;
  if (user && userFollowing) {
    if(user.followers.includes(userFollowing._id) && userFollowing.following.includes(user._id)){
      const newFollowers = user.followers.filter(useR => useR._id !== userFollowing._id);
      user.followers = newFollowers;
  
      const newFollowing = userFollowing.following.filter(useR => useR._id !== user._id);
      user.following = newFollowing;
  
   userFollowing.following.push(id)
  const userFollowed = await user.save();
    const updatedUser = await userFollowing.save()
    return {userFollowing:updatedUser,userFollowed:userFollowed}
    }else{
      return "Not following user"
    }
  } else {
    return "User not found"
  }
}
const authUser = async (email,password) =>{
  if(!email){
    return 'No email'
  }
  if(!password){
    return 'No password'
  }else{
  const user = await User.findOne({ email })
  if (user){
    
     if(await user.matchPassword(password)) {
   
    return {
      _id: user._id,
      name: user.name,
      password:user.password,
      email: user.email,
      posts: user.posts,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      chats: user.chats,
      phone: user.phone,
       image:user.image,
      retweets:[],
       token:generateToken(user._id)
    }
  }
  else{
    return "Wrong password"
  }
} else {
   return "invalid email "
  }
  }
}
const getUserFeeds = async (user) =>{
  try{
  const { followers, following, _id} = user;
  const posts = await Post.find();
  const myFeeds = posts.filter(({author}) => followers.includes(author) || following.includes(author) || author.toString() === _id.toString())
  return myFeeds;
  }catch(e){
    throw new Error(e)
  }
}
module.exports = {
  authUser,
  createUser,
  delUser,
  followUser,
  unfollowUser,
  userCache,
  getUserFeeds
}