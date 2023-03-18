const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const generateToken = (id) =>{
  return jwt.sign({id},process.env.SECRET,{
    expiresIn:"30d"
  })
}
const protect = async (req,res,next) =>{
  const token = req.headers.authorization;
  if (token) {
 
    const decodedUser = jwt.verify(token,process.env.SECRET)
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
module.exports = {
  protect,
  protectMe,
  generateToken
}