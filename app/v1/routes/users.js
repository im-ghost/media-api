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
  logOutUser
} = require("../controllers/user")
const {
  protect,
  protectMe
 } = require("../middlewares/auth")
/* GET users listing. */
router.route('/').get(protect,users).post(createUser);
// User login
router.post('/user/login',authUser);
router.post('/user/logout',logOutUser);
// Get a user by id
router.route('/user/:id').get(protect,user).put(,protect,protectMe,editUser).delete(protect,protectMe,delUser);
// follow user
router.post("/user/:id/follow",protect,followUser)

module.exports = router;
