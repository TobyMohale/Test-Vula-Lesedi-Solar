import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("vula_lesedi_cookie_consent");
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("vula_lesedi_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("vula_lesedi_cookie_consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-6xl mx-auto pointer-events-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
              <button 
                onClick={declineCookies}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex gap-4 md:gap-6 items-start md:items-center">
                <div className="p-3 bg-green-100 dark:bg-green-950/50 text-[#16a34a] rounded-2xl shrink-0">
                  <Cookie className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0a2240] dark:text-white uppercase tracking-tight mb-1">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed max-w-2xl pr-6">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic to improve our solar services. By clicking "Accept All", you consent to our use of cookies.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                <button
                  onClick={declineCookies}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider transition-colors text-center"
                >
                  Reject All
                </button>
                <button
                  onClick={acceptCookies}
                  className="px-6 py-3.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-green-500/20 dark:shadow-green-900/20 transition-all active:scale-95 text-center"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
