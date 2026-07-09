import React, { useState } from "react";
import { 
  Sun, Battery, Zap, CheckCircle2, Eye, Maximize2, X, ChevronRight, MessageSquare 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Project {
  id: string;
  title: string;
  category: "panels" | "inverters" | "backup" | "all";
  categoryLabel: string;
  image: string;
  capacity: string;
  hardware: string;
  location: string;
  description: string;
  highlights: string[];
}

export default function ProjectPortfolio() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: "canadian-solar",
      title: "Canadian Solar Monocrystalline Array",
      category: "panels",
      categoryLabel: "Solar Roof Arrays",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782728843/canadian-solar_krkiff.avif",
      capacity: "12kW Peak Generation",
      hardware: "Canadian Solar PV Modules & Custom Alum Mounts",
      location: "Waterkloof, Pretoria",
      description: "A premium high-yield roof installation tailored to maximize winter solar capture angles. Features state-of-the-art Canadian Solar Tier-1 double-glass panels engineered to deliver superior degradation resistance and peak output during morning and evening periods.",
      highlights: [
        "Optimal 28-degree tilt angle integration",
        "Neat sub-roof DC conduit routing",
        "Class-A surge protection modules"
      ]
    },
    {
      id: "sunsynk-hybrid-neat",
      title: "Sunsynk Smart Backup System",
      category: "inverters",
      categoryLabel: "Hybrid Inverters",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782728843/synsynk_project_2_qybavq.avif",
      capacity: "8kW Continuous Output",
      hardware: "Sunsynk 8kW Inverter + Modular Storage",
      location: "Centurion, Pretoria",
      description: "An incredibly clean, garage wall-mounted hybrid installation. Designed with strict spatial organization, full physical trunking, a dual-pole AC bypass switch, and automated changeover mechanisms to ensure power remains uninterruptible.",
      highlights: [
        "Fully integrated distribution board bypass",
        "Neat metal trunking configuration",
        "Automated mobile-app Wi-Fi status linking"
      ]
    },
    {
      id: "sunsynk-smart-detail",
      title: "Sunsynk Smart Inverter Core",
      category: "inverters",
      categoryLabel: "Hybrid Inverters",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1783015954/image_3_Vula_Lesedi_Power_Solutions_Profile_Image_Banner_yxdnut.jpg",
      capacity: "High Efficiency Controller",
      hardware: "Sunsynk 5kW Intelligent Inverter",
      location: "Garsfontein, Pretoria East",
      description: "A close-up view of our technical precision during the commissioning of a Sunsynk system. We optimize inverter cooling clearance, program dynamic battery charge profiles, and configure time-of-use scheduling to avoid charging from expensive grid rates.",
      highlights: [
        "Optimized cooling clearance parameters",
        "Dynamic time-of-use discharge rules",
        "Built-in lightning & earth-fault protection"
      ]
    },
    {
      id: "backup-cabinet",
      title: "High-Capacity Power Storage Bay",
      category: "backup",
      categoryLabel: "Premium Storage",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782728843/Backup_Power_Systems_project_1_dwyogt.avif",
      capacity: "30kWh Lithium Bank",
      hardware: "Dyness & Shoto Rackmount LiFePO4 Packs",
      location: "Midrand Commercial Park",
      description: "A robust high-capacity battery bank installation for a commercial office. This heavy-duty system is configured in an insulated rack enclosure with active temperature monitoring to ensure maximum lifespan and zero operations downtime.",
      highlights: [
        "Rack-mounted structured cabinet frame",
        "Smart Battery Management System (BMS)",
        "Fused DC isolators per battery module"
      ]
    },
    {
      id: "sunsynk-battery-combo",
      title: "Sunsynk & Lithium Compact Setup",
      category: "backup",
      categoryLabel: "Premium Storage",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782728842/Synsync_Smart_Inverter_jpkh4r.avif",
      capacity: "5.1kWh Backup Combo",
      hardware: "Sunsynk Hybrid Inverter + Freedom Won Battery",
      location: "Sandton, Johannesburg",
      description: "A space-saving domestic backup power station engineered for compact residential garages. Features an ultra-thin wall-mounted LiFePO4 battery paired with a smart hybrid inverter, supplying seamless emergency load coverage.",
      highlights: [
        "Space-saving slim wall-mount design",
        "10ms seamless transfer automatic switch",
        "Complete technical CoC verification"
      ]
    }
  ];

  const filteredProjects = projects.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  return (
    <section className="py-24 bg-[#091424] text-white relative overflow-hidden" id="portfolio">
      {/* Background radial highlight */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#0a2240]/40 rounded-full filter blur-3xl pointer-events-none" />

      {/* Decorative Wave Divider */}
      <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#f8fafc]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with smooth entry scroll transition */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-extrabold text-green-400 uppercase tracking-widest bg-green-950/80 border border-green-800/60 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Recent Work Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
            Our Installation Showcase
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded"></div>
          <p className="text-sm sm:text-base text-slate-300 font-medium mt-4 leading-relaxed">
            Take a look at the technical excellence and clean layout of our recent residential and commercial solar installations across Gauteng.
          </p>
        </motion.div>

        {/* Filter Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {[
            { id: "all", label: "All Showcase" },
            { id: "panels", label: "Solar Arrays", icon: Sun },
            { id: "inverters", label: "Smart Inverters", icon: Zap },
            { id: "backup", label: "Battery Backup", icon: Battery }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                  activeFilter === tab.id
                    ? "bg-[#16a34a] border-[#16a34a] text-white shadow-lg shadow-green-900/30"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Portfolio Dynamic Grid with stagger and image scroll effect */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
                key={project.id}
                className="bg-[#0c1b30] border border-slate-800/80 rounded-3xl overflow-hidden group hover:border-[#16a34a]/40 hover:shadow-xl hover:shadow-green-950/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Wrap with premium slow scaling */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                    <motion.img
                      initial={{ scale: 1.25, opacity: 0.85 }}
                      whileInView={{ scale: 1.0, opacity: 1 }}
                      viewport={{ once: false, amount: 0.1 }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.05 }}
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 pointer-events-none" />
                    
                    {/* Category Tag */}
                    <span className="absolute top-4 left-4 text-[9px] font-black uppercase text-green-400 bg-slate-950/90 border border-green-800/60 px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                      {project.categoryLabel}
                    </span>

                    {/* Quick-View Button Overlay */}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10"
                      aria-label={`View ${project.title} details`}
                    >
                      <div className="p-3 bg-[#16a34a] text-white rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Maximize2 className="h-5 w-5" />
                      </div>
                    </button>
                  </div>

                  {/* Information Card */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1">
                        {project.location}
                      </span>
                      <h3 className="font-extrabold text-white text-base sm:text-lg group-hover:text-green-400 transition-colors uppercase tracking-tight leading-snug">
                        {project.title}
                      </h3>
                    </div>

                    {/* Highlights overview */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                        <span className="font-extrabold text-slate-400 uppercase text-[10px] mr-1">Capacity:</span>
                        <span>{project.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                        <span className="font-extrabold text-slate-400 uppercase text-[10px] mr-1">System:</span>
                        <span className="truncate">{project.hardware}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full flex items-center justify-center gap-1.5 py-3 bg-slate-900 border border-slate-800 hover:border-[#16a34a]/50 text-xs font-black text-slate-200 hover:text-white uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Technical Breakdown</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic Lightbox Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-[#0c1b30] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-slate-950/80 hover:bg-[#16a34a] hover:text-white text-slate-300 border border-slate-800 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Left Side: High-res Image (6 cols) */}
                <div className="md:col-span-6 bg-slate-950 flex items-center justify-center relative min-h-[300px] md:min-h-[450px]">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                  
                  {/* Category label */}
                  <span className="absolute bottom-4 left-4 text-[10px] font-black uppercase text-green-400 bg-slate-950/90 border border-green-800/60 px-3 py-1.5 rounded-xl">
                    {selectedProject.categoryLabel}
                  </span>
                </div>

                {/* Right Side: Detailed Tech Specs (6 cols) */}
                <div className="md:col-span-6 p-6 md:p-8 space-y-6 text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-black text-[#16a34a] tracking-widest uppercase block mb-1">
                        {selectedProject.location}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight">
                        {selectedProject.title}
                      </h3>
                      <div className="w-12 h-1 bg-amber-500 mt-2.5 rounded"></div>
                    </div>

                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {selectedProject.description}
                    </p>

                    {/* Specifications List */}
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
                      <div className="grid grid-cols-3 gap-2 border-b border-slate-800/50 pb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Hardware</span>
                        <span className="text-[11px] font-bold text-slate-200 col-span-2">{selectedProject.hardware}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Specs</span>
                        <span className="text-[11px] font-bold text-green-400 col-span-2">{selectedProject.capacity}</span>
                      </div>
                    </div>

                    {/* Technical Highlights list */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Engineering Key Points:</h4>
                      <ul className="space-y-1.5">
                        {selectedProject.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-[#16a34a] shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Consultation WhatsApp Link */}
                  <div className="pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/27686765446?text=Hi%20Vula%20Lesedi!%20I%20saw%20your%20installation%20for%20${encodeURIComponent(selectedProject.title)}%20and%20would%20like%20to%20get%20a%20similar%20sizing%20consultation.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-green-600 text-white font-black py-3.5 px-4 rounded-xl transition-all duration-200 text-xs uppercase tracking-wider shadow-lg shadow-green-950/30"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Request Similar Setup</span>
                    </a>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="py-3.5 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-black text-slate-300 hover:text-white uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                    >
                      Close View
                    </button>
                  </div>

                </div>
              </div>

            </motion.div>
          </div>
        )}

      </div>
    </section>
  );
}
