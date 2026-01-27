import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import UserDashboard from '../components/UserDashboard';
import AdminRequestsSection from '../components/AdminRequestsSection';
import AdminPatientSection from '../components/AdminPatientSection'; // Updated import
import Footer from '../components/Footer';
import FloatingSocials from '../components/FloatingSocials';
import ScrollToTop from '../components/ScrollToTop';

const Home = () => {
    const { user } = useAuth();

    // Render logic for the main content section based on role
    const renderContent = () => {
        if (!user) return <Contact />; // Public -> Contact
        if (user.role === 'admin') {
            return (
                <>
                    <AdminRequestsSection />
                    <AdminPatientSection /> {/* Updated component */}
                </>
            );
        }
        return <UserDashboard />; // Regular User -> Dashboard
    };

    return (
        <div className="bg-background min-h-screen text-white overflow-x-hidden selection:bg-primary/30">
            <Header />
            <main>
                <Hero />
                <About />
                {(!user || user.role !== 'admin') && (
                    <>
                        <Services />
                        <Gallery />
                    </>
                )}
                <Testimonials />
                {renderContent()}
            </main>
            <Footer />
            <FloatingSocials />
            <ScrollToTop />
        </div>
    );
};

export default Home;
