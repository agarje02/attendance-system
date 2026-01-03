import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables BEFORE importing PrismaClient
dotenv.config();

import { PrismaClient } from '../generated/prisma/client';
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaNeon(pool.options);

// Prisma Client Singleton
// Prevents multiple instances of PrismaClient in development (hot reload)
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({adapter: adapter} as any);

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

const connectDB = async () => {
    try {
        // const mogodbURI = process.env.MONGODB_URI as string;
        // await mongoose.connect(mogodbURI);
        
        // await mongoose.connection.db?.admin().command({ ping: 1 });
        // console.log('MongoDB connected successfully');
        // Prisma connects automatically on first query, but you can test connection here:
        await prisma.$connect();
        console.log('Prisma connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
   
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        await prisma.$disconnect();
        console.log("Database disconnected successfully");
    } catch (error) {
        console.error('Database disconnection error:', error);
        process.exit(1);
    }
}

export { connectDB, disconnectDB };