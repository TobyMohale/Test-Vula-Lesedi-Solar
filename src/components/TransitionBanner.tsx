import React from "react";
import { ShieldCheck, Zap, Award, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function TransitionBanner() {
  return (
    <section className="relative py-28 overflow-hidden bg-slate-950" id="experience-banner">
      {/* Background Image with Overlay and Scroll Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.15, opacity: 0.3 }}
          whileInView={{ scale: 1.0, opacity: 0.5 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          src="https://res.cloudinary.com/dagphoc0j/image/upload/v1782730986/images_8_cf9y3a.jpg"
          alt="Vula Lesedi Solar Commissioning Grid"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Deep modern gradient overlay to guarantee perfect text contrast and modern aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bold Message & Value Prop with smooth motion animation */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full inline-block">
              SABS Approved Engineering Standards
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight leading-none">
              Engineered for Performance.<br />
              <span className="text-[#16a34a]">Built for Gauteng Realities.</span>
            </h2>
            
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
              We don't just hang boxes on walls. We design complete micro-grid hubs tailored to handle grid drops, protect your high-end smart appliances, and maximize solar capture under the Highveld sun.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="https://wa.me/27686765446?text=Hi%20Vula%20Lesedi!%20I%2527m%20interested%20in%20a%20professional%20solar%20solution%20and%20would%20like%20to%20schedule%20a%20site%20assessment."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-green-600 text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 text-xs uppercase tracking-wider shadow-lg shadow-green-950/50 cursor-pointer"
              >
                <span>Schedule Site Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-800 hover:border-slate-700 font-black py-4 px-6 rounded-2xl transition-all duration-300 text-xs uppercase tracking-wider cursor-pointer"
              >
                <span>Request Call Back</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Key Trust Badges with sequential slide-in motion */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl space-y-3 hover:border-[#16a34a]/30 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-[#16a34a]/10 border border-[#16a34a]/20 flex items-center justify-center text-[#16a34a]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                100% CoC Certified
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">
                Fully compliant installations with legal Certificate of Compliance paperwork handed over on every job.
              </p>
            </div>

            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl space-y-3 hover:border-amber-500/30 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Premium Hardware
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">
                Deploying Tier-1 Sunsynk controllers, Deye microinverters, and high-yield Canadian Solar arrays.
              </p>
            </div>

            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl space-y-3 hover:border-blue-500/30 transition-all duration-300 sm:col-span-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                    Supervised Site Operations
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400 leading-normal mt-0.5">
                    We never leave casual laborers unsupervised on your property. Every project is overseen by an experienced installer.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
