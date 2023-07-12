// socket.js
const {
  likePost,
  likecomment,
  unlikecomment,
  commentOnPost,
  unlikePost,
  retweetPost,
  unretweetPost
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
    socket.on('likepost', ({postId,userId})=>{
       const post = likePost(postId,userId)
       post
       .then(res =>{
          io.emit(`likedpost-${postId}`,res)
       }).catch(e=>{
         io.emit("error")
       })
      
    });
    socket.on('unlikepost', ({postId,userId})=>{
       const post = unlikePost(postId,userId)
        post
       .then(res =>{
          io.emit(`unlikedpost-${postId}`,res)
       }).catch(e=>{
         io.emit("error")
       })
    });
    socket.on('retweetpost', ({postId,userId})=>{
       const res = retweetPost(postId,userId)
       res
       .then(data =>{
          io.emit(`retweetedpost-${postId}`,data)
       }).catch(e=>{
         io.emit("error")
       })
    });
    socket.on('unretweetpost', ({postId,userId})=>{
       const res = unretweetPost(postId,userId)
       res
       .then(data =>{
          io.emit(`unretweetedpost-${postId}`,data)
       }).catch(e=>{
         io.emit("error")
       })
    });
    
    socket.on('commentonpost', ({postId,userId, comment})=>{
      const post = commentOnPost(comment,userId,postId)
      post
      .then(res =>{
      io.emit(`commentedonpost-${postId}`,res)
      })
      .catch(e=>{
        io.emit("error")
      })
    });
    socket.on('likecomment', ({userId, commentId})=>{
      const post = likecomment(commentId,userId)
      post
      .then(res =>{
        console.log("emmited");
      io.emit(`likedcomment-${commentId}`,res)
      })
      .catch(e=>{
        io.emit("error")
      })
    });
    socket.on('unlikecomment', ({userId, commentId})=>{
      const post = unlikecomment(commentId,userId)
      post
      .then(res =>{
      io.emit(`unlikedcomment-${commentId}`,res)
      })
      .catch(e=>{
        io.emit("error")
      })
    });
    socket.on('test', (data)=>{
      console.log(data);
      io.emit('tested',data)
    });
    socket.emit('connected', 'Successfully connected to the server');
/*  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });*/

  });
}


module.exports = {
  initializeSocket,
};
