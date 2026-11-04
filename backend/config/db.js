const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URL
        || process.env.MONGODB_URI
        || 'mongodb://127.0.0.1:27017/medinest';

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');
};

module.exports = connectDB;
