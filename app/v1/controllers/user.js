const User = require("../models/User");
const Post = require("../models/Post");
const user = require("../services/user");

const {
  generateToken
} = require("../middlewares/auth");
const bcrypt = require("bcryptjs");

const authUser = async (req,res,next) =>{
  const { email ,password } = req.body;
  const response = await user.authUser(email, password)
  if(typeof response === "string"){
    res.status(401).json({error:response})
  }else if(typeof response === "object"){
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
    bio
    } = req.body
    const response = await user.createUser(name, email,password, phone, bio)
  if(typeof response === "string"){
    res.status(401).json({error:response})
  }else if(typeof response === "object"){
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
         var pass= req.body.password;
        const salt = await bcrypt.genSalt(10)
       const hash = await bcrypt.hash(req.body.password,salt)
       pass = hash 
      console.log(hash)
      user["password"] = hash
  }else{
    user[attr] = req.body[attr]
  }
      }else{
        console.log("   ")
      }
    }
    const updatedUser = await user.save()
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
  const user = await User.findById(id);
  if (user) {
    res.status(200).json({user:user})
  } else {
    res.status(400).json({"error":"User not found"})
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
  followUser
}