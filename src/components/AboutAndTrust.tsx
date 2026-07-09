import React, { useState } from "react";
import { brandPartners } from "../data/solarData";
import { 
  Compass, Heart, Award, ShieldAlert, BadgeHelp, 
  Sparkles, Check, ChevronRight, Clipboard, ShieldCheck, 
  Cpu, Activity, Users 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AboutAndTrust() {
  const [brandFilter, setBrandFilter] = useState("all");

  const trustReasons = [
    {
      title: "Solutions Tailored to Your Budget",
      description: "Big budget or small budget – we believe in engineering systems that solve your specific energy problem without draining your pocket.",
      icon: "💰"
    },
    {
      title: "No Unnecessary Upselling",
      description: "We give honest advice based on your actual consumption data. We never sell you larger inverters or more battery cells than you actually require.",
      icon: "🤝"
    },
    {
      title: "Qualified Installation Supervision",
      description: "Every installation is supervised or executed by a qualified electrician, and backed by a comprehensive electrical Certificate of Compliance (CoC).",
      icon: "⚡"
    },
    {
      title: "Premium Hardware Partnerships",
      description: "We deploy premium tech from Deye, Sunsynk, Canadian Solar, and LuxpowerTek. No cheap components, no fire risks, only official local warranties.",
      icon: "🔋"
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Free Needs Assessment",
      desc: "We analyze your monthly municipal electricity bill and map your essential load shedding appliances."
    },
    {
      step: "02",
      title: "Custom System Sizing",
      desc: "Our assessors design a bespoke hybrid solar or backup profile that fits your family's exact budget."
    },
    {
      step: "03",
      title: "Professional Installation",
      desc: "Our skilled teams install your solar array, mount the inverter, and wire up safety boards safely."
    },
    {
      step: "04",
      title: "Electrical CoC Handover",
      desc: "A registered electrician performs comprehensive testing and issues your official CoC certificate."
    },
    {
      step: "05",
      title: "After-Sales App Sync",
      desc: "We configure your real-time mobile tracking app so you can monitor your solar savings on your phone."
    }
  ];

  const filteredPartners = brandPartners.filter((partner) => {
    if (brandFilter === "all") return true;
    if (brandFilter === "inverters") {
      return partner.type.toLowerCase().includes("inverter") || partner.type.toLowerCase().includes("charger");
    }
    if (brandFilter === "panels") {
      return partner.type.toLowerCase().includes("panel");
    }
    if (brandFilter === "batteries") {
      return partner.type.toLowerCase().includes("battery") || partner.type.toLowerCase().includes("storage");
    }
    return true;
  });

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden" id="about">
      {/* Wave Section Transition Divider at Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 text-[#f1f5f9] fill-current">
          <path d="M1200,120V0H0V120c159.2,2.5,312.4,12.2,468.2,33.5C622.3,176.7,778,171.7,935.2,143,1033.4,125,1118.8,120,1200,120Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. Brand Partners Section */}
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-xs font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5 border border-green-200">
              Brands We Install
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0a2240] uppercase tracking-tight leading-none mb-3">
              Elite Engineering Partner Brands
            </h3>
            <p className="text-sm font-bold text-slate-500 max-w-2xl mx-auto mb-8">
              We partner with industry-leading solar brands to ensure every installation meets the highest standards of reliability and performance for the South African climate.
            </p>
          </motion.div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: "all", label: "All Equipment" },
              { id: "inverters", label: "Inverters" },
              { id: "panels", label: "Solar Panels" },
              { id: "batteries", label: "Batteries & Storage" }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setBrandFilter(btn.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  brandFilter === btn.id
                    ? "bg-[#16a34a] text-white shadow-md shadow-green-600/10 border border-[#16a34a]"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPartners.map((partner, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  key={partner.id} 
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#16a34a]/30 transition-all duration-300 text-center flex flex-col justify-between group"
                >
                  <div>
                    {/* Brand logo container */}
                    <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-4 bg-white rounded-2xl p-2.5 border border-slate-200/60 shadow-inner group-hover:bg-slate-50 group-hover:border-[#16a34a]/30 transition-all duration-300">
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={`${partner.name} logo`}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-xl font-black text-[#0a2240]">{partner.name[0]}</span>
                      )}
                    </div>

                    <span className="text-[9px] font-black uppercase text-[#16a34a] bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                      {partner.type}
                    </span>
                    <h4 className="font-extrabold text-[#0a2240] text-sm md:text-base mt-3">
                      {partner.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-400 mt-1.5 leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* 2. Company Biography Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          
          {/* Left bio content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <span className="text-xs font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-100 px-3.5 py-1.5 rounded-full inline-block border border-green-200">
              Company Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2240] tracking-tight uppercase leading-none">
              Powering a Brighter Tomorrow
            </h2>
            <p className="text-base text-slate-600 font-bold leading-relaxed">
              Vula Lesedi Power Solutions is a proud South African solar energy enterprise based in Gauteng. We help local homeowners and business operations decrease electricity expenses, establish permanent energy autonomy, and insulate themselves from load shedding.
            </p>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Our fundamental philosophy centers on high workmanship standards, honest consultative dialogue, and tailoring technical systems around each client's unique financial budget. We treat our clients as long-term partners, ensuring continuous after-sales technical support for maximum peace of mind.
            </p>

            {/* Mission Statement Box */}
            <div className="bg-[#0a2240] text-white p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-green-500/10 rounded-full filter blur-xl" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-900 text-green-400 rounded-xl border border-slate-800 shrink-0">
                  <Compass className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm uppercase tracking-wider text-green-400">
                    Our Mission Statement
                  </h4>
                  <p className="text-xs md:text-sm text-slate-200 font-semibold mt-1.5 leading-relaxed">
                    "To deliver reliable, affordable and sustainable energy solutions that empower our clients to take control of their electricity needs while building long-term relationships based on trust and quality."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Stats & Team Reassurance Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 mb-6 group">
              <img 
                src="https://res.cloudinary.com/dagphoc0j/image/upload/v1783015955/706317333_122105336451309543_8905206160145182564_n_wwi8sx.jpg" 
                alt="Vula Lesedi team installing solar panels" 
                className="w-full h-64 sm:h-72 object-cover transform transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Stat 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left hover:border-green-500/30 transition-colors duration-300">
                <span className="text-3xl">🏠</span>
                <h4 className="text-lg font-extrabold text-[#0a2240] mt-3 uppercase leading-none">
                  Residential Specialists
                </h4>
                <p className="text-xs text-slate-400 font-bold mt-1.5">
                  Complete off-grid or hybrid transitions for any size home.
                </p>
              </div>

              {/* Stat 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left hover:border-green-500/30 transition-colors duration-300">
                <span className="text-3xl">🏢</span>
                <h4 className="text-lg font-extrabold text-[#0a2240] mt-3 uppercase leading-none">
                  Commercial Sizing
                </h4>
                <p className="text-xs text-slate-400 font-bold mt-1.5">
                  Protecting offices, shops, and clinics from blackouts.
                </p>
              </div>

              {/* Stat 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left hover:border-green-500/30 transition-colors duration-300">
                <span className="text-3xl">👨‍🔧</span>
                <h4 className="text-lg font-extrabold text-[#0a2240] mt-3 uppercase leading-none">
                  Qualified Electricians
                </h4>
                <p className="text-xs text-slate-400 font-bold mt-1.5">
                  Certified partner electricians ensuring full safety and compliance.
                </p>
              </div>

              {/* Stat 4 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left hover:border-green-500/30 transition-colors duration-300">
                <span className="text-3xl">🛡️</span>
                <h4 className="text-lg font-extrabold text-[#0a2240] mt-3 uppercase leading-none">
                  CoC Guaranteed
                </h4>
                <p className="text-xs text-slate-400 font-bold mt-1.5">
                  Official Certificate of Compliance handed over post-install.
                </p>
              </div>

            </div>
          </motion.div>

        </div>

        {/* 3. Why Choose Us Trust Card */}
        <div className="mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-xs font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-100 px-3 py-1.5 rounded-full inline-block border border-green-200">
              Why Customers Choose Us
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0a2240] uppercase tracking-tight leading-none mt-3">
              Honest Engineering, Zero Upselling
            </h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">
              Our Core Local Business Commitments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustReasons.map((reason, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#16a34a]/30 transition-all duration-200 text-left"
              >
                <span className="text-3xl shrink-0 block mb-4">{reason.icon}</span>
                <h4 className="text-sm sm:text-base font-extrabold text-[#0a2240] uppercase tracking-tight">
                  {reason.title}
                </h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2.5">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. Credibility & Step-by-Step Workflow Reassurance */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden"
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[10px] font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full border border-green-100 inline-block mb-3">
              Service Delivery Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0a2240] uppercase leading-none">
              Our Professional Workflow
            </h3>
            <p className="text-xs font-black text-slate-400 uppercase mt-2 tracking-widest">
              How We Deliver Peace of Mind to Gauteng Properties
            </p>
          </div>

          {/* Workflow Horizontal Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
            
            {workflowSteps.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group text-left"
              >
                {/* Visual Step Card */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-green-500/30 transition-all duration-200 relative h-full">
                  
                  {/* Step index badge */}
                  <span className="text-xs font-black text-[#16a34a] bg-green-100/60 px-2.5 py-1 rounded-full border border-green-200 absolute top-4 right-4">
                    {step.step}
                  </span>

                  {/* Icon Representation */}
                  <div className="w-10 h-10 rounded-xl bg-[#0a2240] text-white flex items-center justify-center mb-4">
                    {idx === 0 && <Clipboard className="h-5 w-5" />}
                    {idx === 1 && <Compass className="h-5 w-5" />}
                    {idx === 2 && <Cpu className="h-5 w-5" />}
                    {idx === 3 && <ShieldCheck className="h-5 w-5 animate-pulse" />}
                    {idx === 4 && <Activity className="h-5 w-5" />}
                  </div>

                  {/* Title */}
                  <h4 className="font-extrabold text-slate-800 text-sm uppercase">
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-2">
                    {step.desc}
                  </p>

                </div>

                {/* Arrow Connector on desktop between steps */}
                {idx < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20 pointer-events-none">
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}

          </div>

          {/* Prompt action */}
          <div className="mt-10 text-center border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400 font-bold mb-4">
              *All systems include technical handovers and a registered monitoring setup.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-black text-[#16a34a] hover:text-[#0a2240] uppercase tracking-wider transition-colors duration-200"
            >
              <span>Get a Free Sizing Consultation</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
