const express = require('express');
const app=express();
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const faculty = require('../model/faculty');

const facultyRouter = express.Router();

facultyRouter.use(bodyParser.json());
var passport = require('passport');


var LocalStrategy = require('passport-local').Strategy;

var nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');
app.use(flash());


facultyRouter.post('/signup', (req, res, next) => {
 // User.register(new User({username: req.body.username}),
  Users=new faculty({femail : req.body.femail, username : req.body.username});
  faculty.register(Users, req.body.password, function(err, user) {

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

passport.use(new LocalStrategy({usernameField:'femail'},function(femail, password, done) {
    faculty.findOne({
        femail: femail

    }, function(err, user) {
      console.log(femail);

        // This is how you handle error
        if (err) {
console.log('errrrrrrrrrrrrrrr');
          return done(err);}
        // When user is not found
        if (!user) {
console.log('erororooroor');
          return done(null, false);}
        // When password is not correct
        if (!user.authenticate(password)) {
console.log('passssssssssss');
          return done(null, false);}
        // When all things are good, we return the user
      /*  res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true,token:token, status: 'You are successfully logged in!'});
*/
        return done(null, user);

     });
}
));



facultyRouter.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true,token:token, status: 'You are successfully logged in!'});
});



facultyRouter.route('/')
.get((req,res,next) => {
    faculty.find({})
    .then((std) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(std);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    faculty.create(req.body)
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
    faculty.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

facultyRouter.get('/forgot', function(req, res) {
   return res.status(201).json({message: 'The email address is not associated with any account. Double-check your email address and try again.'});

  res.render('forgot', {
   user: req.user
  });
});


facultyRouter.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        console.log("hello token");
        var token = buf.toString('hex');
        done(err, token);
        console.log("hello done");
      });
    },
    function(token, done) {
    //  Userss=new faculty({femail:req.body.femail});
      faculty.findOne({femail: req.body.femail})
        .then(user => {
            if (!user) return res.status(401).json({message: 'The email address ' + req.body.femail + ' is not associated with any account. Double-check your email address and try again.'});

    /*  faculty.findOne(Userss, function(err, user) {
        if (!user) {
        console.log(Userss);

console.log('email not exists');*/
        //  req.flash('error', 'No account with that email address exists.');


        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
console.log("email exists");
//console.log(email);
console.log(token);
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },




//This is using sendgrid .I an not performing using sendgrid because my domain and sender are not authenticated
  /*  function(token, user, done) {
          var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'SendGrid',
            auth: {
              user: '!!! YOUR SENDGRID USERNAME !!!',
              pass: '!!! YOUR SENDGRID PASSWORD !!!'
            }
          });*/
        /*  smtpTransport.sendMail(mailOptions, function(err) {
                  req.flash('success', 'Success! Your password has been changed.');
                  done(err);*/






    function(token, user, done) {
      var Transport = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 587,
        sercure:false,
        requireTLS:true,

    /*  var smtpTransport = nodemailer.createTransport(
        sendgridTransport({*/

          auth: {
            //  console.log("hello mail");
            user: "npatni846@gmail.com",    // SendGrid Username
            pass: "sfrgboxydrrulhpq"    // SendGrid Password
          }


        }


      );
      console.log("hiiiiiiiiiiiiiiii");

      // Email Details
      var mailOptions = {
        to: user.femail,
        from: 'passwordreset@demo.com',
        subject: 'Express.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      console.log(user.femail);
console.log("mail sent");
      // Send Email
    /*  sendgrid.send(femail,(err, json) => {
              if(err) {
                  return console.error(err);
                }

              console.log(json);
            //  req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
              done(err, 'done');*/
      //    });
      Transport.sendMail(mailOptions, (err,done) => {
        if (err) {
          return next(err);
          console.log("mail not send");
          // handle error
        } else {
           console.log("yupppppppppppppp");
          // handle success
          console.log('info', 'An e-mail has been sent to ' + user.femail + ' with further instructions.');
return res.status(201).json({message:  'An e-mail has been sent to ' + user.femail + ' with further instructions.'});

        //  req.flash('info', 'An e-mail has been sent to ' + user.femail + ' with further instructions.');
          done(err, 'done');
          console.log('hqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
          return res.status(201).json({message:  'An e-mail has been sent to ' + user.femail + ' with further instructions.'});
        }
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

facultyRouter.get('/reset/:token', function(req, res) {
  faculty.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {

//  faculty.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
    //  req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
});

facultyRouter.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      faculty.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeee");

    //      req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            console.log(user.password);
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var Transport = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 587,
        sercure:false,
        requireTLS:true,
        auth: {
          //  console.log("hello mail");
          user: "npatni846@gmail.com",    // SendGrid Username
          pass: "sfrgboxydrrulhpq"    // SendGrid Password
        }


      }


    );
    console.log("hiiiiiiiiiiiiiiii");


      // Email Details
      var mailOptions = {
        to: user.femail,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.femail + ' has just been changed.\n'
      };

      // Send Email
      Transport.sendMail(mailOptions, (err, resp) => {
        if (err) {
          // handle error
        } else {
          return res.status(201).json({message:  'An password has been reset'});

          // handle success
        //  req.flash('success', 'Success! Your password has been changed.');
          done(err);
        }
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

facultyRouter.get('/:facultyId',(req,res,next)=>{
  faculty.findById(req.params.facultyId).then((dishes) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dishes);
          }, (err) => next(err)).catch((err) => next(err));
      });


module.exports = facultyRouter;
