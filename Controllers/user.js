const User = require("../Models/User");
const Post = require("../Models/Post");
const {
  generateToken
} = require("../middlewares/auth");
const bcrypt = require("bcryptjs");

const authUser = async (req,res,next) =>{
  const { email ,password } = req.body;
  if(!email || !password){
    res.status(400).json({"error":"No username or password "});
  }
  const user = await User.findOne({ email })
  if (user){
     if(await user.matchPassword(password)) {
    res.status(200).json({
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
      token: generateToken(user._id),
    })
  }
  else{
    res.status(401).json({"error":"wrong passwod"})
  }
} else {
    res.status(401).json({"error":"invalid email"})
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
  const userExists = await User.findOne({ email })
   var pass= password;
  const salt = await bcrypt.genSalt(10)
   const hash = await bcrypt.hash(password,salt)
    pass = hash 
  if (userExists) {
    res.status(400).json({"error":'User already exists'})
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
  token: generateToken(user._id),
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      posts: user.posts,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      chats: user.chats,
      phone: user.phone,
      token: generateToken(user._id),
      token: generateToken(user._id),
       password:user.password,
    })
  } else {
    res.status(400).json({"error":'Invalid user data'})
  }
}
const delUser = async (req,res,next) =>{
 const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.status(200).json({ message: 'User removed' })
  } else {
    res.status(404).status({"error":"User not found"})
  }
}
const editUser = async (req,res,next) =>{
   const { id } = req.params;
   
  const user = User.findById(id);
  if (user) {
    for(const attr in user){
      if(attr === "password"){
         var pass= req.body.password;
        const salt = await bcrypt.genSalt(10)
       const hash = await bcrypt.hash(req.body.password,salt)
       pass = hash 
      console.log(hash)
      user.password = pass;
  }
         user.attr = req.body.attr ? req.body.attr : user.attr
    }
    const updatedUser = await user.save()
    res.status(200).json({user:updatedUser})
  } else {
    res.status(400).json({"error":"User not found"})
  }
}
const users = async (req,res,next) =>{
  const users = User.find({});
  res.status(200).json({users:users})
}
const user = async (req,res,next) =>{
  const { id } = req.params;
  const user = User.findById(id);
  if (user) {
    res.status(200).json({user:user})
  } else {
    res.status(400).json({"error":"User not found"})
  }
}
const followUser = async (req,res,next) =>{
   const { id } = req.params;
   const { userId } = req.body
  const user = User.findById(id);
  const userToFollow = User.findById(userId);
  if (user && userToFollow) {
   user.following.push(userId)
   userToFollow.followers.push(id)
  const userFollowed = await userToFollow.save();
    const updatedUser = await user.save()
    res.status(200).json({user:updatedUser})
  } else {
    res.status(400).json({"error":"User not found"})
  }
}



module.exports = {
  authUser,
  createUser,
  delUser,
  editUser,
  users,
  user,
  followUser
}