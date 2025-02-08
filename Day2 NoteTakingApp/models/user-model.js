const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    notes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'note'
    }]
});


module.exports = mongoose.model('user', userSchema);
