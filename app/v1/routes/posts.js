const express = require("express");
const router = express.Router();

const {
  createPost,
  delPost,
  editPost,
  posts,
  post,
  userPost,
  commentPost,
  likePost
} = require("../controllers/post")
const {
  protect,
  protectMe
 } = require("../middlewares/auth")
/* GET posts listing. */
router.get('/',protect,posts);
//create a new post
router.post('/',createPost);
// Get a user's post listings 
router.post('/post/user/:id',userPost);
// Get a post by id
router.get('/post/:id',protect,post);
// Update a posts information 
router.put('/post/:id',protect,protectMe,editPost);
// delete a post's account 
router.delete('/post/:id',protect,protectMe,delPost);
// Posts reactions
// Like a post

router.post("/post/:id/like",protect,likePost)
// comment on a post 
router.post("/post/:id/comment",protect,commentPost)
module.exports = router
