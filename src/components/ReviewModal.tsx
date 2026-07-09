import React, { useState } from "react";
import { X, Star, CheckCircle, ShieldAlert, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [system, setSystem] = useState("");
  const [highlight, setHighlight] = useState("");
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please provide your name.");
      return;
    }
    if (!location.trim()) {
      setError("Please provide your city/area (e.g., Centurion, Pretoria).");
      return;
    }
    if (!system.trim()) {
      setError("Please specify your installed solar/battery hardware.");
      return;
    }
    if (!highlight.trim()) {
      setError("Please enter a short headline summary of your experience.");
      return;
    }
    if (!review.trim()) {
      setError("Please write your detailed review.");
      return;
    }

    // Format current date (e.g. June 2026)
    const options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
    const dateStr = new Date().toLocaleDateString("en-US", options);

    const newReview = {
      name: name.trim(),
      location: location.trim(),
      system: system.trim(),
      rating,
      highlight: highlight.trim(),
      review: review.trim(),
      date: dateStr,
    };

    try {
      const stored = localStorage.getItem("vula_lesedi_reviews");
      const currentReviews = stored ? JSON.parse(stored) : [];
      const updatedReviews = [newReview, ...currentReviews];
      localStorage.setItem("vula_lesedi_reviews", JSON.stringify(updatedReviews));

      // Dispatch custom event to notify Reviews component
      window.dispatchEvent(new Event("reviews-updated"));

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        // Reset form
        setName("");
        setLocation("");
        setSystem("");
        setHighlight("");
        setReview("");
        setRating(5);
        onClose();
      }, 2500);
    } catch (e) {
      setError("Could not save your review. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 text-slate-800 dark:text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-[#0a2240] dark:text-white uppercase tracking-tight">
                  Write a Review
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Share your installation experience with Vula Lesedi
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Success Animation view */}
            {isSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-950/50 border border-green-200 dark:border-green-900 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <CheckCircle className="h-9 w-9" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-black uppercase tracking-tight text-[#0a2240] dark:text-white">
                    Review Submitted!
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed max-w-xs mx-auto">
                    Thank you! Your verified review has been published and added to our portfolio.
                  </p>
                </div>
              </div>
            ) : (
              /* Core Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Rating selection stars */}
                <div className="space-y-1 text-center bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                    Your Overall Rating
                  </label>
                  <div className="flex justify-center gap-1.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="p-1 transition-all hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            star <= (hoveredRating ?? rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sipho Nkosi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/30 transition-all text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Location Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                      Your Area/City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Centurion, Pretoria"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/30 transition-all text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* System Specs Selection/Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Installed Solar System / Backup Hardware *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8kW Hybrid Inverter & 10kWh Battery backup"
                    value={system}
                    onChange={(e) => setSystem(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/30 transition-all text-slate-800 dark:text-white"
                  />
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block">
                    Mention the inverter size, battery capacity, or solar panels installed.
                  </span>
                </div>

                {/* Headline summary / Highlight */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Headline Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Loadshedding is a thing of the past! Excellent work"
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/30 transition-all text-slate-800 dark:text-white"
                  />
                </div>

                {/* Detailed review body */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Detailed Experience *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explain how Vula Lesedi conducted the assessment, system sizing, CoC certification, neatness, or service reliability..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/30 transition-all text-slate-800 dark:text-white resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
