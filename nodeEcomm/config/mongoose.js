const mongoose = require("mongoose");

const ConnectDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB connected");
    })
    .catch((err) => {
      console.error("❌ Database connection error:", err);
    });
};

module.exports = ConnectDB;
