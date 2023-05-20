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
  likePost
} = require("../controllers/post")
const {
  protect,
  protectMe,
  protectPost
 } = require("../middlewares/auth")
/* GET posts listing. */
router.get('/',protect,posts);
//create a new post
router.post('/',createPost);
// Get a user's post listings 
router.post('/post/user/:id',userPost);
// Get a post by id
router.get('/post/:id',protect,posT);
// Update a posts information 
router.put('/post/:id/:author',protect,protectPost,editPost);
// delete a post's account 

router.put("/post/:id/like",protect,likePost)
// comment on a post 
router.put("/post/:id/comment",protect,commentPost)
router.delete('/post/:id/:author',protect,protectPost,delPost);
// Posts reactions
// Like a post

module.exports = router
