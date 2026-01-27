import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        // Password is not required if using Google Sign-In
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    googleId: {
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
