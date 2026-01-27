import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { searchUsers, addPatientRecord, getPatientRecords, updatePatientRecord } from '../controllers/patientController.js';
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

router.get('/search', verifyToken, searchUsers);
router.post('/record', verifyToken, upload.single('file'), addPatientRecord);
router.put('/record/:id', verifyToken, upload.single('file'), updatePatientRecord);
router.get('/records/:userId', verifyToken, getPatientRecords);

export default router;
