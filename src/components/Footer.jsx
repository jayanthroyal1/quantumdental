import React from 'react';
import { Zap, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import logo from '../assets/logoOne.png';

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div>
                        <a
                            href="#home"
                            onClick={(e) => {
                                e.preventDefault();
                                window.lenis?.scrollTo('#home');
                            }}
                            className="flex items-center gap-2 group relative mb-6"
                        >
                            <div className="relative">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <img
                                    src={logo}
                                    alt="Quantum Dentistry"
                                    className="h-12 w-auto relative z-10 drop-shadow-[0_0_10px_rgba(14,165,233,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] transition-all"
                                />
                            </div>
                            <div className="flex flex-col -space-y-1 mt-1">
                                <span className="text-2xl font-bold tracking-wide text-white drop-shadow-md font-sans">
                                    QUANTUM
                                </span>
                                <span className="text-[0.65rem] tracking-[0.2em] text-gray-200 font-medium">
                                    DIGITAL DENTISTRY
                                </span>
                            </div>
                        </a>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Pioneering the future of oral healthcare with quantum computing, AI diagnostics, and nanobot precision.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Our Services</h4>
                        <ul className="space-y-3">
                            {['Robotic Surgery', 'Laser Whitening', 'Preventive Gene Therapy', 'Kids Dentistry', 'Smile Design'].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#services"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.lenis?.scrollTo('#services');
                                        }}
                                        className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">📍</span>
                                <span>
                                    3rd floor, Flat No: 33/A, Sri sai Govardhan Kunj,<br />
                                    Hyderabad, Telangana 500038
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-primary">📞</span>
                                <a href="tel:+9107207011988" className="hover:text-primary transition-colors">+91 07207011988</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-primary">✉️</span>
                                <a href="mailto:hello@quantumdentistry.com" className="hover:text-primary transition-colors">hello@quantumdentistry.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Opening Hours</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span>Mon - Fri</span>
                                <span className="text-white font-medium">9:00 AM - 9:00 PM</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span>Saturday</span>
                                <span className="text-white font-medium">10:00 AM - 6:00 PM</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span>Sunday</span>
                                <span className="text-primary font-medium">10:00 AM - 4:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <div>
                        &copy; {new Date().getFullYear()} Quantum Digital Dentistry. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
