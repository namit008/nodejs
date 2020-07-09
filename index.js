const express=require('express');
const app=express();
const mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./authenticate');
const student = require('./model/students');
const studentRouter = require('./routes/studentroute');
const faculty = require('./model/faculty');
const facultyRouter = require('./routes/facultyroute');
var config = require('./config');
const url = config.mongoUrl;
const notice = require('./model/notice');
const noticeRouter = require('./routes/noticerouter');
const uploadRouter = require('./routes/uploadrouter');


const connect = mongoose.connect(url);


connect.then((db) => {
    
    console.log('Connected correctly to server');
    
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/student', studentRouter);
    app.use('/faculty', facultyRouter);
    app.use('/notice', noticeRouter);
    app.use('/imageUpload',uploadRouter);



});
app.listen(3000, () => {
    console.log(' Server is running ');
  });
  function auth (req, res, next) {
    console.log(req.user);

    if (!req.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      next(err);
    }
    else {
          next();
    }
}


