import React, { useState } from "react";
import { 
  CheckCircle2, Eye, Maximize2, X, Sun, Battery, Zap, Shield, HelpCircle, ArrowRight, Compass 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectItem {
  id: string;
  title: string;
  category: "residential" | "commercial" | "inverters" | "all";
  categoryLabel: string;
  image: string;
  capacity: string;
  location: string;
  hardware: string;
  description: string;
  features: string[];
}

export default function ProjectSection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const projects: ProjectItem[] = [
    {
      id: "gaby-sequeira-commissioning",
      title: "Premium 3-Phase Inverter Hub",
      category: "inverters",
      categoryLabel: "Inverter Hubs",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782730903/Gaby-Sequeira-3_brb7bh.webp",
      capacity: "16kW Dual-Sunsynk Parallel",
      location: "Pretoria East, Gauteng",
      hardware: "2x Sunsynk 8kW Hybrid Inverters + Shoto Storage Packs",
      description: "A flagship residential 3-phase hybrid configuration designed for uninterrupted high-draw operation. We optimized the load distribution on the local board, allowing air conditioning systems and water heating loops to operate seamlessly throughout municipal load shedding events.",
      features: [
        "Dynamic parallel inverter master-slave sync",
        "Active cooling fan clearance mounts",
        "Dual Class-1 fireproof DC isolate breakers"
      ]
    },
    {
      id: "commercial-three-phase",
      title: "Heavy-Duty Multi-Inverter Commercial Hub",
      category: "commercial",
      categoryLabel: "Commercial Backup",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782730985/images_4_mkfzvg.jpg",
      capacity: "50kW High-Demand Array",
      location: "Midrand Commercial Zone, Johannesburg",
      hardware: "Sunsynk Industrial Controllers & Rackmount Power Banks",
      description: "An advanced heavy-industry energy system commissioned inside a logistics warehouse. Tailored with strict commercial metal ducting and localized grid feed-in controls, ensuring zero productivity loss during regional substation failures.",
      features: [
        "Fully enclosed temperature-controlled safety lockers",
        "External master automatic transfer switch (ATS)",
        "SCADA and cloud-enabled telemetry integration"
      ]
    },
    {
      id: "neat-domestic-backup",
      title: "Compact Household Inverter Core",
      category: "residential",
      categoryLabel: "Residential Systems",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782730986/images_5_n6tpky.jpg",
      capacity: "5kW Continuous Standby",
      location: "Fourways, Sandton",
      hardware: "Sunsynk 5kW Intelligent Controller + Dyness LiFePO4 Module",
      description: "A clean, compact garage installation optimized for modern townhouses where space is a premium. The system occupies minimal footprint while securing a full load bypass structure for lightning-fast 10ms power handovers.",
      features: [
        "Wall-saving ultra-slim battery mount design",
        "Neat physical PVC trunking layout",
        "Integrated surge-safe DB sub-panel"
      ]
    },
    {
      id: "management-suite-centurion",
      title: "Integrated Solar Energy Command Suite",
      category: "inverters",
      categoryLabel: "Inverter Hubs",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782730986/images_ldn55c.jpg",
      capacity: "High Efficiency Controller",
      location: "Centurion Residential Estate",
      hardware: "Sunsynk Smart Inverter Controllers",
      description: "Close-up view of our technical precision layout during the final commissioning phase. This system leverages advanced time-of-use scheduling to avoid charging from expensive grid rates while guaranteeing backup energy for night hours.",
      features: [
        "Optimized cooling clearance parameters",
        "Dynamic time-of-use discharge rules",
        "Complete structural compliance labeling"
      ]
    },
    {
      id: "battery-expansion-complex",
      title: "Parallel Lithium High-Capacity Storage",
      category: "residential",
      categoryLabel: "Residential Systems",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782730986/images_6_a4akdx.jpg",
      capacity: "20.4kWh Domestic Power Reserve",
      location: "Randburg Residential Complex",
      hardware: "Sunsynk Hybrid Inverter + Multiple Stacked Battery Packs",
      description: "A high-capacity residential battery expansion engineered to support long-duration winter power outages. The stacked battery structure provides a robust power reserve with smart auto-balancing technology across all connected cells.",
      features: [
        "Parallel Stacked smart Battery Management System (BMS)",
        "Fused DC isolators per battery tier",
        "Complete structural fire-barrier mounting"
      ]
    },
    {
      id: "industrial-grade-core",
      title: "Industrial-Grade Power Inverter Core",
      category: "commercial",
      categoryLabel: "Commercial Backup",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782730986/images_7_hox9qm.jpg",
      capacity: "Commercial Heavy Power",
      location: "Kempton Park Commercial Warehouse",
      hardware: "High-Draw Inverter System & Automated Changeovers",
      description: "A close-up technical snapshot showcasing our signature clean wiring and professional component layout. This commercial system guarantees seamless standby capacity for cooling units, servers, and automated security arrays.",
      features: [
        "SABS approved industrial breakers and trunking",
        "Structured heavy copper wire terminals",
        "Double surge protection modules on AC output"
      ]
    },
    {
      id: "canadian-solar-waterkloof",
      title: "Canadian Solar Monocrystalline Array",
      category: "residential",
      categoryLabel: "Residential Systems",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782728843/canadian-solar_krkiff.avif",
      capacity: "12kW Peak Generation",
      location: "Waterkloof, Pretoria",
      hardware: "Canadian Solar PV Modules & Custom Aluminum Mounts",
      description: "A premium high-yield roof installation tailored to maximize winter solar capture angles. Features state-of-the-art Canadian Solar Tier-1 panels engineered to deliver superior degradation resistance and peak output in Highveld conditions.",
      features: [
        "Optimal 28-degree tilt angle integration",
        "Neat sub-roof DC conduit routing",
        "Class-A surge protection modules"
      ]
    },
    {
      id: "synsynk-neat-garage",
      title: "Sunsynk Smart Backup System",
      category: "residential",
      categoryLabel: "Residential Systems",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782728843/synsynk_project_2_qybavq.avif",
      capacity: "8kW Continuous Output",
      location: "Centurion, Pretoria",
      hardware: "Sunsynk 8kW Inverter + Modular Storage Packs",
      description: "An incredibly clean, garage wall-mounted hybrid installation. Designed with strict spatial organization, full physical trunking, a dual-pole AC bypass switch, and automated changeover mechanisms to ensure power remains uninterrupted.",
      features: [
        "Fully integrated distribution board bypass",
        "Neat metal trunking configuration",
        "Automated mobile-app Wi-Fi status linking"
      ]
    },
    {
      id: "sunsynk-smart-garsfontein",
      title: "Sunsynk Smart Inverter Core",
      category: "inverters",
      categoryLabel: "Inverter Hubs",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782728843/Synsync_Smart_Inverter_webp_1_uf481k.avif",
      capacity: "High Efficiency Controller",
      location: "Garsfontein, Pretoria East",
      hardware: "Sunsynk 5kW Intelligent Inverter",
      description: "A close-up view of our technical precision during the commissioning of a Sunsynk system. We optimize inverter cooling clearance, program dynamic battery charge profiles, and configure time-of-use scheduling.",
      features: [
        "Optimized cooling clearance parameters",
        "Dynamic time-of-use discharge rules",
        "Built-in lightning & earth-fault protection"
      ]
    },
    {
      id: "backup-cabinet-midrand",
      title: "High-Capacity Power Storage Bay",
      category: "commercial",
      categoryLabel: "Commercial Backup",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782728843/Backup_Power_Systems_project_1_dwyogt.avif",
      capacity: "30kWh Lithium Bank",
      location: "Midrand Commercial Park",
      hardware: "Dyness & Shoto Rackmount LiFePO4 Packs",
      description: "A robust high-capacity battery bank installation for a commercial office. This heavy-duty system is configured in an insulated rack enclosure with active temperature monitoring to ensure maximum lifespan and zero operations downtime.",
      features: [
        "Rack-mounted structured cabinet frame",
        "Smart Battery Management System (BMS)",
        "Fused DC isolators per battery module"
      ]
    },
    {
      id: "sunsynk-battery-bryanston",
      title: "Sunsynk & Lithium Compact Setup",
      category: "residential",
      categoryLabel: "Residential Systems",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782728842/Synsync_Smart_Inverter_jpkh4r.avif",
      capacity: "5.1kWh Backup Combo",
      location: "Sandton, Johannesburg",
      hardware: "Sunsynk Hybrid Inverter + Freedom Won Battery",
      description: "A space-saving domestic backup power station engineered for compact residential garages. Features an ultra-thin wall-mounted LiFePO4 battery paired with a smart hybrid inverter, supplying seamless emergency load coverage.",
      features: [
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
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden" id="projects">
      {/* Background radial effects */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#16a34a]/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with smooth slide up transition */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-extrabold text-green-400 uppercase tracking-widest bg-green-950/80 border border-green-800/60 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Our Installation Track Record
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
            Recently Commissioned Projects
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded"></div>
          <p className="text-sm sm:text-base text-slate-300 font-medium mt-4 leading-relaxed">
            A comprehensive look at our signature ultra-clean layouts across residential estates and commercial properties in Gauteng. Click on any project to explore full technical breakdowns.
          </p>
        </motion.div>

        {/* Categories Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {[
            { id: "all", label: "All Projects" },
            { id: "residential", label: "Residential Systems", icon: Sun },
            { id: "commercial", label: "Commercial Backup", icon: Shield },
            { id: "inverters", label: "Inverter Hubs", icon: Zap }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                  activeFilter === tab.id
                    ? "bg-[#16a34a] border-[#16a34a] text-white shadow-lg shadow-green-900/20"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid with responsive items and interactive scale hover */}
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
                className="bg-slate-950 border border-slate-800/80 rounded-3xl overflow-hidden group hover:border-[#16a34a]/40 hover:shadow-xl hover:shadow-green-950/10 transition-all duration-300 flex flex-col justify-between"
                id={`project-card-${project.id}`}
              >
                <div>
                  {/* Photo Header with premium zoom-on-scroll / hover logic */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    <motion.img
                      initial={{ scale: 1.15 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
                    
                    {/* Category Tag */}
                    <span className="absolute top-4 left-4 text-[9px] font-black uppercase text-green-400 bg-slate-950/90 border border-green-800/60 px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                      {project.categoryLabel}
                    </span>

                    {/* Overlaid Maximize Button */}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10"
                      aria-label={`View ${project.title} technical breakdown`}
                    >
                      <div className="p-3 bg-[#16a34a] text-white rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Maximize2 className="h-5 w-5" />
                      </div>
                    </button>
                  </div>

                  {/* Info block */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1">
                        {project.location}
                      </span>
                      <h3 className="font-extrabold text-white text-base sm:text-lg group-hover:text-green-400 transition-colors uppercase tracking-tight leading-snug line-clamp-1">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 font-semibold leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    <div className="space-y-1.5 pt-1 border-t border-slate-900">
                      <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                        <span className="font-extrabold text-slate-400 uppercase text-[9px] mr-1">System:</span>
                        <span className="truncate">{project.capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action trigger */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full flex items-center justify-center gap-1.5 py-3 bg-slate-900 border border-slate-800 hover:border-[#16a34a]/50 text-xs font-black text-slate-200 hover:text-white uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Technical Specifications</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic Details Lightbox Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8"
            >
              
              {/* Close Trigger */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-slate-950/80 hover:bg-[#16a34a] hover:text-white text-slate-300 border border-slate-800 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Left image column */}
                <div className="md:col-span-6 bg-slate-950 flex items-center justify-center relative min-h-[300px] md:min-h-[480px]">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-4 left-4 text-[10px] font-black uppercase text-green-400 bg-slate-950/90 border border-green-800/60 px-3 py-1.5 rounded-xl">
                    {selectedProject.categoryLabel}
                  </span>
                </div>

                {/* Right detailed specifications column */}
                <div className="md:col-span-6 p-6 md:p-8 space-y-6 text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-black text-green-400 tracking-widest uppercase block mb-1">
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

                    {/* Tech details */}
                    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
                      <div className="grid grid-cols-3 gap-2 border-b border-slate-800/50 pb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Hardware</span>
                        <span className="text-[11px] font-bold text-slate-200 col-span-2">{selectedProject.hardware}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Load Capacity</span>
                        <span className="text-[11px] font-bold text-green-400 col-span-2">{selectedProject.capacity}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Engineering Key Points:</h4>
                      <ul className="space-y-1.5">
                        {selectedProject.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-[#16a34a] shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Call-to-action bar */}
                  <div className="pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/27686765446?text=Hi%20Vula%20Lesedi!%20I%20saw%20your%20installation%20for%20${encodeURIComponent(selectedProject.title)}%20and%20would%20like%20to%20get%20a%20similar%20sizing%20consultation.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-green-600 text-white font-black py-3.5 px-4 rounded-xl transition-all duration-200 text-xs uppercase tracking-wider shadow-lg shadow-green-950/30"
                    >
                      <span>Inquire about similar setup</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="py-3.5 px-5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-black text-slate-300 hover:text-white uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
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
