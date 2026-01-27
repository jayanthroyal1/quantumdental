import User from '../models/User.js';
import PatientRecord from '../models/PatientRecord.js';

// Search for users by name or email
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        // Find users with role 'user' relating to the query
        const users = await User.find({
            role: 'user',
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('name email'); // Only return necessary fields

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add a patient record (File or Prescription)
export const addPatientRecord = async (req, res) => {
    try {
        const { userId, text, type } = req.body;
        const adminId = req.user.id; // Assumes auth middleware populates req.user

        if (!userId || !type) {
            return res.status(400).json({ message: 'User ID and Type are required' });
        }

        const newRecord = new PatientRecord({
            userId,
            adminId,
            type,
            text,
            fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
            originalName: req.file ? req.file.originalname : null
        });

        await newRecord.save();

        res.status(201).json({ message: 'Record added successfully', record: newRecord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get records for a specific user (Protected, for transparency later)
export const getPatientRecords = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[getPatientRecords] Request for userId: ${userId}`);
        console.log(`[getPatientRecords] Requester: ${req.user.id} (Role: ${req.user.role})`);

        // Verify that the requester is the user themselves or an admin
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            console.log(`[getPatientRecords] Authorization Failed`);
            return res.status(403).json({ message: 'Not authorized' });
        }

        const records = await PatientRecord.find({ userId }).sort({ createdAt: -1 });
        console.log(`[getPatientRecords] Found ${records.length} records`);

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a patient record
export const updatePatientRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const record = await PatientRecord.findById(id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Update fields if provided
        if (text !== undefined) record.text = text;

        // Handle file update if a new file is uploaded
        if (req.file) {
            // In a real app, delete the old file here
            record.fileUrl = `/uploads/${req.file.filename}`;
            record.originalName = req.file.originalname;
            // Ensure type is updated if it was just a prescription before
            record.type = 'file';
        }

        await record.save();
        res.json({ message: 'Record updated successfully', record });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
