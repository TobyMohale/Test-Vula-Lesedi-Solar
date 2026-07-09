import React from "react";
import Logo from "./Logo";
import { Phone, Mail, MapPin, MessageSquare, ShieldAlert, ArrowUp, Facebook, Instagram, Linkedin, X, Music } from "lucide-react";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#051121] text-slate-300 pt-16 pb-8 border-t border-slate-900 relative overflow-hidden" id="footer">
      {/* Visual background details */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#0a2240]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-slate-800/80 pb-12">
          
          {/* Column 1: Brand Stacked Logo & Mission (4 columns) */}
          <div className="lg:col-span-4 space-y-5 text-left md:text-left flex flex-col items-start">
            <Logo variant="stacked" size="md" light={true} />
            <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs mt-3">
              Reliable, clean, and affordable solar and backup power installations engineered to withstand South African load shedding. We power Gauteng homes and businesses with top-tier hardware and honest advice.
            </p>
            {/* Slogan Badge */}
            <span className="inline-block text-[9px] font-black tracking-widest bg-green-950/80 text-green-400 border border-green-800/60 px-3.5 py-1.5 rounded-full uppercase">
              ⚡ Powering Gauteng Since 2024
            </span>

            {/* Social Media Channels */}
            <div className="pt-2 w-full">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                Follow Our Work
              </h5>
              <div className="flex flex-wrap gap-2.5">
                <a 
                  href="https://www.facebook.com/share/1CwY9Gzynw/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-[#09182d] hover:bg-[#16a34a] hover:text-white rounded-xl border border-slate-800 transition-all duration-200 hover:scale-105 flex items-center justify-center h-10 w-10"
                  aria-label="Follow Vula Lesedi on Facebook"
                >
                  <img src="https://res.cloudinary.com/dagphoc0j/image/upload/v1783015823/Facebook-Logosu_florea.png" alt="Facebook" className="h-5 w-5 object-contain" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (2 columns) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-l-2 border-[#16a34a] pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a href="#hero" className="hover:text-green-400 transition-colors">Hero Setup</a>
              </li>
              <li>
                <a href="#services" className="hover:text-green-400 transition-colors">Our Services</a>
              </li>
              <li>
                <a href="#about" className="hover:text-green-400 transition-colors">About & Mission</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-green-400 transition-colors">Installation Portfolio</a>
              </li>
              <li>
                <a href="#areas" className="hover:text-green-400 transition-colors">Gauteng Areas</a>
              </li>
              <li>
                <a href="#blog" className="hover:text-green-400 transition-colors">Solar Learning Guides</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-green-400 transition-colors">Customer Reviews</a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-green-400 transition-colors">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Channels (3 columns) */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-l-2 border-[#16a34a] pl-2.5">
              Contact Channels
            </h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#16a34a] shrink-0" />
                <a href="tel:0686765446" className="hover:text-green-400 transition-colors">
                  068 676 5446
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-green-400 shrink-0" />
                <a 
                  href="https://wa.me/27686765446?text=Hi%20Vula%20Lesedi%20Power%20Solutions" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-green-400 transition-colors text-green-400"
                >
                  WhatsApp: 068 676 5446
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <a href="mailto:lesedisolarandbackup@gmail.com" className="hover:text-green-400 transition-colors break-all">
                  lesedisolarandbackup@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>369 West Street, 0182, Pretoria</span>
              </li>
            </ul>
          </div>

          {/* Column 4: WhatsApp badge & Area footprint (3 columns) */}
          <div className="lg:col-span-3 space-y-5 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-l-2 border-[#16a34a] pl-2.5">
              Service Area Footprint
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              We exclusively support properties inside Pretoria, Centurion, Midrand, Johannesburg, Sandton, Alberton, Boksburg, Roodepoort, and Hammanskraal.
            </p>

            {/* Glowing Green Button badge */}
            <a
              href="https://wa.me/27686765446?text=Hi%20Vula%20Lesedi%20Power%20Solutions,%20I%20would%20like%20to%20get%20a%20free%20quote%20for%20a%20solar/backup%20power%20system."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold text-xs px-4 py-3 rounded-xl shadow-lg transition-all duration-200 uppercase tracking-wider"
              id="footer-whatsapp-badge"
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp Assessor</span>
            </a>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
          
          <div className="text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} Vula Lesedi Power Solutions. All rights reserved.</p>
            <p className="text-[10px] text-slate-600 mt-1 uppercase font-black">
              Qualified Engineering • Load Shedding Resilience • CoC Registered
            </p>
          </div>

          {/* Back to top button */}
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-3.5 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            aria-label="Scroll back to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-4 w-4" />
          </button>

        </div>
      </div>
    </footer>
  );
}
