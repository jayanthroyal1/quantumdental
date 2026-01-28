import app from '../server/server.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async (req, res) => {
    // 1. Check for critical environment variables
    if (!process.env.MONGO_URI) {
        return res.status(500).json({
            error: 'Server Misconfiguration',
            message: 'Missing Environment Variable: MONGO_URI'
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            error: 'Server Misconfiguration',
            message: 'Missing Environment Variable: JWT_SECRET'
        });
    }

    // 2. Ensure Database Connection
    // Using mongoose.connection.readyState to check: 0 = disconnected, 1 = connected, 2 = connecting
    if (mongoose.connection.readyState !== 1) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB Connected in Serverless Handler');
        } catch (err) {
            console.error('MongoDB Connection Error:', err);
            return res.status(500).json({
                error: 'Database Connection Failed',
                message: err.message
            });
        }
    }

    // 3. Delegate request to express app
    app(req, res);
};
