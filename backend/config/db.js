const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
    if (!mongoUri) {
        throw new Error('MONGODB_URI or MONGO_URL must be configured');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected Successfully');
};

module.exports = connectDB;