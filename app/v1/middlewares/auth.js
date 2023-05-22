const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (res,userId) =>{
   const token = jwt.sign({userId},process.env.SECRET,{
    expiresIn:"30d"
  })
  res.cookie('token',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV !== "development",
    sameSite:"strict",
    maxAge: 30*24*60*60*1000
  })
}
const protect = async (req,res,next) =>{
  const token = req.cookies.token;
  if (token) {

    const decodedUser = jwt.verify(token,process.env.SECRET).select("-password")
    if (decodedUser) {
      const { id } = decodedUser;
      const user = await User.findById(id)
      req.user = user;
      next()
    }else{
      res.status(400).json({"error":"Expired token"})
    }
  }else{
    res.status(400).json({"error":"No token"})
  }
}
const protectMe = async (req,res,next) =>{
  const { _id } = req.user
  if (_id) {
    
    if (_id.toHexString() === req.params.id) {
      next()
    } else {
      res.status(400).json({"error":"Not authorized"})
    }
  } else {
    res.status(400).json({"error":"No user"})
  }
}
const protectPost = async (req,res,next) =>{
  const { _id } = req.user
  if (_id) {
    console.log(req.body)
    if (_id.toHexString() === req.params.author) {
      next()
    } else {
      res.status(400).json({"error":"Not authorized"})
    }
  } else {
    res.status(400).json({"error":"No user"})
  }
}
module.exports = {
  protect,
  protectMe,
  protectPost,
  generateToken
}