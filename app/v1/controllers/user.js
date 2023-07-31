const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
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
 
  const response = await User.findOne({email:email});
  
  if(response){
    res.status(200).json({user:{
       _id: response._id,
      name: response.name,
      email: response.email,
      posts: response.posts,
      followers: response.followers,
      following: response.following,
      bio: response.bio,
      chats: response.chats,
      phone: response.phone,
       password:response.password,
       image:response.image,
       retweets:[],
       token:generateToken(response._id)
    }})
  }else{
    res.status(404).json({error:"This account doesn't exist"})
  }
}
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
    bio,
    image
    } = req.body
    //const { file } = req
    const response = await user.createUser(name, email,password, phone, bio,image)
  if(typeof response === "string"){
    res.status(401).json({error:response})
  }else if(typeof response === "object"){
    res.status(200).json({user: response})
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
  if(id){
  const user = await User.findById(id.toString());
  if (user) {
    const posts = [];
    const followers = [];
    const following = []
    await Promise.all(user.posts.map(async(post)=>{
      const dPost = await Post.findById(post);
      if (dPost) {
        let others = {...dPost._doc,author:user}
        posts.push(others)
      }
    }))
    await Promise.all(user.followers.map(async(user)=>{
      const dUser = await User.findById(user);
      if(dUser){
        followers.push(dUser)
      }
    }))
    await Promise.all(user.following.map(async(user)=>{
      const dUser = await User.findById(user);
      if(dUser){
        following.push(dUser)
      }
    }))
    const other = {...user};
    const rest = {...other._doc,posts:posts,followers:followers,following:following,token:generateToken(other._doc._id)}
    res.status(200).json({user:rest})
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
const unfollowUser = async (req,res,next) =>{
   const { id } = req.params;
   const response = await user.unfollowUser(req.user, id)
  if(typeof response === "string"){
    res.status(401).json({error:response})
  }else if(typeof response === "object"){
    res.status(200).json({user:response})
  }else{
    res.status(500).json({error:"Server Error"})
  }
}
const getNotifications = async (req,res) => {
  try{
    const notifications = []
  const user = req.user;
  console.log("Get notifications");
 await Promise.all(user.notifications.map(async (not)=>{
    const notification = await Notification.findById(not);
    if(not){
    notifications.push(notification)
    }
  }))
  res.status(200).json({notifications:notifications})
  }catch(e){
    res.status(500).json({error:"An error occured"})
  }
}
const deleteNotification = async (req,res)=>{
  const { id } = req.body;
  const user = req.user;
  const notification = req.notification;
  if(user.notifications.includes(notification._id)){
    let newNots = user.notifications.filter((not)=> not._id !== notification._id);
    user.notifications = newNots;
    await user.save();
    await Notification.findByIdAndDelete(notification._id);
    res.status(200).json({message:"Deleted "})
  }
}
const postNotification = async (req,res) =>{
  const { content,postId } = req.body;
  const notification = await Notification.create({
    author:req.user._id,
    content,
    postId
  })
  req.user.notifications.push(notification._id);
  await req.user.save()
  if(notification){
    res.status(200).json({notification:notification})
  }else{
    res.status(400).json({error:"Error creating notification "})
  }
}

const myFeeds = async (req,res) => {
  const user = req.user;
  try{
  const { followers, following, _id} = user;
  const postS = await Post.find();
  const myFeeds = postS.filter(({author}) => followers.includes(author) || following.includes(author) || author.toString() === _id.toString());
  const posts = []
    await Promise.all(myFeeds.map(async(post)=>{
      const dPost = await Post.findById(post);
      if (dPost) {
        let others = {...dPost._doc,author:user}
        posts.push(others)
      }
    }))
  res.status(200).json({posts:posts})
  return myFeeds;
  }catch(e){
    res.status(400).json({error:e})
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
  unfollowUser,
  logOutUser,
  oauthLogin,
  getNotifications,
  postNotification,
  deleteNotification,
  myFeeds
}