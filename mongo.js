const mongoose = require('mongoose');
const config = require('../../config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongouri, {
         /*   useNewUrlParser: true,
            useUnifiedTopology: true */
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectDB;
