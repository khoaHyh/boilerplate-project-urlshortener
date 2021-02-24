require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    console.error(`Initial connection error: ${error}`);
  }
}

module.exports = connectDB;
