import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import FloatingElement from './FloatingElement';

const testimonials = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Smile Makeover",
        content: "I was terrified of dentists until I found Quantum. The laser treatment was completely painless, and my new veneers look indistinguishable from natural teeth. Truly futuristic care!",
        rating: 5
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Root Canal Patient",
        content: "The AI diagnostics caught an issue my previous dentist missed. The root canal procedure was over in one session with zero discomfort. Incredible technology.",
        rating: 5
    },
    {
        id: 3,
        name: "Priya Patel",
        role: "Invisalign User",
        content: "The 3D scanning for my braces was fascinating. No messy molds! My treatment plan is tracking perfectly, and I can see the progress week by week.",
        rating: 5
    },
    {
        id: 4,
        name: "David Thompson",
        role: "Implant Surgery",
        content: "Same-day implants sounded too good to be true, but they delivered. Walked in with a gap, walked out with a smile. The bio-compatibility is excellent.",
        rating: 5
    },
    {
        id: 5,
        name: "Emma Wilson",
        role: "Teeth Whitening",
        content: "The laser whitening is magic. My teeth are 5 shades whiter after just 45 minutes, and I had absolutely no sensitivity afterwards. Highly recommend!",
        rating: 5
    },
    {
        id: 6,
        name: "James Rodriguez",
        role: "Routine Checkup",
        content: "The smart monitoring suggestions they gave me for my daily hygiene changed everything. My gums have never been healthier. This is what healthcare should be.",
        rating: 5
    },
    {
        id: 7,
        name: "Olivia Chang",
        role: "Kids Dentistry",
        content: "My son actually asks to go to the dentist now. The gamified experience and gentle staff made him forget he was even getting a cavity filled.",
        rating: 5
    },
    {
        id: 8,
        name: "Robert Foster",
        role: "Crown Replacement",
        content: "The 3D-printed ceramic crown fits better than my original tooth. The precision of their robotics is unmatched. Fast, efficient, and perfect.",
        rating: 5
    },
    {
        id: 9,
        name: "Anita Gupta",
        role: "Emergency Care",
        content: "I chipped a tooth before a big presentation. They fit me in immediately, and using digital bonding, restored it flawlessly in 20 minutes.",
        rating: 5
    },
    {
        id: 10,
        name: "Marcus Johnson",
        role: "Full Mouth Rehab",
        content: "A complete transformation. The digital smile design let me see the result before we started. The execution was flawless. I can't stop smiling.",
        rating: 5
    }
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section id="testimonials" className="py-24 bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-5xl font-bold mb-4"
                    >
                        Patient <span className="text-primary">Stories</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        Real experiences from people who have embraced the future of dentistry.
                    </motion.p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-surface border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl min-h-[400px] flex flex-col justify-center">

                        {/* Quote Icon Background */}
                        <div className="absolute top-8 left-8 text-primary/10">
                            <Quote size={120} />
                        </div>

                        <div className="relative z-10">
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center"
                                >
                                    <div className="flex justify-center gap-1 mb-6">
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>

                                    <p className="text-xl md:text-2xl text-gray-200 font-light italic leading-relaxed mb-8">
                                        "{testimonials[currentIndex].content}"
                                    </p>

                                    <div className="flex flex-col items-center">
                                        <h4 className="text-lg font-bold text-white tracking-wide">
                                            {testimonials[currentIndex].name}
                                        </h4>
                                        <span className="text-primary text-sm font-medium uppercase tracking-wider mt-1">
                                            {testimonials[currentIndex].role}
                                        </span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/50 border border-white/10 hover:bg-primary hover:border-primary hover:text-white transition-all text-gray-400 md:-left-6 shadow-lg backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/50 border border-white/10 hover:bg-primary hover:border-primary hover:text-white transition-all text-gray-400 md:-right-6 shadow-lg backdrop-blur-sm"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-gray-600 hover:bg-gray-500'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {/* <FloatingElement number="05" text="Stories" className="top-20 left-10 md:left-20" /> */}
        </section>
    );
}
