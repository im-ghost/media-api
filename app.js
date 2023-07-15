const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Server } = require("socket.io");
const http = require("http");
const indexRouter = require('./app/v1/routes/index');
const usersRouter = require('./app/v1/routes/users');
const notRouter = require('./app/v1/routes/not');
const postRouter = require('./app/v1/routes/posts');
require("dotenv").config()
const connectDB = require("./app/v1/config/db");
const { initializeSocket } = require("./app/v1/utils/socket");
connectDB()
const cors = require("cors")
const app = express();
const server = http.createServer(app)
initializeSocket(server,Server)
app.use(cors({
  origin:["http://localhost:3000"]
  }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/v1/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/not', notRouter);

// catch 404 and forward to error handler
app.use((req, res, next)=>{
  next(createError(404));
});

// error handler
app.use((err, req, res, next)=>{
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found"
  }
  // render the error page
  res.status(statusCode);
  res.send({
    message,
    stack:err.stack
  });
});
const port = process.env.PORT || 5000;
server.listen(port,()=>{
  console.log(`Running on port : ${port}`)
});
module.exports = app;