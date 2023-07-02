const User = require("../models/User");
const Post = require("../models/Post");
const user = require("../services/user");

const {
  generateToken
} = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const logOutUser = async (req,res,next) => {
  res.cookie("token","",{
    httpOnly:true,
    expires: new Date(0)
  })
}
const oauthLogin = async (req,res,next) =>{
  const { email  } = req.body;
  console.log(email)
  const response = await User.findOne({email:email});
  console.log(response)
  if(response){
    res.status(200).json({user:{
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
       retweets:[],
       token:generateToken(user._id)
    }})
  }else{
    res.status(500).json({error:"This account doesn't exist"})
  }
}
const authUser = async (req,res,next) =>{
  const { email ,password } = req.body;
  const response = await user.authUser(email, password)
  if(typeof response === "string"){
    res.status(401).json({error:response})
  }else if(typeof response === "object"){
      await  generateToken(res,response._id)
    res.status(200).json({user:response})
  }else{
    res.status(500).json({error:"Server Error"})
  }
}
const createUser = async (req,res,next) =>{
  
  const {
    name,
    email, 
    password,
    phone,
    bio,
    image
    } = req.body
    //const { file } = req
    const response = await user.createUser(name, email,password, phone, bio,image)
  if(typeof response === "string"){
    res.status(401).json({error:response})
  }else if(typeof response === "object"){
    await  generateToken(res,response._id)
    res.status(200).json({user:response})
  }else{
    res.status(500).json({error:"Server Error"})
  }
}
const delUser = async (req,res,next) =>{
 const response = user.delUser(req.params.id)
 if (response) {
   res.status(201).json({message:"User removed "})
 } else {
   res.status(400).json({message:"An error occurred while trying to delete the user,user doesn't exist"})
 }
}
const editUser = async (req,res,next) =>{
   const { id } = req.params;
   
  const user = await User.findById(id);
  if (user) {
    console.log(user)
    for(const attr in user){
      if(req.body[attr]){
        if(attr === "password"){
          const salt = bcrypt.genSalt(10)
          const hash = bcrypt.hash(req.body[attr],salt)
          user["password"] = hash;
        }else{
    user[attr] = req.body[attr]
        }
      }else{
        console.log("   ")
      }
    }
    const updatedUser = await user.save()
    user.userCache.set(updatedUser._id,JSON.stringify(updatedUser))
   res.status(200).json({user:updatedUser})
  } else {
   res.status(401).json({error:"User not found"})
  }
    
  
}
const users = async (req,res,next) =>{
  const users = await User.find({});
  
  res.status(200).json({users:users})
}
const useR = async (req,res,next) =>{
  const { id } = req.params;
  if(id !== undefined){
  const user = await User.findById(id);
  if (user) {
    res.status(200).json({user:user})
  } else {
    res.status(400).json({"error":"User not found"})
  }
  }
}
const followUser = async (req,res,next) =>{
   const { id } = req.params;
   const response = await user.followUser(req.user, id)
  if(typeof response === "string"){
    res.status(401).json({error:response})
  }else if(typeof response === "object"){
    res.status(200).json({user:response})
  }else{
    res.status(500).json({error:"Server Error"})
  }
}



module.exports = {
  authUser,
  createUser,
  delUser,
  editUser,
  users,
  useR,
  followUser,
  logOutUser,
  oauthLogin
}