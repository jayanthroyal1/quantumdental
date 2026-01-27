import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import FloatingElement from './FloatingElement';
import { FileText, Download, Calendar, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
    const { user, token } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            if (user && user._id) {
                try {
                    const res = await axios.get(`/patients/records/${user._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setRecords(res.data);
                } catch (error) {
                    console.error("Error fetching records:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRecords();
    }, [user, token]);

    const handleDownload = (fileUrl) => {
        // Construct full URL if relative
        const url = fileUrl.startsWith('http') ? fileUrl : `http://localhost:5000${fileUrl}`;
        window.open(url, '_blank');
    };

    return (
        <section id="files" className="min-h-screen py-24 relative overflow-hidden bg-background flex flex-col justify-center">
            <FloatingElement number="My" text="Health" className="top-10 left-10 text-left" />

            {/* Background Element */}
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Your <span className="text-primary">Medical Records</span></h2>
                    <p className="text-gray-400 text-lg">Access your prescriptions, X-rays, and treatment plans securely.</p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {records.map((record, index) => (
                            <motion.div
                                key={record._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-surface/50 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-all group backdrop-blur-md flex flex-col h-full shadow-lg hover:shadow-primary/10"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl transition-colors ${record.type === 'prescription' ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white'}`}>
                                        {record.type === 'prescription' ? <Activity className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                    </div>
                                    <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5 uppercase tracking-wider">
                                        {record.type}
                                    </span>
                                </div>

                                <div className="flex-grow">
                                    {/* Date */}
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(record.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>

                                    {record.type === 'prescription' ? (
                                        <div className="bg-black/20 rounded-lg p-4 text-gray-300 text-sm leading-relaxed font-mono whitespace-pre-wrap border border-white/5 max-h-40 overflow-y-auto scroller">
                                            {record.text}
                                        </div>
                                    ) : (
                                        <div className="mb-2">
                                            <h4 className="text-lg font-semibold text-white mb-1 truncate" title={record.originalName}>
                                                {record.originalName || "Uploaded Document"}
                                            </h4>
                                            {record.text && (
                                                <p className="text-sm text-gray-400 line-clamp-2 mb-2">{record.text}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5">
                                    {record.type === 'file' ? (
                                        <button
                                            onClick={() => handleDownload(record.fileUrl)}
                                            className="w-full py-3 bg-white/5 hover:bg-primary hover:text-white border border-white/10 hover:border-primary rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                                            Download File
                                        </button>
                                    ) : (
                                        <div className="w-full py-3 bg-white/5 text-gray-400 text-center rounded-xl text-sm border border-white/5 cursor-default">
                                            Read Only
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {/* Empty placeholder */}
                        {records.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                                    <FileText className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    You haven't received any prescriptions or files from the admin yet.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default UserDashboard;
