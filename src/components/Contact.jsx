import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import axios from "axios";

import FloatingElement from "./FloatingElement";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post("/appointments", {
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
      });
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        countryCode: "+91",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <FloatingElement
        number="06"
        text="Connect"
        className="bottom-10 right-10 md:right-20 text-right"
      />
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Contact Info */}
          <div className="lg:w-1/2">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Ready for the <span className="text-primary">Future?</span>
            </motion.h2>
            <p className="text-gray-400 mb-10 text-lg">
              Book your consultation today and experience the next generation of
              dental care.
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: <Mail className="w-6 h-6 text-primary" />,
                  title: "Email Us",
                  text: "hello@quantumdentistry.com",
                  link: "mailto:hello@quantumdentistry.com",
                },
                {
                  icon: <Phone className="w-6 h-6 text-primary" />,
                  title: "Call Us",
                  text: "+91 07207011988",
                },
                {
                  icon: <MapPin className="w-6 h-6 text-primary" />,
                  title: "Visit Us",
                  text: "3rd floor, Flat No: 33/A, Sri sai Govardhan Kunj, 7-1-397/101, 301/A, opposite Domino's Pizza, near Community hall, Hyderabad, Telangana 500038",
                  link: "https://www.google.com/maps/place/Quantum+Digital+Dentistry/@17.4419959,78.4435775,17z/data=!4m14!1m7!3m6!1s0x3bcb91001c756865:0x82cabd25b965e502!2sQuantum+Digital+Dentistry!8m2!3d17.4419959!4d78.4461524!16s%2Fg%2F11mdy6vlf9!3m5!1s0x3bcb91001c756865:0x82cabd25b965e502!8m2!3d17.4419959!4d78.4461524!16s%2Fg%2F11mdy6vlf9?entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-3 bg-surface rounded-lg border border-white/10">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors hover:underline block"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p className="text-gray-400">{item.text}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-surface/50 backdrop-blur-md border border-white/10 shadow-2xl"
            >
              {status === "success" && (
                <p className="mb-4 text-green-400">
                  Message sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="mb-4 text-red-400">
                  Failed to send message. Please try again.
                </p>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="mb-6 flex gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Code
                  </label>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                  >
                    <option value="+91">IN (+91)</option>
                    <option value="+1">US (+1)</option>
                    <option value="+44">UK (+44)</option>
                    <option value="+61">AU (+61)</option>
                    <option value="+971">UAE (+971)</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Enter Phone Number"
                    required
                    pattern="[0-9]{10}"
                    title="Ten digit mobile number"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="I'd like to book an appointment..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : "Send Request"}{" "}
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
