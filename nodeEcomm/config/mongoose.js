require('dotenv').config();
const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        // If MONGO_URI is not found in .env, use default URI
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/your-database";
        await mongoose.connect(uri);
        console.log("Connected to database successfully");
    } catch(err) {
        console.log("Database connection error:", err.message);
        throw err;
    }
}

module.exports = connectToDatabase;