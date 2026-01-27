import mongoose from 'mongoose';

const patientRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['prescription', 'file'],
        required: true,
    },
    fileUrl: {
        type: String, // Path to the uploaded file
    },
    text: {
        type: String, // Prescription text or notes
    },
    originalName: {
        type: String, // Original filename
    }
}, { timestamps: true });

export default mongoose.model('PatientRecord', patientRecordSchema);
