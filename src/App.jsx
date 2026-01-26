import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingSocials from './components/FloatingSocials';
import ScrollToTop from './components/ScrollToTop';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Make lenis available globally for ScrollToTop if needed, or just rely on native scroll interception if configured
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return (
    <div className="bg-background min-h-screen text-white overflow-x-hidden selection:bg-primary/30">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingSocials />
      <ScrollToTop />
    </div>
  );
}

export default App;
