import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Instagram, Phone } from 'lucide-react';
import DentistryChatbot from './DentistryChatbot';

export default function FloatingSocials() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="fixed bottom-24 right-6 z-50 flex flex-col gap-4"
            >
                {/* WhatsApp */}
                <motion.a
                    variants={itemVariants}
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, textShadow: "0 0 8px rgb(255,255,255)" }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] transition-all"
                >
                    <Phone className="w-6 h-6 fill-current" />
                </motion.a>

                {/* Instagram */}
                <motion.a
                    variants={itemVariants}
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(220,39,67,0.6)] transition-all"
                >
                    <Instagram className="w-6 h-6" />
                </motion.a>

                {/* Chatbot Trigger */}
            </motion.div>

            {/* Render Chatbot */}
            <DentistryChatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </>
    );
}
