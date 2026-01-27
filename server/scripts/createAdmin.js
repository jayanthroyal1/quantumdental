import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const args = process.argv.slice(2);
        const email = args[0] || 'admin@quantum.com';
        const password = args[1] || 'admin123';
        const name = args[2] || 'Admin User';

        const userExists = await User.findOne({ email });

        if (userExists) {
            if (userExists.role === 'admin') {
                console.log('User is already an admin');
                process.exit(0);
            }
            userExists.role = 'admin';
            await userExists.save();
            console.log(`User ${email} promoted to Admin`);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
        });

        await user.save();
        console.log(`Admin user created: ${email} / ${password}`);
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
