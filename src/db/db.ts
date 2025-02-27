import mongoose from "mongoose";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSERNAME,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT as string),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected successfully");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL error:", err);
});

export const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("🛑 MongoDB disconnected.");
    await pool.end();
    console.log("🛑 PostgreSQL pool closed.");
  } catch (error) {
    console.error("❌ Error disconnecting databases:", error);
  }
};
