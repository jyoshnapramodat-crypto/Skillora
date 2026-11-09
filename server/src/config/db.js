import mongoose from 'mongoose';

/**
 * Connect to MongoDB database via Mongoose
 * Seamlessly supports both local MongoDB and MongoDB Atlas connection URIs
 * (e.g. mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillora?retryWrites=true&w=majority)
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillora';
  const isAtlas = uri.startsWith('mongodb+srv://') || uri.includes('mongodb.net');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s if cluster unreachable
      autoIndex: true
    });

    const hostType = isAtlas ? 'MongoDB Atlas Cloud' : 'MongoDB Local';
    console.log(`[Skillora Server] ${hostType} Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Skillora Server] MongoDB Connection Error: ${error.message}`);
    if (isAtlas) {
      console.error(`[Skillora Server] Tip: Check that your MongoDB Atlas IP whitelist allows 0.0.0.0/0 (or your server's IP) and database user credentials are correct.`);
    }
    // Do not crash the server in serverless/cloud environments immediately; throw for caller to handle
    throw error;
  }
}

export default connectDB;
