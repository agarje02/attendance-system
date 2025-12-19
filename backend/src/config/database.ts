import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const mogodbURI = process.env.MONGODB_URI as string;
        await mongoose.connect(mogodbURI);
        
        await mongoose.connection.db?.admin().command({ ping: 1 });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
   
};
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected successfully");
    } catch (error) {
        console.error('MongoDB disconnection error:', error);
        process.exit(1);
    }
}
export { connectDB, disconnectDB };