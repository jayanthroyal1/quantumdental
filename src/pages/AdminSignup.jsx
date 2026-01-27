import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import heroBg from '../assets/herobackground.gif';

const AdminSignup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminSecret, setAdminSecret] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signup({ name, email, password, adminSecret });
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white flex flex-col relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-30 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
            </div>

            <div className="flex-grow flex items-center justify-center relative z-10 p-6">
                <div className="bg-secondary/20 p-8 rounded-2xl backdrop-blur-md border border-white/10 w-full max-w-md shadow-2xl">
                    <h2 className="text-3xl font-heading font-bold mb-6 text-center text-primary">Admin Registration</h2>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                                required
                                autoComplete="new-password"
                                name="newAdminEmail"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        {/* Admin Secret Key Field */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-primary">Admin Secret Key</label>
                            <input
                                type="password"
                                value={adminSecret}
                                onChange={(e) => setAdminSecret(e.target.value)}
                                className="w-full bg-white/5 border border-primary/50 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-secondary font-bold py-3 rounded-lg hover:bg-primary-light transition-all transform hover:scale-[1.02]"
                        >
                            Register as Admin
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSignup;
