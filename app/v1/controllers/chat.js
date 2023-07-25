
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const createChat = async (req, res) => {
  const { receiver } = req.body;
  const other = await User.findById(receiver);
  const userChats = req.user.chats;
  const otherChats = other.chats;

  const existingChatId = `${req.user._id}${receiver}`;
  const existingChatIdB = `${receiver}${req.user._id}`;

  let dChat = null;
  let chatFound = false;

  for (const chat of userChats) {
    if (chat.toString() === existingChatId || chat.toString() === existingChatIdB) {
      try {
        dChat = await Chat.findOne({chatId:chat});
        console.log("dChat",dChat);
        chatFound = true;
        break;
      } catch (error) {
        // Handle error if Chat.findById fails
        console.error("Error while finding chat:", error);
      }
    }
  }

  if (chatFound) {
    res.status(200).json({ chat: dChat });
  } else {
    console.log("else");
    const chat = await Chat.create({
      receiver,
      messages: [],
      chatId: `${req.user._id}${receiver}`
    });

    req.user.chats.push(`${req.user._id}${receiver}`);
    other.chats.push(`${req.user._id}${receiver}`);
    await other.save();
    await req.user.save();

    if (chat) {
      res.status(200).json({ chat: chat });
    } else {
      res.status(400).json({ error: "Couldn't create chat" });
    }
  }
};


const getChat = async (req, res) => {
  const { id } = req.params;
  const chat = await Chat.findById(id);
  if (chat) {
    const { receiver, messages } = chat;
    const msgs = [];
    const user = await User.findById(receiver);

    await Promise.all(messages.map(async (msg) => {
      const message = await Message.findById(msg);
      if (message) {
        msgs.push(message);
      } else {
        res.status(400).json({ error: "Unable to get chat messages" });
      }
    }));

    const returnValue = {
      receiver: user,
      messages: msgs,
      id: chat._id
    };
    res.status(200).json({ chat: returnValue });
  } else {
    res.status(400).json({ error: "Couldn't find chat" });
  }
};


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