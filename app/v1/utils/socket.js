// socket.js
const { initializeSocketHandlers } = require("./handlers.js");


function initializeSocket(server, Server) {
  // Initialize the socket server
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });

  // Handle socket connection
  io.on('connection', (socket) => {
    console.log('New client connected');
    const socketId = socket.id;
    // Call socket handlers
    initializeSocketHandlers(socketId,socket, io);
  });
}


module.exports = {
  initializeSocket,
};
