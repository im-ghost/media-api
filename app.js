const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./app/v1/routes/index');
const usersRouter = require('./app/v1/routes/users');
const postRouter = require('./app/v1/routes/posts');
require("dotenv").config()
const connectDB = require("./app/v1/config/db");
connectDB()
const cors = require("cors")
const app = express();
app.use(cors({
  origin:["localhost:3000"]
  }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postRouter);

// catch 404 and forward to error handler
app.use((req, res, next)=>{
  next(createError(404));
});

// error handler
app.use((err, req, res, next)=>{
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  if(err.name
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
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
app.listen(port,()=>{
  console.log(`Running on port : ${port}`)
})
module.exports = app;
