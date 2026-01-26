import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import heroBg from '../assets/herobackground.gif';
import FloatingElement from './FloatingElement';

export default function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

            {/* Parallax Background */}
            <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0">
                <img
                    src={heroBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-30 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
            </motion.div>

            {/* Ambient Particles */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-primary/20 rounded-full blur-sm"
                        style={{
                            width: Math.random() * 10 + 5,
                            height: Math.random() * 10 + 5,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 0.5, 0],
                            scale: [0, 1.5, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Scanner Effect */}
            <motion.div
                className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-0 blur-md"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <div className="container mx-auto px-6 z-10 text-center relative">
                <motion.div style={{ y: y2 }}>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                    >
                        NEXT GEN DENTAL CARE
                    </motion.span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        <span className="block overflow-hidden">
                            <motion.span
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                                className="block"
                            >
                                The Future of
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden">
                            <motion.span
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
                                className="block"
                            >
                                <span className="text-primary drop-shadow-[0_0_20px_rgba(14,165,233,0.5)]">Dentistry</span> is Here
                            </motion.span>
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Experience painless, AI-driven treatments in a state-of-the-art facility.
                        We combine quantum precision with compassionate care.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.a
                            href="#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                window.lenis?.scrollTo('#contact');
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 bg-primary text-white font-semibold rounded-full overflow-hidden shadow-[0_0_20px_rgba(14,165,233,0.4)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Book Appointment <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <motion.div
                                className="absolute inset-0 bg-primary/20"
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                        </motion.a>
                        <motion.a
                            href="#services"
                            onClick={(e) => {
                                e.preventDefault();
                                window.lenis?.scrollTo('#services');
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-surface border border-white/10 text-white font-semibold rounded-full hover:bg-white/5 transition-colors"
                        >
                            Explore Services
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Floating Elements Animation */}
            <FloatingElement />
        </section>
    );
}
