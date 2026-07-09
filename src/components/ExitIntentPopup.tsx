import React, { useState, useEffect } from "react";
import { X, Zap, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("vula_lesedi_exit_intent");
    
    if (hasSeenPopup) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        setIsVisible(true);
        sessionStorage.setItem("vula_lesedi_exit_intent", "true");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const closePopup = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 text-slate-800 dark:text-slate-100 p-8 sm:p-10 text-center"
          >
            <button
              onClick={closePopup}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/40 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Zap className="h-10 w-10 fill-amber-500" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#0a2240] dark:text-white uppercase tracking-tight mb-3">
              Wait! Don't leave yet.
            </h3>
            
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-semibold mb-8 leading-relaxed">
              Get a <span className="text-[#16a34a] font-extrabold">FREE, NO-OBLIGATION</span> site assessment before making any solar or backup power decisions. We'll size your system accurately and give you an honest quote.
            </p>

            <div className="space-y-3">
              <a
                href="https://wa.me/27686765446"
                target="_blank"
                rel="noreferrer"
                onClick={closePopup}
                className="w-full flex justify-center items-center gap-2 py-4 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-black uppercase tracking-wider rounded-xl shadow-lg shadow-green-500/20 transition-transform active:scale-95"
              >
                <span>Chat with an Expert on WhatsApp</span>
              </a>
              
              <a
                href="tel:0686765446"
                onClick={closePopup}
                className="w-full flex justify-center items-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0a2240] dark:text-white text-sm font-black uppercase tracking-wider rounded-xl transition-colors"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call 068 676 5446</span>
              </a>
            </div>

            <button
              onClick={closePopup}
              className="mt-6 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4"
            >
              No thanks, I'll pay full price for loadshedding
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
