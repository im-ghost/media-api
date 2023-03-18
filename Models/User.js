const { Schema,model } = require("mongoose")

const UserSchema = new Schema({
  username: {
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
  status: String,
  chats: [{
    type: Schema.Types.ObjectId,
    ref: 'Chat',
  }],
  bio: String,
  followersCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  post: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }],
});
const User = model("User",UserSchema)

module.exports = User;