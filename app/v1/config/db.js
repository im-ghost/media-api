const mongoose = require("mongoose")
require("dotenv").config()
const connectDB = async () =>{
  const mongouri = process.env.MONGO_URI;
  
  if(!mongouri){
    throw new Error("No mongodb uri")
  }
  try {
    const connection = await  mongoose.connect(mongouri,{
       useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("Connected:"+connection.host)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

module.exports = connectDB