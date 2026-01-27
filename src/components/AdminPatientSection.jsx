import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingElement from './FloatingElement';
import { Upload, Search, User, FileText, CheckCircle, AlertCircle, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPatientSection = () => {
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [prescriptionText, setPrescriptionText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [uploading, setUploading] = useState(false);

    const [userRecords, setUserRecords] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);

    // Search Users
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            try {
                const res = await axios.get(`/patients/search?query=${query}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSearchResults(res.data);
            } catch (error) {
                console.error("Search error", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        setSearchQuery('');
        setSearchResults([]);
        // Reset form state on new selection
        setPrescriptionText('');
        setSelectedFile(null);
        setEditingRecord(null);
        setStatus({ type: '', message: '' });

        // Fetch existing records
        try {
            const res = await axios.get(`/patients/records/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserRecords(res.data);
        } catch (error) {
            console.error("Error fetching records:", error);
        }
    };

    const handleDeselectUser = () => {
        setSelectedUser(null);
        setUserRecords([]);
        setEditingRecord(null);
        // Reset form state on deselect
        setPrescriptionText('');
        setSelectedFile(null);
        setStatus({ type: '', message: '' });
    };

    const handleEditRecord = (record) => {
        setEditingRecord(record);
        setPrescriptionText(record.text || '');
        setSelectedFile(null); // Reset file input, show current file name in UI if needed?
        setStatus({ type: 'info', message: 'Editing existing record' });

        // Scroll to form
        const formElement = document.getElementById('record-form');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAddNew = () => {
        setEditingRecord(null);
        setPrescriptionText('');
        setSelectedFile(null);
        setStatus({ type: 'info', message: 'Creating new record' });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            setStatus({ type: 'error', message: 'Please select a patient first.' });
            return;
        }

        if (!prescriptionText.trim() && !selectedFile && !editingRecord) { // Allow update without new file/text if just implicit save? actually no, need change.
            // If editing, text might be changed. File might be same (null).
            if (!prescriptionText.trim() && !selectedFile) {
                setStatus({ type: 'error', message: 'Please enter a prescription or upload a file.' });
                return;
            }
        }

        setStatus({ type: '', message: '' });
        setUploading(true);

        const formData = new FormData();
        formData.append('userId', selectedUser._id);

        // Determine type based on content logic for new records
        // For updates, we keep type or update it? 
        // Logic: if file exists -> file. else prescription.
        const type = selectedFile ? 'file' : 'prescription';
        formData.append('type', type);

        // Always append text (even if empty) to ensure updates work correctly if user clears text
        formData.append('text', prescriptionText || '');
        if (selectedFile) formData.append('file', selectedFile);

        try {
            if (editingRecord) {
                // Update Logic
                await axios.put(`/patients/record/${editingRecord._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setStatus({ type: 'success', message: 'Record updated successfully!' });

                // Update local list
                const updatedRecords = await axios.get(`/patients/records/${selectedUser._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserRecords(updatedRecords.data);

            } else {
                // Create Logic
                await axios.post('/patients/record', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setStatus({ type: 'success', message: 'Record saved successfully!' });
                // Refresh list
                const updatedRecords = await axios.get(`/patients/records/${selectedUser._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserRecords(updatedRecords.data);
            }

            setPrescriptionText('');
            setSelectedFile(null);
            setEditingRecord(null);

            // Auto-clear success message after 3 seconds
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);

        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Failed to save record.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <section id="patient" className="min-h-screen py-24 relative overflow-hidden bg-background flex flex-col justify-center">
            <FloatingElement number="Admin" text="Patient" className="bottom-10 right-10 text-right" />

            {/* Background Element */}
            <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Patient <span className="text-primary">Management</span></h2>
                    <p className="text-gray-400 text-lg">Search patients and add prescriptions or medical records.</p>
                </motion.div>

                <div className={`mx-auto transition-all duration-500 ease-in-out ${!selectedUser ? 'max-w-2xl' : 'max-w-6xl grid md:grid-cols-2 gap-8 items-start'}`}>
                    {/* LEFT COLUMN: Search & List */}
                    <div className={`bg-surface/50 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${!selectedUser ? 'min-h-[500px]' : 'min-h-[400px]'}`}>
                        <AnimatePresence mode="wait">
                            {!selectedUser ? (
                                <motion.div
                                    key="search"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-12 flex flex-col justify-center h-full"
                                >
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Find a Patient</h3>
                                        <p className="text-gray-400">Search by name or email to view records and add new ones.</p>
                                    </div>

                                    <div className="relative max-w-lg mx-auto w-full">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            placeholder="Start typing name..."
                                            className="w-full bg-background/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
                                        />
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />

                                        {/* Search Dropdown */}
                                        <AnimatePresence>
                                            {searchResults.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="mt-2 bg-[#0f1115] border border-white/10 rounded-xl overflow-hidden absolute w-full shadow-2xl max-h-60 overflow-y-auto z-50 scroller"
                                                >
                                                    {searchResults.map(user => (
                                                        <div
                                                            key={user._id}
                                                            onClick={() => handleSelectUser(user)}
                                                            className="p-4 hover:bg-primary/20 cursor-pointer flex items-center gap-4 transition-colors border-b border-white/5 last:border-0"
                                                        >
                                                            <div className="p-2 bg-white/5 rounded-full"><User className="w-5 h-5 text-primary" /></div>
                                                            <div>
                                                                <p className="font-semibold text-white text-lg">{user.name}</p>
                                                                <p className="text-sm text-gray-400">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {searchQuery.length > 2 && searchResults.length === 0 && (
                                            <div className="text-center mt-4 text-gray-500">No patients found.</div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col h-full"
                                >
                                    <div className="bg-white/5 p-6 border-b border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/20">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-white">{selectedUser.name}</h3>
                                                <p className="text-sm text-gray-400">{selectedUser.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleDeselectUser}
                                            className="text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1 text-sm font-medium"
                                        >
                                            <X className="w-4 h-4" /> Change
                                        </button>
                                    </div>

                                    {/* Records List */}
                                    <div className="p-6 overflow-y-auto flex-grow scroller max-h-[500px]">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-lg font-semibold text-gray-300">Previous Records</h4>
                                            <button onClick={handleAddNew} className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all">
                                                + Add New
                                            </button>
                                        </div>

                                        {userRecords.length === 0 ? (
                                            <p className="text-center text-gray-500 py-10">No records found for this patient.</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {userRecords.map(record => (
                                                    <div
                                                        key={record._id}
                                                        onClick={() => handleEditRecord(record)}
                                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${editingRecord?._id === record._id ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:border-primary/50'}`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wider ${record.type === 'prescription' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                                {record.type}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(record.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        {record.type === 'file' && (
                                                            <p className="text-sm font-medium text-white mb-1 truncate">{record.originalName}</p>
                                                        )}
                                                        {record.text && (
                                                            <p className="text-sm text-gray-400 line-clamp-2">{record.text}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT COLUMN: Form */}
                    {selectedUser && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="bg-surface/50 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl p-8"
                        >
                            <div className="mb-6 pb-6 border-b border-white/10">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {editingRecord ? 'Edit Record' : 'Add New Record'}
                                </h3>
                                <p className="text-gray-400">
                                    {editingRecord ? 'Update the details below. Previous file is kept unless replaced.' : 'Create a new medical entry for this patient.'}
                                </p>
                            </div>

                            <form id="record-form" onSubmit={handleSubmit} className="space-y-8">
                                {/* Prescription Area */}
                                <div>
                                    <label className="flex items-center gap-2 text-primary font-semibold mb-3">
                                        <FileText className="w-5 h-5" /> Medical Prescription / Notes
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={prescriptionText}
                                        onChange={(e) => setPrescriptionText(e.target.value)}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono shadow-sm resize-y"
                                        placeholder="Enter medical prescription, dosage, or clinical notes..."
                                    ></textarea>
                                </div>

                                {/* File Upload Area */}
                                <div>
                                    <label className="flex items-center gap-2 text-primary font-semibold mb-3">
                                        <Upload className="w-5 h-5" /> Attachments (X-Ray, Reports)
                                    </label>

                                    {editingRecord && editingRecord.fileUrl && !selectedFile && (
                                        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                                            <span className="text-sm text-gray-300 truncate max-w-[200px]">Current: {editingRecord.originalName}</span>
                                            <span className="text-xs text-gray-500 italic">(Upload new to replace)</span>
                                        </div>
                                    )}

                                    {!selectedFile ? (
                                        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-all cursor-pointer bg-white/5 hover:bg-white/10 relative group">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                accept="image/*,.pdf"
                                            />
                                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <p className="font-medium text-white mb-1">Click to browse or drag file here</p>
                                            <p className="text-gray-500 text-sm">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-4 rounded-xl">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-white truncate">{selectedFile.name}</p>
                                                    <p className="text-xs text-primary/70">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                title="Remove file"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Status Message */}
                                {status.message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : status.type === 'info' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                                    >
                                        {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : status.type === 'info' ? <AlertCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        <p className="font-medium">{status.message}</p>
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                                    {editingRecord && (
                                        <button
                                            type="button"
                                            onClick={handleAddNew}
                                            className="px-6 py-4 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-primary/25 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                                    >
                                        {uploading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </span>
                                        ) : (
                                            <>
                                                {editingRecord ? 'Update Record' : 'Save Record'} <CheckCircle className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>

                            </form>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminPatientSection;
