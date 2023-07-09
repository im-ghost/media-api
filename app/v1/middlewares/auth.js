const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken = (userId) =>{
  const id = userId.toString();
   const token = jwt.sign({id},process.env.SECRET,{
    expiresIn:"30d"
  })

  return token;
}
const protect = async (req,res,next) =>{
  const token = req.headers.authorization;
  if (token) {
   
    const decodedUser = jwt.verify(token,process.env.SECRET)
    if (decodedUser) {
      const { id } = decodedUser;
      const user = await User.findById(id)
     
      if(user){
      req.user = user;
      
      next()
      }else{
        res.status(400).json({"error":"Expired token,no user"})
      }
    }else{
      res.status(400).json({"error":"Expired token"})
    }
  }
  else{
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