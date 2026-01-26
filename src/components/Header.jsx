import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import logo from '../assets/logoOne.png';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const { scrollYProgress } = useScroll();
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

        ['home', 'about', 'services', 'gallery', 'testimonials', 'contact'].forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'Contact', href: '#contact' },
    ];

    const handleNavClick = (e, href) => {
        e.preventDefault();
        if (window.lenis) {
            window.lenis.scrollTo(href, { offset: -80 }); // sticky header offset
        } else {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsOpen(false);
    };

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md py-4 shadow-lg shadow-primary/10' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">

                {/* Logo */}
                <a
                    href="#home"
                    onClick={(e) => handleNavClick(e, '#home')}
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
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className={`transition-colors text-sm font-medium tracking-wide uppercase hover:underline decoration-2 decoration-primary underline-offset-4 ${activeSection === link.href.substring(1) ? 'text-primary underline' : 'text-gray-300 hover:text-primary'
                                }`}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        onClick={(e) => handleNavClick(e, '#contact')}
                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all shadow-[0_0_15px_rgba(14,165,233,0.5)] hover:shadow-[0_0_25px_rgba(14,165,233,0.7)]"
                    >
                        Book Now
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-surface border-t border-white/10 shadow-2xl md:hidden"
                    >
                        <nav className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className={`text-lg transition-colors ${activeSection === link.href.substring(1) ? 'text-primary font-bold' : 'text-gray-300 hover:text-primary'}`}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                onClick={(e) => handleNavClick(e, '#contact')}
                                className="w-full text-center px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-lg hover:bg-primary/90 transition-colors"
                            >
                                Book Now
                            </a>
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
