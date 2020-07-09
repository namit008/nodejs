const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
const studentschema = new Schema({
   studentId:{
       type:Number,
       default:" " 
    },
  
    admin:   {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});
studentschema.plugin(passportLocalMongoose);


module.exports =  mongoose.model('student',studentschema);