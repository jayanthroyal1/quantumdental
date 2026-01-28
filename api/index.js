import app, { connectDB } from '../server/server.js';
import dotenv from 'dotenv'; // Load dotenv here just in case, though server.js does it too

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

    // 2. Ensure Database Connection using shared logic
    try {
        await connectDB();
    } catch (err) {
        return res.status(500).json({
            error: 'Database Connection Failed',
            message: err.message
        });
    }

    // 3. Delegate request to express app
    app(req, res);
};
