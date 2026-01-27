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

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchQuery('');
        setSearchResults([]);
        // Reset form state on new selection
        setPrescriptionText('');
        setSelectedFile(null);
        setStatus({ type: '', message: '' });
    };

    const handleDeselectUser = () => {
        setSelectedUser(null);
        // Reset form state on deselect
        setPrescriptionText('');
        setSelectedFile(null);
        setStatus({ type: '', message: '' });
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

        if (!prescriptionText.trim() && !selectedFile) {
            setStatus({ type: 'error', message: 'Please enter a prescription or upload a file.' });
            return;
        }

        setStatus({ type: '', message: '' });
        setUploading(true);

        const formData = new FormData();
        formData.append('userId', selectedUser._id);

        // Determine type based on content
        // If file exists, type is 'file' (can include text notes)
        // If only text, type is 'prescription'
        const type = selectedFile ? 'file' : 'prescription';
        formData.append('type', type);

        if (prescriptionText) formData.append('text', prescriptionText);
        if (selectedFile) formData.append('file', selectedFile);

        try {
            await axios.post('/patients/record', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStatus({ type: 'success', message: 'Record saved successfully!' });
            // Clear form after success, keep user selected? 
            // UX Requirement: "Patient interaction mode should remain active until client selects different user"
            setPrescriptionText('');
            setSelectedFile(null);

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

                <div className="max-w-3xl mx-auto bg-surface/50 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden min-h-[400px] flex flex-col">

                    <AnimatePresence mode="wait">
                        {!selectedUser ? (
                            <motion.div
                                key="search"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-12 flex flex-col justify-center h-full flex-grow"
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
                                key="form"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="flex flex-col h-full"
                            >
                                {/* Selected User Header - Minimized Search Concept */}
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
                                        className="text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-medium"
                                    >
                                        Change Patient <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Form Content */}
                                <div className="p-8 flex-grow overflow-y-auto">
                                    <form onSubmit={handleSubmit} className="space-y-8">

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
                                                className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                                            >
                                                {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                                <p className="font-medium">{status.message}</p>
                                            </motion.div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="pt-4 border-t border-white/10 flex justify-end">
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
                                                        Save Record <CheckCircle className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default AdminPatientSection;
