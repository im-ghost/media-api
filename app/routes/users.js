const express = require('express');
const router = express.Router();
const {
  authUser,
  createUser,
  delUser,
  editUser,
  users,
  user,
  followUser
} = require("../Controllers/user")
const {
  protect,
  protectMe
 } = require("../middlewares/auth")
/* GET users listing. */
router.get('/',protect,users);
//create a new user
router.post('/',createUser);
// User login
router.post('/user/login',authUser);
// Get a user by id
router.get('/user/:id',protect,user);
// Update a users information 
router.put('/user/:id',protect,protectMe,editUser);
// delete a user's account 
router.delete('/user/:id',protect,protectMe,delUser);
// follow user
router.post("/user/:id/follow",protect,followUser)

module.exports = router;
