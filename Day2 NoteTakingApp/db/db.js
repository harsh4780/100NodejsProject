const mongoose = require('mongoose');

const connect = async()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Day2NoteTakingApp' );
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB');
    }
}

module.exports = connect;