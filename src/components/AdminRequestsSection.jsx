import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import FloatingElement from './FloatingElement';

const AdminRequestsSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.get('/appointments');
                if (Array.isArray(res.data)) {
                    setAppointments(res.data);
                } else {
                    console.error("API returned non-array", res.data);
                    setAppointments([]);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`/appointments/${id}/status`, { status: newStatus });
            setAppointments(prev =>
                prev.map(apt => apt._id === id ? { ...apt, status: newStatus } : apt)
            );
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    return (
        <section id="requests" className="min-h-screen py-24 relative overflow-hidden bg-background flex flex-col justify-center">
            <FloatingElement number="Admin" text="Dashboard" className="top-10 left-10 text-left" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Appointment <span className="text-primary">Requests</span></h2>
                    <p className="text-gray-400 text-lg">Manage all patient inquiries and appointment requests.</p>
                </motion.div>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <div className="overflow-x-auto bg-surface/50 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 font-semibold text-gray-300">Date</th>
                                    <th className="p-4 font-semibold text-gray-300">Name</th>
                                    <th className="p-4 font-semibold text-gray-300">Email</th>
                                    <th className="p-4 font-semibold text-gray-300">Phone</th>
                                    <th className="p-4 font-semibold text-gray-300">Message</th>
                                    <th className="p-4 font-semibold text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-400">No requests found.</td>
                                    </tr>
                                ) : (
                                    appointments.map((apt) => (
                                        <tr key={apt._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-sm text-gray-400">
                                                {new Date(apt.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 font-medium">{apt.name}</td>
                                            <td className="p-4 text-gray-300">{apt.email}</td>
                                            <td className="p-4 text-gray-300 whitespace-nowrap">{apt.phone}</td>
                                            <td className="p-4 text-gray-300 max-w-xs truncate" title={apt.message}>
                                                {apt.message}
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    value={apt.status}
                                                    onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-transparent border border-white/10 outline-none cursor-pointer hover:bg-white/5 transition-colors
                                                        ${apt.status === 'pending' ? 'text-yellow-500' :
                                                            apt.status === 'contacted' ? 'text-blue-500' : 'text-green-500'}`}
                                                >
                                                    <option value="pending" className="bg-surface text-yellow-500">Pending</option>
                                                    <option value="contacted" className="bg-surface text-blue-500">Contacted</option>
                                                    <option value="resolved" className="bg-surface text-green-500">Resolved</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminRequestsSection;
