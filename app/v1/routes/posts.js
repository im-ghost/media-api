const express = require("express");
const router = express.Router();

const {
  createPost,
  delPost,
  editPost,
  posts,
  posT,
  userPost,
  getComment,
  deleteComment,
  editComment
} = require("../controllers/post")
const {
  protect,
  protectMe,
  protectPost,
  protectComment
 } = require("../middlewares/auth")
/* GET posts listing. */
router.route("/").get(protect,posts).post(protect,createPost);
router.route("/comments/:id").get(getComment).put(protect,protectComment,editComment).delete(protect,protectComment,deleteComment);
// Get a user's post listings 
router.post('/post/user/:id',userPost);
// Get a post by id
router.get('/post/:id',posT);
// Update a posts information 
// delete a post's account 
router.delete('/post/:id/:author',protect,protectPost,delPost);

router.put('/post/:id/:author',protect,protectPost,editPost);
// Posts reactions
// Like a post

module.exports = router
