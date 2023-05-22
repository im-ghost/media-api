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
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }],
  password: {
    type:String,
    required:true
  }
});
UserSchema.pre("save", async function (next)=>{
  if(!this.isModified()){
    next()
  }
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password,salt)
  next()
})
UserSchema.methods.matchPassword = async function (pass){
  if(await bcrypt.compare(pass,this.password)){
    return true
  }else{
    return false
  }
}
const User = model("User",UserSchema)
module.exports = User;