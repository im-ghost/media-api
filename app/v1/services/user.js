const User = require("../models/User");/*
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const serviceAccount = require('../../../service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://quiz-app-richard.appspot.com',
});*/

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
const createUser = async (name, email,password, phone, bio) =>{
  /*try {

    // Upload the file to Firebase Storage
    const bucket = admin.storage().bucket();
    const fileName = `${uuidv4()}-${file.originalname}`;
    const firebaseResponse = await bucket.upload(file.buffer, {
      destination: fileName,
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Get the download URL from Firebase
    var downloadUrl = await firebaseResponse[0].getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Set the expiry date as desired
    });

    
}catch(e){
  return "unable to upload image"
}*/
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
  // image:downloadUrl
  })

  if (user) {
    userCache.set(user._id,user)
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

module.exports = {
  authUser,
  createUser,
  delUser,
  followUser,
  userCache
}