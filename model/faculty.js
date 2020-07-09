const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
const facultyschema = new Schema({
   femail:{
       type:String,
       default:" ",
       unique:true
    },

    admin:   {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    }
},



{
    timestamps: true
});
facultyschema.plugin(passportLocalMongoose);


module.exports =  mongoose.model('faculty',facultyschema);
