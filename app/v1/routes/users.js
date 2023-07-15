const express = require('express');
const router = express.Router();
const {
  authUser,
  createUser,
  delUser,
  editUser,
  users,
  useR: user,
  followUser,
  unfollowUser,
  logOutUser,
  oauthLogin,
  getNotifications,
  postNotification,
  deleteNotification
} = require("../controllers/user");
const {
  protect,
  protectMe,
  protectNotification
} = require("../middlewares/auth");

// User login
router.post('/login', authUser);
router.post('/ologin', oauthLogin);
router.post('/logout', logOutUser);

// Get notifications for a user
router.route('/user/notifications/:id')
  .get(protect, getNotifications)
  .post(protect, postNotification);

router.delete("/user/:id/notifications/:notificationId", protect, protectNotification, deleteNotification);

// Follow/unfollow user
router.post("/user/:id/follow", protect, followUser);
router.post("/user/:id/unfollow", protect, unfollowUser);

// Get all users or create a new user
router.route('/').get(protect, users).post(createUser);

// Get a user by id, edit, or delete a user
router.route('/user/:id')
  .get(user)
  .put(protect, protectMe, editUser)
  .delete(protect, protectMe, delUser);

module.exports = router;
