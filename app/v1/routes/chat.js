const express = require("express");
const router = express.Router();
const {
  protect
} = require("../middlewares/auth");
const {
  createChat,
  getAllUsersChats,
  getChat,
  deleteChat
} = require("../controllers/chat");

router.post("/",protect,createChat)
router.get("/user/:id",protect,getAllUsersChats);
router.get("/:id",protect,getChat)
router.delete("/:id",protect,deleteChat)
module.exports = router
