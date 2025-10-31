const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://papanpillo56kilo:Ravi789K@cluster.nu5wi.mongodb.net/whatsapp_msg?retryWrites=true&w=majority&appName=Cluster";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });

    console.log("✅ MongoDB Connected:", conn.connection.host);

    // Add connection error handler
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    // Add disconnection handler
    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected, attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit if cannot connect
  }
};

module.exports = connectDB;
