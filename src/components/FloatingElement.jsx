import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logoOne.png';

export default function FloatingElement({ className = "bottom-10 left-10 md:left-20" }) {
    return (
        <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute ${className} text-white/20 hidden md:block pointer-events-none z-0`}
        >
            <img src={logo} alt='logo' className="w-16 h-auto opacity-30" />
        </motion.div>
    );
}
