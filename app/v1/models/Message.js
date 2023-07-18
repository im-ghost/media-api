const { Schema,model } = require("mongoose");

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read:{
    type:Boolean,
    default:false
  }
});

const Message = model("Message",messageSchema)
module.exports = Message;