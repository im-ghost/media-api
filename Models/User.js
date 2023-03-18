const { Schema,model } = require("mongoose")

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
  followers: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  post: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }],
  password: {
    type:String,
    required:true
  }
});
const User = model("User",UserSchema)

module.exports = User;