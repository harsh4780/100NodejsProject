const mongoose = require('mongoose');


const FileSchema = new mongoose.Schema({
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('file', FileSchema);