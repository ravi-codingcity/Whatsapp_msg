const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://papanpillo56kilo:Ravi789K@cluster.nu5wi.mongodb.net/whatsapp_msg?retryWrites=true&w=majority&appName=Cluster";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });

    console.log("✅ MongoDB Connected:", conn.connection.host);

    // Drop old indexes if they exist
    const collections = await conn.connection.db.collections();
    for (let collection of collections) {
      try {
        await collection.dropIndex('refNo_1');
      } catch (err) {
        // Index doesn't exist, ignore
      }
    }

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit if cannot connect
  }
};

module.exports = connectDB;
