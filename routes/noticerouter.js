const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const notice = require('../model/notice');
const multer = require('multer');
var path= require('path');
const fs=require('fs');
const noticeRouter = express.Router();

noticeRouter.use(bodyParser.json());
noticeRouter.use(express.static(__dirname+"./public/"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null,file.originalname);
    }
});

const FileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|MP4|mp4)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage,FileFilter:FileFilter});




noticeRouter.route('/')
.get((req,res,next) => {
    notice.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser upload.single('noticeImage'),(req, res, next) => {
console.log(req.file);
    var note= new notice({

        department: req.body.department,
        topic:req.body.topic,
        name:req.body.name,
        image:req.file.path
      /*  image:{
            data:fs.readFileSync(path.join(--dirname+'/images/' + req.file.filename))
        }*/
    });
    note.save()
    .then((dish)=>{
      console.log('notice created',dish);
      res.statusCode=200;
      res.json(dish);
    },
    (err)=>next(err))
    .catch((err)=>next(err));

  /*  console.log(note);
     note.save()
     .then(doc=>{
       res.status(201).json({
         message:"Product inserted",
         results:doc
       })
       .catch(err=>{
         res.json(err);
       });
     })*/

  /*  notice.create(obj,(err,item) => {
    if (err) {
        console.log(err);
    }
    else {
        // item.save();
        res.redirect('/');
    }
  });*/
})
    /*.then((dish) => {
        console.log('notice Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //res.json(dish);
        //res.json(req.file);

    }, (err) => next(err))
    .catch((err) => next(err));
})*/

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    notice.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});




module.exports = noticeRouter;
