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
  unfollowUser,
  logOutUser,
  oauthLogin,
  getNotifications,
  postNotification,
  deleteNotification
} = require("../controllers/user")
const {
  protect,
  protectMe,
  protectNotification
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
router.route('/user/:id').get(user).put(protect,protectMe,editUser).delete(protect,protectMe,delUser);
router.route('/user/:id/notifications').get(protect,getNotifications).post(protect,postNotification)
router.delete("/user/:id/notifications/notificationId",protect,protectNotification,deleteNotification);
// follow user
router.post("/user/:id/follow",protect,followUser)
router.post("/user/:id/unfollow",protect,unfollowUser)

module.exports = router;
