const express = require("express");
const router = express.Router();

const {
  createPost,
  delPost,
  editPost,
  posts,
  posT,
  userPost,
  commentPost,
  likePost,
  retweetPost
} = require("../controllers/post")
const {
  protect,
  protectMe,
  protectPost
 } = require("../middlewares/auth")
/* GET posts listing. */
router.route("/").get(protect,posts).post(createPost);
// Get a user's post listings 
router.post('/post/user/:id',userPost);
// Get a post by id
router.get('/post/:id',posT);
// Update a posts information 
// delete a post's account 

router.put("/post/like/:id/",protect,likePost)
// comment on a post 
router.put("/post/comment/:id/",protect,commentPost)
router.put("/post/like/:id/",protect,likePost)
// retweet on a post 
router.put("/post/retweet/:id/",protect,retweetPost)
router.delete('/post/:id/:author',protect,protectPost,delPost);

router.put('/post/:id/:author',protect,protectPost,editPost);
// Posts reactions
// Like a post

module.exports = router
