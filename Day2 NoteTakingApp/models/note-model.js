const mongoose =require('mongoose');

const noteSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    lastModified:{
        type:Date,
        default:Date.now
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
});

module.exports = mongoose.model('note', noteSchema);