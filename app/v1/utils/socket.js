// socket.js
const {
  likePost,
  commentOnPost
} = require("./utils.js")
let io;
function initializeSocket(server,Server) {
   io = new Server(server,{
     cors:{
       origin:["http://localhost:3000"]
     }
   })

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle custom events
    socket.on('likePost', ({postId,userId})=>{
       const post = likePost(postId,userId)
      if(typeof(post).toLowerCase() === "object"){
      io.emit("likedPost",post)
      }else{
        io.emit("errorLiking")
      }
    });
    socket.on('commentOnPost', ({postId,userId, comment})=>{
      const post = commentOnPost(postId,userId, comment)
      if(typeof(post).toLowerCase() === "object"){
      io.emit("commentedOnPost",post)
      }else{
        io.emit("errorCommenting")
      }
    });
    socket.on('test', (data)=>{
      io.emit('tested',data)
    });
    socket.emit('connected', 'Successfully connected to the server');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  });
}


module.exports = {
  initializeSocket,
};
