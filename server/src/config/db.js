import mongoose from 'mongoose';

/**
 * Connect to MongoDB database via Mongoose
 */
let isConnecting = false;

/**
 * Connect to MongoDB database via Mongoose with resilient auto-reconnect
 */
export async function connectDB() {
  if (isConnecting || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  isConnecting = true;
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillora';

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log(`[Skillora Server] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    console.warn(`[Skillora Server] Notice: MongoDB not connected at ${uri} (${error.message}). Server running with auto-reconnect.`);
    isConnecting = false;
    // Auto retry connection in background every 5 seconds
    setTimeout(() => {
      connectDB().catch(() => {});
    }, 5000);
    return null;
  }
}

export default connectDB;

