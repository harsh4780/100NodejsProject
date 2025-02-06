const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Day1TodoApp');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

module.exports = connect; 