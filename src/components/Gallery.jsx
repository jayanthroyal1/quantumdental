import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import FloatingElement from './FloatingElement';

const galleryImages = [
    {
        url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2070',
        title: "Advanced Diagnostics",
        desc: "State-of-the-art imaging"
    },
    {
        url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=2070',
        title: "Digital Workflow",
        desc: "Precision equipment"
    },
    {
        url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=1974',
        title: "Sterile Environment",
        desc: "Maximum safety protocols"
    },
    {
        url: 'https://plus.unsplash.com/premium_photo-1664303499312-917c50e4047b?auto=format&fit=crop&q=80&w=2070',
        title: "Patient Comfort",
        desc: "Relaxing treatment rooms"
    },
    {
        url: 'https://images.unsplash.com/photo-1593022356769-11f09a79a24a?auto=format&fit=crop&q=80&w=2070',
        title: "Future Ready",
        desc: "Next-gen dental care"
    }
];

export default function Gallery() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    return (
        <section id="gallery" className="py-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-background/50 z-0"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-primary tracking-[0.2em] text-sm font-bold uppercase"
                    >
                        Our Facility
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-3xl md:text-5xl font-bold mt-2"
                    >
                        Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Gallery</span>
                    </motion.h2>
                </div>

                {/* Main Slider */}
                <div className="relative max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={currentIndex}
                            src={galleryImages[currentIndex].url}
                            alt={galleryImages[currentIndex].title}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3">
                        <motion.div
                            key={`text-${currentIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{galleryImages[currentIndex].title}</h3>
                            <p className="text-gray-300">{galleryImages[currentIndex].desc}</p>
                        </motion.div>
                    </div>

                    {/* Controls */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:border-primary transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:border-primary transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        {galleryImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-primary' : 'bg-white/50 hover:bg-white'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {/* <FloatingElement number="04" text="Facility" className="bottom-20 right-10 md:right-20 text-right" /> */}
        </section>
    );
}
