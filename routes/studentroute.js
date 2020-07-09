const express = require('express');
const bodyParser = require('body-parser');


const student = require('../model/students');

const studentRouter = express.Router();

studentRouter.use(bodyParser.json());
var passport = require('passport');



studentRouter.post('/signup', (req, res, next) => {
 // User.register(new User({username: req.body.username}), 
  Users=new student({studentId : req.body.studentId, username : req.body.username}); 
  student.register(Users, req.body.password, function(err, user) { 

 //req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

studentRouter.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
});

studentRouter.route('/')
.get((req,res,next) => {
    student.find({})
    .then((std) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(std);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    student.create(req.body)
    .then((std) => {
        console.log('student Created ', std);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(std);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /student');
})
.delete((req, res, next) => {
    student.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});
module.exports = studentRouter;