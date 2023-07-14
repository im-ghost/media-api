const { Schema,model } = require("mongoose")
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },

  chats: [{
    type: Schema.Types.ObjectId,
    ref: 'Chat',
  }],
  bio: String,
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  notifications: [{
    type: Schema.Types.ObjectId,
    ref: 'Notification',
  }],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }],
  retweets: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }],
  password: {
    type:String,
    required:true
  },
  image: {
    type:String
  },
});/*
UserSchema.pre("save", async function (next){
  console.log("presavs")
  if(!this.isModified()){
    next()
  }else{
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
  next()
  }
})*/
UserSchema.methods.matchPassword = async function (pass) {
  try {
    const isMatch = await bcrypt.compare(String(pass).trim(), this.password.trim());
   
    return isMatch;
  } catch (error) {
   
    return false;
  }
};

const User = model("User",UserSchema)
module.exports = User;