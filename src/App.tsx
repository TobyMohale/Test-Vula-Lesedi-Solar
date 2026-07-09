/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProjectSection from "./components/ProjectSection";
import Services from "./components/Services";
import TransitionBanner from "./components/TransitionBanner";
import AboutAndTrust from "./components/AboutAndTrust";
import ProjectPortfolio from "./components/ProjectPortfolio";
import ServiceAreas from "./components/ServiceAreas";
import Reviews from "./components/Reviews";
import Blog from "./components/Blog";
import FAQs from "./components/FAQs";
import ContactForm from "./components/ContactForm";
import LiveMap from "./components/LiveMap";
import Footer from "./components/Footer";
import ReviewModal from "./components/ReviewModal";
import CookieConsent from "./components/CookieConsent";
import ExitIntentPopup from "./components/ExitIntentPopup";
import VoiceReceptionist from "./components/VoiceReceptionist";
import AdminDashboard from "./components/AdminDashboard";
import { MessageSquare } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Simple client-side routing
  if (window.location.pathname === '/admin') {
    return <AdminDashboard theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-[#16a34a] selection:text-white transition-colors duration-300">
      {/* 1. Header / Navigation */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* 2. Main Page Layout */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Recently Commissioned Projects Section */}
        <ProjectSection />

        {/* Core & Secondary Services Grid */}
        <Services />

        {/* Dynamic Full-Width Transition Banner */}
        <TransitionBanner />

        {/* Company Overview, Mission & Workflow */}
        <AboutAndTrust />

        {/* Recent Installations & Product Portfolio */}
        <ProjectPortfolio />

        {/* Visual Served Areas & Gauteng Outline */}
        <ServiceAreas />

        {/* Customer Reviews & Testimonials */}
        <Reviews />

        {/* Expert Solar Guides & Articles */}
        <Blog />

        {/* FAQ Accordion Section */}
        <FAQs />

        {/* Contact Form & Call/WhatsApp Channels */}
        <ContactForm />

        {/* Live Google Map Section */}
        <LiveMap />
      </main>

      {/* 3. Bottom Brand Footer */}
      <Footer />

      {/* Floating Action Button - Write a Review */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        <motion.button
          initial={{ opacity: 0, x: 60, y: 60 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.6 }}
          onClick={() => setIsReviewModalOpen(true)}
          className="flex items-center gap-2 px-4.5 py-3 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl shadow-green-800/30 ring-4 ring-green-500/15 hover:ring-green-500/35 dark:shadow-[0_0_25px_rgba(22,163,74,0.5)] dark:ring-green-400/20 dark:hover:ring-green-400/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-green-500/20 group"
          id="floating-review-btn"
        >
          <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-500 ease-out whitespace-nowrap font-black">
            Write a Review
          </span>
          <MessageSquare className="h-4.5 w-4.5" />
        </motion.button>
      </div>

      {/* Review Dialog Popup */}
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      
      {/* Popups and Overlays */}
      <VoiceReceptionist />
      <CookieConsent />
      <ExitIntentPopup />
    </div>
  );
}
