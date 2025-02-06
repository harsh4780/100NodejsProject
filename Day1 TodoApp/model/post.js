const mongoose = require('mongoose');


const PostSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    taskStatus:{
        type:Boolean,
        default:false,
    }
});

module.exports = mongoose.model('post', PostSchema);