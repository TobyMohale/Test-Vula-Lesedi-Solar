import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { Phone, MessageSquare, Menu, X, Sun, Moon } from "lucide-react";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "About Us", href: "#about" },
    { name: "Recent Projects", href: "#projects" },
    { name: "Service Areas", href: "#areas" },
    { name: "Solar Guides", href: "#blog" },
    { name: "Reviews", href: "#reviews" },
    { name: "FAQs", href: "#faqs" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-md dark:shadow-black/20 border-b border-slate-100 dark:border-slate-800/80 py-2 md:py-3"
          : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm py-3 md:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex-shrink-0" id="nav-logo-link">
            <Logo variant="horizontal" size="md" light={theme === "dark"} />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-600 dark:text-slate-300 hover:text-[#16a34a] dark:hover:text-[#16a34a] font-semibold text-sm transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:text-[#16a34a] dark:hover:text-amber-300 transition-all active:scale-95 cursor-pointer"
              aria-label="Toggle theme mode"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            <a
              href="tel:0686765446"
              className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-[#0a2240] dark:hover:text-white font-bold text-sm bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 px-4 py-2.5 rounded-full transition-all duration-200 border border-slate-200/60 dark:border-slate-800"
              id="cta-nav-call"
            >
              <Phone className="h-4 w-4 text-[#16a34a]" />
              <span>068 676 5446</span>
            </a>
            
            <a
              href="https://wa.me/27686765446?text=Hi%20Vula%20Lesedi%20Power%20Solutions,%20I%20would%20like%20to%20get%20a%20free%20quote%20for%20a%20solar/backup%20power%20system."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-green-600/20 hover:shadow-green-600/30 hover:scale-[1.02] transition-all duration-200"
              id="cta-nav-whatsapp"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Free Quote</span>
            </a>
          </div>

          {/* Mobile Menu Button / Mobile CTAs */}
          <div className="flex items-center lg:hidden space-x-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-amber-400 rounded-full border border-slate-200 dark:border-slate-800"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <a
              href="tel:0686765446"
              className="p-2 bg-slate-100 dark:bg-slate-900 text-[#16a34a] rounded-full border border-slate-200 dark:border-slate-800"
              aria-label="Call Vula Lesedi Power Solutions"
            >
              <Phone className="h-4 w-4" />
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#0a2240] dark:hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 shadow-xl transition-all duration-300">
          <div className="px-4 pt-4 pb-6 space-y-3 bg-slate-50 dark:bg-slate-950">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-slate-700 dark:text-slate-300 hover:text-[#16a34a] hover:bg-white dark:hover:bg-slate-900 rounded-lg font-bold text-base transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
              <a
                href="tel:0686765446"
                className="flex items-center justify-center gap-3 w-full bg-slate-200 dark:bg-slate-900 text-[#0a2240] dark:text-white hover:bg-slate-300 dark:hover:bg-slate-800 font-bold py-3.5 rounded-xl transition-all duration-200"
              >
                <Phone className="h-5 w-5 text-[#16a34a]" />
                <span>Call: 068 676 5446</span>
              </a>
              <a
                href="https://wa.me/27686765446?text=Hi%20Vula%20Lesedi%20Power%20Solutions,%20I%20would%20like%20to%20get%20a%20free%20quote%20for%20a%20solar/backup%20power%20system."
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-3 w-full bg-[#16a34a] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-600/10"
              >
                <MessageSquare className="h-5 w-5" />
                <span>WhatsApp: Free Quote</span>
              </a>
            </div>
            <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-2 font-semibold tracking-wide">
              PROUDLY SERVING GAUTENG
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
