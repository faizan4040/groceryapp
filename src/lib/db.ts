import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/groceryapp';

if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in environment variables');
}

const cache = global.mongoose;

if (!cache) {
    global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cache.conn) {
        return cache.conn;
    }

    if (!cache.promise) {
        cache.promise = mongoose.connect(mongoURI).then((conn) =>conn.connection)
    }
    try{
        const conn=await cache.promise 
        return conn 
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }

}

export default connectDB;