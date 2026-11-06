import mongoose from 'mongoose';

/**
 * Connect to MongoDB database via Mongoose
 */
export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillora');
    console.log(`[Skillora Server] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Skillora Server] MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;

