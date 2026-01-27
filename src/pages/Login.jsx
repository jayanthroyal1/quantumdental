import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import heroBg from '../assets/herobackground.gif';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
            navigate('/');
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
            <div className="flex-grow flex items-center justify-center relative z-10 pt-20">
                <div className="bg-secondary/20 p-8 rounded-2xl backdrop-blur-md border border-white/10 w-full max-w-md">
                    <h2 className="text-3xl font-heading font-bold mb-6 text-center text-gradient">Welcome Back</h2>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                                required
                                autoComplete="new-password" // Hack to prevent autofill in some browsers, or use "email"
                                name="emailInput" // Unique name to discourage autofill
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
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#646cffaa] via-[#7e82ffcc] to-[#D4D925] 
           text-white font-bold py-3 rounded-lg shadow-md
           transition-all duration-300 transform hover:scale-[1.04] hover:shadow-xl hover:brightness-110"

                        >
                            Login
                        </button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow h-px bg-white/10"></div>
                        <span className="mx-4 text-sm text-gray-400">OR</span>
                        <div className="flex-grow h-px bg-white/10"></div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            theme="filled_black"
                            shape="pill"
                        />
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
