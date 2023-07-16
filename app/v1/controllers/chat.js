
const Chat = require("../models/Chat");


const createChat = async (req,res) => {
  const { members } = req;
  const chat = await Chat.create({
    members,
    messages:[]
  });
  await req.user.chats.push(chat._id);
  await req.user.save();
  if (chat) {
    res.status(200).json({chat:chat})
  } else {
    res.status(400).json({error:"Couldn't create chat"})
  }
}

const getChat = async (req,res) =>{
  const { id } = req.params;
  const chat = await Chat.findById(id)
  if (chat) {
    const { members, messages } = chat;
    const users = [];
    const msgs = [];
    members.map(async (member)=>{
      const user = await User.findById(member);
      if(user){
        users.push(user)
      }else{
        res.status(400).json({error:"Unable to get chats users "})
      }
    })
    messages.map(async (msg)=>{
      const message = await Message.findById(msg);
      if(messages){
        messages.push(message)
      }else{
        res.status(400).json({error:"Unable to get chats messages"})
      }
    })
    res.status(200).json({
      chat:{
      members:users,
      messages:msgs,
      id:chatId
      }
    })
  } else {
    res.status(400).json({error:"Couldn't find chat"})
  }
}

const getAllUsersChats = async (req,res) =>{
  const { chats } = req.user;
  try {
   const response = [];
   chats.map(async (c) =>{
     const chat = await Chat.findById(c);
     if(chat){
       response.push(chat)
     }
   })
   res.status(200).json({chats:response})
  } catch (e) {
    res.status(400).json({error:"unable to get chats"})
  }
}
const deleteChat = async (req,res) => {
  const { id } = req.params;
  try {
    await Chat.findByIdAndDelete(id);
    const newChats = req.user.chats.filter((i) => i !== id);
    req.user.chats = newChats;
    await req.user.save();
    res.status(200).json({message:"Success "})
  } catch (e) {
    res.status(400).json({error:"unable to delete chat "})
  }
}
module.exports = {
  createChat,
  getAllUsersChats,
  getChat,
  deleteChat
}