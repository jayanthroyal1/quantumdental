import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import logo from '../assets/logoOne.png';
import axios from 'axios'; // Added axios import

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Renamed isOpen to isMenuOpen
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const { scrollYProgress } = useScroll();
    const { user, logout } = useAuth(); // Auth Hook
    const location = useLocation();
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = useState(0); // Added pendingCount state

    // Added useEffect for fetching pendingCount
    useEffect(() => {
        if (user?.role === 'admin') {
            const fetchCount = async () => {
                try {
                    // In a real app, create a specific endpoint for counts to optimize
                    // For now, we'll fetch all and filter client side or use the existing list endpoint
                    // Assuming we want to show ALL requests count or just pending. Let's show Pending.
                    const res = await axios.get('/appointments');
                    if (Array.isArray(res.data)) {
                        const pending = res.data.filter(a => a.status === 'pending').length;
                        setPendingCount(pending);
                    }
                } catch (e) { console.error("Failed to fetch count", e); }
            };
            fetchCount();
            // Poll every 30 seconds
            const interval = setInterval(fetchCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (location.pathname === '/') {
            ['home', 'about', 'services', 'gallery', 'testimonials', 'contact', 'requests', 'patient', 'files'].forEach((id) => {
                const element = document.getElementById(id);
                if (element) observer.observe(element);
            });
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, [location.pathname]);

    const navLinks = [
        { name: 'Home', href: '/#home' },
        { name: 'About', href: '/#about' },
    ];

    // Only show Services/Gallery for non-admins
    if (!user || user.role !== 'admin') {
        navLinks.push(
            { name: 'Services', href: '/#services' },
            { name: 'Gallery', href: '/#gallery' }
        );
    }

    navLinks.push({ name: 'Testimonials', href: '/#testimonials' });

    // Add role-specific links
    if (!user) {
        navLinks.push({ name: 'Contact', href: '/#contact' });
    } else if (user.role === 'admin') {
        navLinks.push(
            { name: 'Requests', href: '/#requests', badge: pendingCount },
            { name: 'Patient', href: '/#patient' } // Renamed from Uploads
        );
    } else {
        // Regular User
        navLinks.push({ name: 'My Files', href: '/#files' });
    }

    const isLinkActive = (href) => {
        if (location.pathname === '/') {
            if (href.includes('#')) {
                const sectionId = href.split('#')[1];
                return activeSection === sectionId;
            }
        }
        return location.pathname === href;
    };

    const handleLogoClick = (e) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            navigate('/');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    const handleNavClick = (e, href) => {
        e.preventDefault();

        if (href.startsWith('/#')) { // Handle internal anchor links
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    const sectionId = href.split('#')[1];
                    const element = document.getElementById(sectionId);
                    if (element) {
                        if (window.lenis) window.lenis.scrollTo(element, { offset: -80 });
                        else element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
                return;
            }

            const sectionId = href.split('#')[1];
            if (window.lenis) {
                window.lenis.scrollTo(`#${sectionId}`, { offset: -80 });
            } else {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else { // Handle external routes like /requests
            navigate(href);
        }
        setIsMenuOpen(false); // Changed setIsOpen to setIsMenuOpen
    };

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md py-4 shadow-lg shadow-primary/10' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">

                {/* Logo */}
                <Link
                    to="/"
                    onClick={(e) => {
                        if (location.pathname === '/') handleNavClick(e, '/#home');
                    }}
                    className="flex items-center gap-2 group relative"
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
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className={`flex items-center text-sm font-medium tracking-wide uppercase hover:underline decoration-2 decoration-primary underline-offset-4 relative
                                ${isLinkActive(link.href) ? 'text-primary underline' : 'text-gray-300 hover:text-primary'}
                            `}
                        >
                            {link.name}
                            {link.badge > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                                    {link.badge}
                                </span>
                            )}
                        </a>
                    ))}

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-primary">Hi, {user.name.split(' ')[0]} {user.role === 'admin' ? '(Admin)' : ''}</span>
                            <button
                                onClick={logout}
                                className="px-5 py-2 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all hover:bg-white/5 rounded-full border border-transparent hover:border-primary/30"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-medium shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white hover:text-primary transition-colors z-50 relative p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >{isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-xl z-40 overflow-hidden flex flex-col pt-24"
                    >
                        <nav className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className={`text-lg transition-colors ${isLinkActive(link.href) ? 'text-primary font-bold' : 'text-gray-300 hover:text-primary'}`}
                                >
                                    {link.name}
                                </a>
                            ))}

                            {user ? (
                                <>
                                    <div className="text-primary font-medium">Hi, {user.name}</div>
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="w-full text-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full text-center px-6 py-3 border border-white/10 rounded-lg hover:border-primary/50 hover:bg-white/5 text-gray-300 hover:text-white transition-all duration-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full text-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white rounded-lg font-medium shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-cyan-400 to-blue-600 origin-left"
                style={{ scaleX }}
            />
        </header>
    );
}
