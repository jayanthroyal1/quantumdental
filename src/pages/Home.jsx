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
import SEO from '../components/SEO';

const Home = () => {
    const { user } = useAuth();

    const businessSchema = {
        "@context": "https://schema.org",
        "@type": "Dentist",
        "name": "Quantum Digital Dentistry",
        "image": "https://quantumdental.vercel.app/logo.png",
        "@id": "https://quantumdental.vercel.app",
        "url": "https://quantumdental.vercel.app",
        "telephone": "+9107207011988",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "3rd floor, Flat No: 33/A, Sri sai Govardhan Kunj, 7-1-397/101, 301/A, opposite Domino's Pizza, near Community hall",
            "addressLocality": "S.R Nagar, Ameerpet",
            "addressRegion": "Telangana",
            "postalCode": "500038",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 17.4419959,
            "longitude": 78.4435775
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "09:00",
            "closes": "21:00"
        },
        "sameAs": [
            "https://www.instagram.com/quantumdigitaldentistry"
        ]
    };

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
            <SEO
                title="Best Dental Clinic in S.R Nagar & Ameerpet, Hyderabad"
                description="Quantum Digital Dentistry - Advanced dental care in S.R Nagar & Ameerpet, Hyderabad. Specialists in implants, smile design & digital dentistry. Book appointment now."
                keywords="dentist hyderabad, dental clinic S.R Nagar, dental clinic Ameerpet, dentist near me, top dentist S.R Nagar, best dental clinic Hyderabad, Quantum Dentistry, Quantam, digital dentistry, dental implants"
                schema={businessSchema}
            />
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
