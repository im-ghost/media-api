const User = require("../models/User");

const {
  generateToken
} = require("../middlewares/auth");
const bcrypt = require("bcryptjs");

const delUser = async (id) =>{
  const user = await User.findById(id)

  if (user) {
    await User.findByIdAndDelete(id)
    return true
  } else {
    return false
  }
}
const createUser = async (name, email,password, phone, bio) =>{
  
    if(!email){
    return "No Email"
  } 
    if(!password){
    return "No password"
  } 
    if(!bio){
    return "No bio"
  } 
    if(!name){
    return "No name"
  } 
    if(!phone){
    return "No phone number"
  } else{
  const userExists = await User.findOne({ email })
   var pass= password;
  const salt = await bcrypt.genSalt(10)
   const hash = await bcrypt.hash(password,salt)
    pass = hash 
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
   phone: phone
  })

  if (user) {
   await generateToken(res,user._id)
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      posts: user.posts,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      chats: user.chats,
      phone: user.phone
       password:user.password
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
    return {userFollowing:updatedUser,userFollowed:userFollowed}
    }else{
      return "Already following user"
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
    console.log(user)
     if(await user.matchPassword(password)) {
     await  generateToken(res,user._id)
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

module.exports = {
  authUser,
  createUser,
  delUser,
  followUser
}