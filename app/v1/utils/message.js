const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");


const sendMessage = async ({
  userId,
  chatId,
  message,
  
}) => {
  const chat = await Chat.findById(chatId)
  const msg = await Message.create({
    sender:userId,
    chat:chatId,
    message,
  });
  
  if (msg && chat) {
    chat.messages.push(msg._id);
    await chat.save();
    const allMessages = await Message.find({chat:chat._id})
    return  allMessages
  } else {
    throw new Error("Unable to create Chat")
  }
}

const deleteMessage = async ({
  userId,
  chatId,
  messageId
}) => {
  const chat = await Chat.findById(chatId)
  const msg = await Message.findById(messageId)
  if (msg && chat) {
   const newMes = chat.messages.filter((id) => id !== msg._id);
   chat.messages = newMes;
    await Message.findByIdAndDelete(msg._id)
    await chat.save();
    const allMessages = await Message.findOne({chat:chat._id})
    return allMessages
  } else {
    throw new Error("Unable to delete message")
  }
}

const editMessage = async({
  message,
  chatId,
  messageId
}) => {
  const chat = await Chat.findById(chatId)
  const msg = await Message.findById(messageId)
  if (msg && chat) {
    msg.message = message
    await msg.save();
    return msg
  } else {
    throw new Error("Unable to edit message")
  }
}

async function handleSendMessage({
  io,
  socketId,
  userId,
  chatId,
  message,
  
}) {
  try{
  const chat = await sendMessage({
    userId,
  chatId,
  message,
  
  })
  console.log(chat);
  io.emit(`chatmessage-${chatId}`,chat)
  }catch(e){
    io.to(socketId).emit(`error`)
  }
}

async function handleEditMessage({
  io,
  socketId,
  messageId,
  chatId,
  message
}) {
  try{
  const chat = await editMessage({
  messageId,
  chatId,
  message
  })
  io.emit(`editedmessage-${messageId}`,chat)
  }catch(e){
    io.to(socketId).emit(`error`)
  }
}

async function handleDeleteMessage({
  io,
  messageId,
  chatId
}) {
  try{
  const chat = await deleteMessage({
  messageId,
  chatId,
  })
  io.emit(`deletedmessage-${messageId}`,chat)
  }catch(e){
    io.to(socketId).emit(`error`)
  }
}
module.exports = {
  handleDeleteMessage,
  handleEditMessage,
  handleSendMessage
}