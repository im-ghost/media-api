const {
  handleLikePost,
  handleUnlikePost
} = require("./like.js")
const {
  handleLikeComment,
  handleUnlikeComment,
  handleCommentOnPost
} = require("./comment.js")
const {
  handleRetweetPost,
  handleUnretweetPost
} = require("./retweet.js");
const {
  handleDeleteMessage,
  handleEditMessage,
  handleSendMessage
} = require("./message.js")
function initializeSocketHandlers(socketId,socket, io) {
  socket.on('likepost', ({ postId, userId }) => {
    handleLikePost(io, socketId, postId, userId);
  });

  socket.on('unlikepost', ({ postId, userId }) => {
    handleUnlikePost(io, socketId, postId, userId);
  });

  socket.on('retweetpost', ({ postId, userId }) => {
    handleRetweetPost(io, socketId, postId, userId);
  });

  socket.on('unretweetpost', ({ postId, userId }) => {
    handleUnretweetPost(io, socketId, postId, userId);
  });

  socket.on('commentonpost', ({ postId, userId, comment }) => {
    handleCommentOnPost(io, socketId, postId, userId, comment);
  });

  socket.on('likecomment', ({ userId, commentId }) => {
    handleLikeComment(io, socketId, userId, commentId);
  });

  socket.on('unlikecomment', ({ userId, commentId }) => {
    handleUnlikeComment(io, socketId, userId, commentId);
  });
  socket.on('sendMessage',({
  userId,
  chatId,
  message}) => {
    handleSendMessage({
       io, socketId,
  userId,
  chatId,
  message
    })
  })
  socket.on('deleteMessage',({
  messageId,
  chatId,
  }) => {
    handleDeleteMessage({
       io, socketId,
  messageId,
  chatId
    })
  })
  socket.on('editMessage',({
  messageId,
  chatId,
  message}) => {
    handleEditMessage({
       io, socketId,
  messageId,
  chatId,
  message
    })
  })
  socket.on('test', (data) => {
    //handleTest(io, socketId, data);
  });

  socket.emit('connected', 'Successfully connected to the server');
   socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
}

module.exports = {
  initializeSocketHandlers,
};
