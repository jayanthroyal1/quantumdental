import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Award, Stethoscope, Instagram, Youtube, Facebook } from 'lucide-react';
import FloatingElement from './FloatingElement';

const doctors = [
    {
        name: "Dr. Pradeep",
        role: "Chief Dental Surgeon",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1964",
        specialty: "Implantology & Laser Surgery",
        bio: "Pioneering the use of nanobots in oral surgery with over 15 years of experience in futuristic dental reconstruction."
    },
    {
        name: "Dr. Bindu",
        role: "Aesthetic Specialist",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=1974",
        specialty: "Cosmetic & AI Smile Design",
        bio: "Leading expert in digital smile architecture, combining artistry with quantum imaging for perfect aesthetics."
    }
];

const nurses = [
    {
        name: "Sarah Matthews",
        role: "Senior Dental Nurse",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=1974"
    },
    {
        name: "James Wilson",
        role: "Surgical Assistant",
        image: "https://images.unsplash.com/photo-1625585598750-3535fe40bd58?auto=format&fit=crop&q=80&w=1974"
    },
    {
        name: "Emily Chen",
        role: "Pediatric Nurse",
        image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=1974"
    }
];

export default function About() {
    return (
        <section id="about" className="py-24 bg-background relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Meet The <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="text-primary inline-block"
                            >
                                Visionaries
                            </motion.span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            World-class experts driving the evolution of digital dentistry.
                        </p>
                    </motion.div>
                </div>

                {/* Doctors Section */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto"
                >
                    {doctors.map((doc, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
                                show: { opacity: 1, x: 0, transition: { type: "spring", damping: 20 } }
                            }}
                            whileHover={{ y: -5 }}
                            className="bg-surface border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all group shadow-2xl shadow-black/50"
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-2/5 relative overflow-hidden">
                                    <img
                                        src={doc.image}
                                        alt={doc.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent md:bg-gradient-to-r"></div>
                                </div>
                                <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-2 text-primary">
                                        <Stethoscope className="w-5 h-5" />
                                        <span className="text-sm font-bold tracking-wider uppercase">{doc.specialty}</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">{doc.name}</h3>
                                    <span className="text-gray-300 font-medium mb-4 block">{doc.role}</span>
                                    <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                                        {doc.bio}
                                    </p>
                                    <div className="flex gap-4">
                                        <motion.button whileHover={{ scale: 1.1, color: "#0ea5e9" }} className="p-2 rounded-full bg-white/5 hover:bg-primary/20 transition-colors">
                                            <Linkedin className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.1, color: "#0ea5e9" }} className="p-2 rounded-full bg-white/5 hover:bg-primary/20 transition-colors">
                                            <Facebook className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.1, color: "#0ea5e9" }} className="p-2 rounded-full bg-white/5 hover:bg-primary/20 transition-colors">
                                            <Instagram className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.1, color: "#0ea5e9" }} className="p-2 rounded-full bg-white/5 hover:bg-primary/20 transition-colors">
                                            <Youtube className="w-5 h-5" />
                                        </motion.button>

                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Staff Section */}
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-bold text-white/80">Expert Care Team</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {nurses.map((nurse, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                            className="bg-surface/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-surface transition-colors"
                        >
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                                <img
                                    src={nurse.image}
                                    alt={nurse.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-left">
                                <h4 className="text-lg font-bold text-white">{nurse.name}</h4>
                                <span className="text-primary/80 text-sm font-medium">{nurse.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            {/* <FloatingElement number="02" text="Vision" className="bottom-10 right-10 md:right-20 text-right" /> */}
        </section>
    );
}
