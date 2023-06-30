const express = require('express');
const router = express.Router();
const {
  authUser,
  createUser,
  delUser,
  editUser,
  users,
  useR:user,
  followUser,
  logOutUser,
  oauthLogin
} = require("../controllers/user")
const {
  protect,
  protectMe
 } = require("../middlewares/auth")/*
 const multer = require("multer")
 const upload = multer({ destination :"upload/"});*/
/* GET users listing. */
router.route('/').get(protect,users).post(/*upload.single("image")*/createUser);
// User login
router.post('/login',authUser);
router.post('/ologin',oauthLogin);
router.post('/logout',logOutUser);
// Get a user by id
router.route('/user/:id').get(protect,user).put(protect,protectMe,editUser).delete(protect,protectMe,delUser);
// follow user
router.post("/user/:id/follow",protect,followUser)

module.exports = router;
