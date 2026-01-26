import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Cpu, Layers, Sparkles, Activity, ShieldCheck, Heart, Smile, Search, Move, Sun, Zap, Crown } from 'lucide-react';
import FloatingElement from './FloatingElement';

const services = [
    {
        icon: <Cpu className="w-8 h-8" />,
        title: "Robotic Surgery",
        description: "Minimally invasive procedures performed by nanobots for faster recovery and zero pain."
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: "Laser Whitening",
        description: "Photon-accelerated whitening that restores natural brilliance in a single session."
    },
    {
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "Preventive Gene Therapy",
        description: "Advanced DNA repair to prevent cavities and gum disease before they start."
    },
    {
        icon: <Heart className="w-8 h-8" />,
        title: "Kids Dentistry",
        description: "Gentle, gamified treatments ensuring a fear-free experience for our youngest patients."
    },
    {
        icon: <Smile className="w-8 h-8" />,
        title: "Smile Design",
        description: "AI-powered facial analysis to architect your perfect, mathematically balanced smile."
    },
    {
        icon: <Search className="w-8 h-8" />,
        title: "Root Canal",
        description: "Micro-endodontic precision to save teeth with advanced laser sterilization."
    },
    {
        icon: <Move className="w-8 h-8" />,
        title: "Dental Braces",
        description: "Smart aligners and accelerated orthodontics for rapid, invisible correction."
    },
    {
        icon: <Sun className="w-8 h-8" />,
        title: "Teeth Whitening",
        description: "Nano-crystal technology for blindingly white results without sensitivity."
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: "Laser Dentistry",
        description: "Scalpel-free soft tissue procedures with instant clotting and healing."
    },
    {
        icon: <Crown className="w-8 h-8" />,
        title: "Dental Crowns",
        description: "Same-day bio-ceramic crowns milled with micron-level accuracy."
    }
];

export default function Services() {
    return (
        <section id="services" className="py-24 bg-surface relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        <span className="text-primary">Advanced</span> Treatments
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Leveraging cutting-edge technology to provide effective, efficient, and comfortable dental care.
                    </p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 }
                            }}
                            whileHover={{
                                y: -10,
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            whileTap={{ scale: 0.96 }}
                            animate={{
                                opacity: [0.9, 1, 0.9],
                                transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
                            }}
                            className="p-8 rounded-2xl bg-background border border-white/5 hover:border-primary/50 transition-colors group hover:shadow-[0_0_40px_rgba(14,165,233,0.2)] relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="mb-6 p-4 bg-primary/10 rounded-xl inline-block text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            {/* <FloatingElement number="03" text="Technology" className="top-24 left-10 md:left-20" /> */}
        </section>
    );
}
