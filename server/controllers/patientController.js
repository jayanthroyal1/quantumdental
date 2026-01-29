import User from '../models/User.js';
import PatientRecord from '../models/PatientRecord.js';

// Search for users by name or email
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        console.log(`[User Search] Query: ${query}`);

        // Find users with role 'user' relating to the query
        // Performance: Limit to 20 results
        const users = await User.find({
            role: 'user',
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        })
            .select('name email') // Only return necessary fields
            .limit(20);

        res.json(users);
    } catch (error) {
        console.error('[User Search Error]:', error);
        res.status(500).json({ message: 'Server error searching users', error: error.message });
    }
};

// Add a patient record (File or Prescription)
export const addPatientRecord = async (req, res) => {
    try {
        const { userId, text, type } = req.body;
        // Check if req.user exists (middleware safety)
        if (!req.user || !req.user.id) {
            console.error('[Add Record Error] Missing user in request (Auth Middleware failed?)');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const adminId = req.user.id;

        console.log(`[Add Record] Admin: ${adminId}, For User: ${userId}, Type: ${type}`);

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
        console.log(`[Add Record] Success: ${newRecord._id}`);

        res.status(201).json({ message: 'Record added successfully', record: newRecord });
    } catch (error) {
        console.error('[Add Record Error]:', error);
        res.status(500).json({ message: 'Server error adding record', error: error.message });
    }
};

// Get records for a specific user (Protected, for transparency later)
export const getPatientRecords = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!req.user) {
            console.error('[Get Records Error] No user in request');
            return res.status(403).json({ message: 'Not authorized' });
        }

        console.log(`[Get Records] Request for userId: ${userId}`);
        console.log(`[Get Records] Requester: ${req.user.id} (Role: ${req.user.role})`);

        // Verify that the requester is the user themselves or an admin
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            console.log(`[Get Records] Authorization Failed`);
            return res.status(403).json({ message: 'Not authorized' });
        }

        const records = await PatientRecord.find({ userId }).sort({ createdAt: -1 });
        console.log(`[Get Records] Found ${records.length} records`);

        res.json(records);
    } catch (error) {
        console.error('[Get Records Error]:', error);
        res.status(500).json({ message: 'Server error fetching records', error: error.message });
    }
};

// Update a patient record
export const updatePatientRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        console.log(`[Update Record] ID: ${id}`);

        const record = await PatientRecord.findById(id);
        if (!record) {
            console.log(`[Update Record] Not Found`);
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
        console.error("[Update Record Error]:", error);
        res.status(500).json({ message: 'Server error updating record', error: error.message });
    }
};
