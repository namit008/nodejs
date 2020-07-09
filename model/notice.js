const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noticeschema = new Schema({
    department:{
        type:String,
        required:true,
        default:""
    },
    topic:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:1
    },
    image:{
         type:String


    }
});

module.exports =  mongoose.model('notice',noticeschema);
