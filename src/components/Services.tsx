import React from "react";
import { mainServices, secondaryServices } from "../data/solarData";
import { 
  Sun, Battery, Cpu, Flame, Wrench, Zap, 
  Search, Repeat, Key, ShieldAlert, CheckSquare, 
  ArrowRight, ShieldCheck, MessageSquare 
} from "lucide-react";
import { motion } from "motion/react";

// Mapping icons for both main and secondary services
const getServiceIcon = (iconName: string, className = "h-6 w-6") => {
  switch (iconName) {
    case "Sun": return <Sun className={className} />;
    case "Battery": return <Battery className={className} />;
    case "Cpu": return <Cpu className={className} />;
    case "Flame": return <Flame className={className} />;
    case "Wrench": return <Wrench className={className} />;
    case "Zap": return <Zap className={className} />;
    case "Search": return <Search className={className} />;
    case "Repeat": return <Repeat className={className} />;
    case "Key": return <Key className={className} />;
    case "ShieldAlert": return <ShieldAlert className={className} />;
    case "CheckSquare": return <CheckSquare className={className} />;
    default: return <Zap className={className} />;
  }
};

export default function Services() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-100 px-3 py-1.5 rounded-full inline-block mb-3 border border-green-200">
            Professional Clean Energy Offerings
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2240] tracking-tight uppercase leading-none">
            Our Core Energy Solutions
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded"></div>
          <p className="text-base text-slate-600 font-bold mt-4">
            From smart hybrid solar systems to high-performance battery backups, we provide qualified engineering designed to survive South African load shedding.
          </p>
        </motion.div>

        {/* Main Services Grid with Staggered slide ups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mainServices.map((service, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              key={service.id} 
              className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-green-500/20 transition-all duration-300 flex flex-col justify-between group"
              id={`service-card-${service.id}`}
            >
              <div>
                {/* Icon Wrapper with bounce on hover */}
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#16a34a] flex items-center justify-center mb-6 group-hover:bg-[#16a34a] group-hover:text-white transition-all duration-300">
                  {getServiceIcon(service.icon, "h-6 w-6")}
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-extrabold text-[#0a2240] group-hover:text-[#16a34a] transition-colors duration-200 uppercase">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-slate-600 text-sm font-bold mt-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Bullet details if available */}
                {service.features && service.features.length > 0 && (
                  <ul className="mt-6 space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-bold text-slate-700">
                        <ShieldCheck className="h-4 w-4 text-[#16a34a] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Dynamic Action Button in Card */}
              <div className="mt-8 pt-6 border-t border-slate-200/60">
                <a
                  href={`https://wa.me/27686765446?text=Hi%20Vula%20Lesedi%20Power%20Solutions!%20I%20am%20interested%20in%20your%20${encodeURIComponent(service.title)}%20service.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#0a2240] hover:text-[#16a34a] uppercase tracking-wider transition-colors duration-200"
                >
                  <span>Inquire About This</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Showcases Container */}
        <div className="space-y-16 mb-20">
          
          {/* Showcase 1: Residential Solar Showcase with unique entrance animations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50 text-slate-800 rounded-3xl p-8 md:p-12 border border-slate-200/60 shadow-lg overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-green-100/40 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-slate-100/50 rounded-full filter blur-3xl pointer-events-none" />

            {/* Content Column - 5 cols (Desktop left) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-5 space-y-6 relative z-10 text-left order-2 lg:order-1"
            >
              <span className="text-xs font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-100 border border-green-200 px-3.5 py-1.5 rounded-full inline-block">
                Residential Solar Showcase
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0a2240] tracking-tight uppercase leading-none">
                Complete Off-Grid Transition
              </h3>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">
                Complete off-grid transition for a family home, featuring full energy independence. Say goodbye to municipal outages and loadshedding disruptions permanently.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
                  <div className="p-1.5 bg-green-100 text-[#16a34a] rounded-lg border border-green-200/40 mt-0.5">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-[#0a2240] uppercase">Full Off-Grid Autonomy</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">
                      Bypasses municipal infrastructure failures entirely with smart automated crossover.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
                  <div className="p-1.5 bg-green-100 text-[#16a34a] rounded-lg border border-green-200/40 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-[#0a2240] uppercase">Family-First Safety & Silence</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">
                      100% silent runtime with clean sine-wave output protecting delicate home electronics.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/27686765446?text=Hi%20Vula%20Lesedi%20Power%20Solutions!%20I%20would%20like%20to%20consult%20about%20a%20Complete%20Residential%20Off-Grid%20Solar%20Transition."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#0a2240] hover:bg-slate-900 text-white font-extrabold px-6 py-4 rounded-xl transition-all duration-200 text-xs uppercase tracking-wider shadow-lg w-full text-center"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Consult on Home Sizing</span>
                </a>
              </div>
            </motion.div>

            {/* Image Column - 7 cols (Desktop right) with viewport scroll scaling */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 space-y-4 relative z-10 order-1 lg:order-2"
            >
              <div className="relative group overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl">
                <motion.img
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1.0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80"
                  alt="Residential Solar Complete Off Grid Transition by Vula Lesedi"
                  className="w-full h-[300px] sm:h-[400px] object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="bg-white/95 border border-slate-100 backdrop-blur px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-lg">
                    <span className="text-[10px] text-[#16a34a] font-black block uppercase tracking-wider">System Specs</span>
                    <span>10kW Hybrid Inverter + 15kWh Storage</span>
                  </div>
                  <div className="bg-white/95 border border-slate-100 backdrop-blur px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-lg">
                    <span className="text-[10px] text-amber-500 font-black block uppercase tracking-wider">Project Location</span>
                    <span>Johannesburg Residential Estate</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Showcase 2: Flagship Business Installation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl overflow-hidden relative">
            {/* Decorative gradients */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0a2240]/40 rounded-full filter blur-3xl pointer-events-none" />

            {/* Image Column - 7 cols on large screens for maximum visibility with scroll zoom */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 space-y-4 relative z-10"
            >
              <div className="relative group overflow-hidden rounded-2xl border border-slate-700/50 shadow-xl">
                <motion.img
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1.0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=1200&q=80"
                  alt="Flagship Commercial Warehouse Solar Installation by Vula Lesedi"
                  className="w-full h-[300px] sm:h-[400px] object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="bg-slate-950/95 border border-slate-800/80 backdrop-blur px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200">
                    <span className="text-[10px] text-green-400 font-black block uppercase tracking-wider">Project Capacity</span>
                    <span>150kVA Hybrid Grid-Tie Array</span>
                  </div>
                  <div className="bg-slate-950/95 border border-slate-800/80 backdrop-blur px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200">
                    <span className="text-[10px] text-amber-400 font-black block uppercase tracking-wider">Location</span>
                    <span>Midrand Warehouse District</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Column - 5 cols */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-5 space-y-6 relative z-10 text-left"
            >
              <span className="text-xs font-extrabold text-green-400 uppercase tracking-widest bg-green-950/80 border border-green-800/60 px-3.5 py-1.5 rounded-full inline-block">
                Flagship Business Showcase
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase leading-none">
                Flagship Business Installation
              </h3>
              <p className="text-sm text-slate-300 font-bold leading-relaxed">
                Large-scale power solution for a commercial warehouse, optimizing energy costs and ensuring operational reliability during daylight hours with our high-efficiency solar grid.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  <div className="p-1.5 bg-green-950 text-green-400 rounded-lg border border-green-800/40 mt-0.5">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white uppercase">Daylight Load Optimization</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">
                      Offsets up to 85% of grid intake during peak warehouse manufacturing shifts, generating major savings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  <div className="p-1.5 bg-green-950 text-green-400 rounded-lg border border-green-800/40 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white uppercase">Zero-Downtime Operation</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">
                      Protects key equipment, industrial servers, and critical logistics computers from damaging outages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/27686765446?text=Hi%20Vula%20Lesedi%20Power%20Solutions!%20I%20would%20like%20to%20consult%20about%20a%20Flagship%20Business/Commercial%20Installation."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-green-600 text-white font-extrabold px-6 py-4 rounded-xl transition-all duration-200 text-xs uppercase tracking-wider shadow-lg shadow-green-900/20 w-full text-center"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Consult on Commercial Sizing</span>
                </a>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Secondary Services Area: General Electrical & Security */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-[#0a2240] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl"
        >
          {/* Wave Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

          {/* Section Sub-heading */}
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-extrabold text-green-400 uppercase tracking-widest bg-green-950/80 px-3 py-1 rounded-full border border-green-800/60 inline-block mb-3">
              Additional Support
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase leading-none">
              Additional Electrical & Automation Services
            </h3>
            <p className="text-slate-300 text-sm font-bold mt-3 max-w-xl">
              We also support your property with comprehensive general electrical and security solutions, fully backed by certified partner electricians.
            </p>
          </div>

          {/* Secondary Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryServices.map((service, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                key={service.id}
                className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 hover:border-green-500/30 hover:bg-slate-900/60 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-800 text-green-400 rounded-lg border border-slate-700/60">
                    {getServiceIcon(service.icon, "h-4 w-4")}
                  </div>
                  <h4 className="font-extrabold text-white text-sm sm:text-base uppercase tracking-tight">
                    {service.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed pl-1">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Secondary Services Call Action */}
          <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs font-bold text-slate-400 text-center sm:text-left">
              Need reliable electrical repairs, gate troubleshooting, or fence backup installations?
            </span>
            <a
              href="tel:0686765446"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-green-900/30 transition-all duration-200 text-sm"
              id="cta-services-call"
            >
              <Zap className="h-4 w-4" />
              <span>Call Qualified Electrician: 068 676 5446</span>
            </a>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
