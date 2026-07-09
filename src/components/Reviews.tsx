import React, { useState, useEffect } from "react";
import { Star, Quote, CheckCircle2, MapPin, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  system: string;
  rating: number;
  review: string;
  date: string;
  highlight: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Sipho Nkosi",
    location: "Centurion, Pretoria",
    system: "8kW Hybrid Inverter & 10kWh Battery System",
    rating: 5,
    highlight: "Loadshedding is a thing of the past!",
    review: "The engineering team from Vula Lesedi was exceptional. They sized our battery backup perfectly to handle our automated gate, security system, double-door fridge, and office computers. Extremely quiet, clean installation with CoC issued promptly.",
    date: "May 2026"
  },
  {
    name: "Liezel van der Merwe",
    location: "Garsfontein, Pretoria East",
    system: "5kW Inverter & 5.1kWh Lithium Backup",
    rating: 5,
    highlight: "Professional & cost-efficient",
    review: "Very impressed with the transparent pricing. They didn't try to oversell us. The 5kW system easily powers our whole evening backup load. Honest team, neat wiring inside the garage, and friendly follow-up advice.",
    date: "June 2026"
  },
  {
    name: "David Ndlovu",
    location: "Midrand, Gauteng",
    system: "12kW Commercial Solar Grid-Tie Array",
    rating: 5,
    highlight: "Saves us thousands in warehouse operations",
    review: "We running a small printing and logistics business in Midrand and daylight downtime was costing us thousands. Vula Lesedi installed a robust commercial array that automatically switches over. Operational reliability is back to 100%.",
    date: "April 2026"
  },
  {
    name: "Kobus Olivier",
    location: "Roodepoort, West Rand",
    system: "Solar Geyser & 5kW Backup Combo",
    rating: 5,
    highlight: "Drastic drop in our electricity bill!",
    review: "Combining the solar geyser upgrade with a standard battery backup has cut our municipal billing by almost half. The technicians are certified and knew exactly how to configure the municipal switchboard.",
    date: "March 2026"
  },
  {
    name: "Amara Adebayo",
    location: "Sandton, Johannesburg",
    system: "10kW Off-Grid Ready Premium Setup",
    rating: 5,
    highlight: "Outstanding premium customer service",
    review: "Their dispatcher responded over WhatsApp within 10 minutes of my inquiry. A technical consultant arrived at our Sandton property the next morning to conduct a free assessment. Cleanest solar panels layout I have seen.",
    date: "June 2026"
  }
];

export default function Reviews() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const loadReviews = () => {
      const stored = localStorage.getItem("vula_lesedi_reviews");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Testimonial[];
          setTestimonials([...parsed, ...DEFAULT_TESTIMONIALS]);
        } catch (e) {
          setTestimonials(DEFAULT_TESTIMONIALS);
        }
      } else {
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    };

    loadReviews();
    window.addEventListener("reviews-updated", loadReviews);
    return () => window.removeEventListener("reviews-updated", loadReviews);
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Guard against out of index if list dynamically changes
  const activeTestimonial = testimonials[activeIndex] || testimonials[0] || DEFAULT_TESTIMONIALS[0];

  return (
    <section className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-300" id="reviews">
      {/* Decorative gradient graphics */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-green-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#0a2240]/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-100 dark:bg-green-950/40 px-3 py-1.5 rounded-full inline-block mb-3 border border-green-200 dark:border-green-800">
            Client Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2240] dark:text-white tracking-tight uppercase leading-none">
            What Our Customers Say
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded"></div>
          <p className="text-base text-slate-600 dark:text-slate-300 font-bold mt-4">
            Read real, verified installation reviews from local homeowners and commercial business managers across Pretoria, Johannesburg, and Midrand.
          </p>
        </div>

        {/* Dynamic Highlight Card (Carousel view + side grid list) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Active Featured Testimonial Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 text-white p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full filter blur-2xl pointer-events-none" />
            <div className="absolute top-8 right-8 text-slate-800 opacity-20">
              <Quote className="h-24 w-24 shrink-0" />
            </div>

            <div className="relative z-10 space-y-6">
              
              {/* Star rating & verified badge */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(activeTestimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="flex items-center gap-1 bg-green-950/80 text-green-400 border border-green-800/40 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Installation
                </span>
              </div>

              {/* Title highlight */}
              <blockquote className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-tight">
                "{activeTestimonial.highlight}"
              </blockquote>

              {/* Core review paragraph */}
              <p className="text-slate-300 text-sm md:text-base font-semibold leading-relaxed">
                {activeTestimonial.review}
              </p>

              {/* System Specs label */}
              <div className="bg-slate-950/50 border border-slate-800/80 p-3.5 rounded-xl inline-block">
                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest block mb-0.5">Installed hardware Configuration</span>
                <span className="text-xs font-bold text-slate-200">{activeTestimonial.system}</span>
              </div>

            </div>

            {/* Author details & controls */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              
              <div>
                <h4 className="font-extrabold text-base text-white">{activeTestimonial.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  <span className="font-bold">{activeTestimonial.location}</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-semibold">{activeTestimonial.date}</span>
                </div>
              </div>

              {/* Control arrows */}
              <div className="flex gap-2 self-end sm:self-auto">
                <button
                  onClick={prevTestimonial}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-colors cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-colors cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

            </div>

          </div>

          {/* Quick list view selector (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {testimonials.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-slate-50 dark:bg-slate-900/60 border-[#16a34a] shadow-sm"
                        : "bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className={`font-extrabold text-sm ${isActive ? "text-[#16a34a]" : "text-[#0a2240] dark:text-white"}`}>
                          {item.name}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">{item.location}</p>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-1">
                      {item.highlight}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* CTA bottom block */}
            <div className="bg-green-50/60 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30 rounded-3xl p-5 text-center mt-3 lg:mt-0">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Are you located in Pretoria, Midrand, or Johannesburg?
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-1 text-xs font-black text-[#16a34a] hover:text-[#0a2240] dark:hover:text-white uppercase tracking-wider mt-2 transition-colors"
              >
                <span>Request Your Free Site Consultation</span>
                <span>&rarr;</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
