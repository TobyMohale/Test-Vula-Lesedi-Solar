import React, { useState } from "react";
import { Zap, ShieldCheck, Sun, MessageSquare, Clipboard, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);

  const bulletPoints = [
    { text: "Solar Power Systems", icon: "☀️" },
    { text: "Backup Power Solutions", icon: "🔋" },
    { text: "Inverters & Batteries", icon: "🔌" },
    { text: "Energy Independence", icon: "⚡" },
    { text: "Expert Installation", icon: "🛠️" },
    { text: "After-Sales Support", icon: "📞" },
  ];

  return (
    <section className="relative bg-[#050e1a] text-white pt-20 pb-16 overflow-hidden" id="hero">
      
      {/* 1. Full-bleed Interactive Welcome Tour Video Banner (Covers top of hero) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full aspect-video md:h-[60vh] lg:h-[65vh] bg-slate-950 overflow-hidden shadow-2xl border-b border-slate-800/80 group cursor-pointer"
        onMouseEnter={() => setIsPlaying(true)}
        onMouseLeave={() => setIsPlaying(false)}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {/* Background Poster Image */}
        <img
          src="https://res.cloudinary.com/dagphoc0j/image/upload/v1783015953/image_2_Vula_Lesedi_Power_Solutions_Profile_Image_Banner_h0dmcx.jpg"
          alt="Vula Lesedi Power Solutions Banner"
          className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-20 transition-opacity duration-700 ${isPlaying ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
          referrerPolicy="no-referrer"
        />

        {isPlaying && (
          <iframe
            src="https://www.youtube-nocookie.com/embed/JwvfnXmFG4M?autoplay=1&mute=1&loop=1&playlist=JwvfnXmFG4M&controls=1&rel=0&playsinline=1"
            title="Vula Lesedi Promo"
            className="absolute inset-0 w-full h-full object-cover z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}

        {/* Modern dark gradient overlays to guarantee perfect text separation and visual polish */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050e1a] via-[#050e1a]/80 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050e1a]/50 via-transparent to-[#050e1a]/10 pointer-events-none z-20" />

        {/* Troubleshooting Assist Panel - Subtle and beautifully integrated in the corner */}
        <div className="absolute bottom-6 right-6 sm:right-8 z-30 max-w-xs bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/80 shadow-2xl text-left hidden sm:block">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Video Player Guide</p>
              <p className="text-[10px] font-semibold text-slate-300 mt-1 leading-normal">
                If YouTube states "playback disabled by video owner", simply click "Watch on YouTube" or enable "Allow embedding" in your video settings.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative ambient background glows below the video */}
      <div className="absolute top-[60vh] -right-20 w-96 h-96 bg-[#16a34a]/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none animate-pulse" />

      {/* 2. Main Writing and Graphics Section (Moved below the video) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Headline, Description and Slogans with smooth motion animation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* Trust and Area Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-green-950/80 text-green-400 border border-green-800/60">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                PROUDLY SERVING GAUTENG ONLY
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-800/60">
                ⭐ FREE QUOTE TODAY
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              ANOTHER HOME.<br />
              <span className="text-[#16a34a]">ANOTHER FUTURE.</span><br />
              <span className="text-amber-400 relative">
                POWERED BY THE SUN.
                <span className="absolute bottom-1 left-0 w-full h-1 bg-amber-400/25 rounded-full"></span>
              </span>
            </h1>

            {/* Sub-headline / Brand banner quote */}
            <p className="text-sm sm:text-base md:text-lg font-bold text-slate-300 max-w-xl leading-relaxed">
              Powering Gauteng through every load shedding outage with reliable, clean, and affordable energy solutions.
            </p>

            {/* Bullet points with staggered entrance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {bulletPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.08, ease: "easeOut" }}
                  className="flex items-center gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 hover:border-[#16a34a]/30 shadow-sm transition-all duration-200"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-950 text-base border border-green-800/40">
                    {point.icon}
                  </span>
                  <span className="font-bold text-slate-200 text-xs sm:text-sm uppercase tracking-wide">
                    {point.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a
                href="https://wa.me/27686765446?text=Hi%20Vula%20Lesedi%20Power%20Solutions,%20I%20would%20like%20to%20get%20a%20free%20quote%20for%20a%20solar/backup%20power%20system."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-black px-8 py-4 rounded-xl shadow-lg shadow-green-950/40 transition-all duration-200 text-xs uppercase tracking-wider"
                id="hero-cta-whatsapp"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Get Free Quote Today</span>
              </a>
              <a
                href="#estimator"
                className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 font-black px-6 py-4 rounded-xl shadow-sm transition-all duration-200 text-xs uppercase tracking-wider"
                id="hero-cta-estimator"
              >
                <Clipboard className="h-4.5 w-4.5 text-[#16a34a]" />
                <span>Estimate My Sizing</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 text-slate-500" />
              </a>
            </div>

            {/* Key trust indicators from flyer */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-slate-400 font-bold text-[10px] uppercase tracking-wider border-t border-slate-800/60 w-fit">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#16a34a]" />
                <span>Top Hardware Brands</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Qualified Electricians</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-[#16a34a]" />
                <span>100% Reliable Backup</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Visual System Architecture with spring motion entrance */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 60 }}
            className="lg:col-span-5 relative flex justify-center w-full"
          >
            
            {/* Visual Frame */}
            <div className="relative bg-slate-950/80 p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-md max-w-sm sm:max-w-md w-full overflow-hidden">
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#16a34a]/10 rounded-full filter blur-xl" />
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-[#0a2240]/10 rounded-full filter blur-xl" />

              {/* Title inside visual frame */}
              <div className="text-center mb-6 border-b border-slate-800/60 pb-4">
                <span className="text-[10px] font-extrabold text-green-400 uppercase tracking-widest block mb-1">
                  System Architecture
                </span>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  VLPS Smart Solar Suite
                </h3>
              </div>

              {/* 1. Solar Panels Mock Representation */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 shadow-inner mb-5 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sun className="h-4 w-4 text-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Canadian Solar Panel Grid</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">98.5% Yield</span>
                </div>
                {/* Visual Solar Panels grid cells */}
                <div className="grid grid-cols-4 gap-1 h-20 bg-slate-950 rounded p-1.5 border border-slate-800">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-gradient-to-b from-blue-950 to-blue-900 rounded border border-blue-900/40 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4px_4px]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Cable Graphic */}
              <div className="flex justify-center my-[-10px] relative z-10">
                <div className="w-1.5 h-6 bg-gradient-to-b from-amber-500 to-green-500 animate-pulse" />
              </div>

              {/* 2. Smart Hybrid Inverter Mock Representation (Sunsynk/Deye style) */}
              <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/80 shadow-md relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Hybrid Smart Inverter</span>
                    <h4 className="text-xs font-black text-white tracking-tight">SUN SYNK / DEYE Suite</h4>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-[#16a34a] text-white text-[9px] font-extrabold rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    ACTIVE
                  </span>
                </div>

                {/* Digital LED Screen Representation */}
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 flex justify-between items-center text-left font-mono">
                  <div>
                    <span className="text-[8px] text-slate-500 block leading-none">PV GENERATION</span>
                    <span className="text-xs font-extrabold text-amber-500">4.8 kW</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[8px] text-slate-500 block leading-none">HOUSE LOAD</span>
                    <span className="text-xs font-extrabold text-emerald-400">1.2 kW</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-slate-500 block leading-none">BATTERY STATE</span>
                    <span className="text-xs font-extrabold text-green-400">100%</span>
                  </div>
                </div>

                {/* Simulated circular dial LED or status rings */}
                <div className="flex justify-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Grid Safe</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">UPS Mode</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Solar Gen</span>
                  </div>
                </div>
              </div>

              {/* Connecting Cable Graphic */}
              <div className="flex justify-center my-[-10px] relative z-10">
                <div className="w-1.5 h-6 bg-gradient-to-b from-green-500 to-slate-800 animate-pulse" />
              </div>

              {/* 3. Lithium Storage Battery Pack Mock Representation */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 shadow-lg text-slate-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">LiFePO4 Storage Battery</span>
                  <span className="text-[9px] font-bold text-green-400 font-mono">51.2V | 100Ah</span>
                </div>
                <div className="flex items-center justify-between border border-slate-800/80 rounded-lg p-2 bg-slate-950">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-6 border-2 border-slate-700 rounded-md p-0.5 flex items-center bg-slate-900 relative">
                      <div className="h-full w-full bg-green-500 rounded-sm" />
                      <div className="w-1 h-2 bg-slate-700 absolute -right-1.5 top-1.5 rounded-r" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-white">5.12 kWh Pack</span>
                  </div>
                  {/* Battery Level Indicators */}
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Hardware Brand Badges at Bottom of Card */}
              <div className="mt-5 border-t border-slate-800/60 pt-3 flex justify-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <span>Deye</span>
                <span>•</span>
                <span>Sunsynk</span>
                <span>•</span>
                <span>Luxpower</span>
              </div>

            </div>

            {/* Badge overlay indicating professional installation */}
            <div className="absolute -bottom-5 -right-3 sm:right-2 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 max-w-[170px] text-left">
              <span className="text-[10px] text-green-400 font-black uppercase tracking-widest block">Quality Assured</span>
              <span className="text-[10px] font-extrabold text-slate-300 mt-1 block leading-normal">Full Electrical CoC Provided with Every Build</span>
            </div>

          </motion.div>

        </div>
      </div>

      {/* CSS Diagonal Wave Divider to transition into white background section */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 text-[#0a2240] fill-current"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,113.8,27.35,166,35.59,250.21,49.52,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  );
}
