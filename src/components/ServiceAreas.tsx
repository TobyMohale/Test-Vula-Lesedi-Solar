import React from "react";
import { serviceAreas } from "../data/solarData";
import { MapPin, ShieldCheck, Flame, Phone, CheckCircle2 } from "lucide-react";

export default function ServiceAreas() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden" id="areas">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#051121] via-slate-900 to-green-950/20 pointer-events-none" />
      <div className="absolute top-1/4 -right-12 w-80 h-80 bg-green-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-12 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: List of Areas and Local Slogans */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-extrabold text-green-400 uppercase tracking-widest bg-green-950/80 px-3.5 py-1.5 rounded-full inline-block border border-green-800/60">
              Gauteng Service Coverage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
              PROUDLY SERVING GAUTENG ONLY
            </h2>
            <p className="text-base text-slate-300 font-bold leading-relaxed">
              We focus our solar and backup installations strictly within the Gauteng province. This allows us to guarantee rapid response times, highly personalized on-site consultations, and reliable emergency maintenance support.
            </p>

            {/* Visual list of served municipalities */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {serviceAreas.map((area, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2.5 bg-slate-800/50 p-3 rounded-xl border border-slate-800 hover:border-green-500/20 hover:bg-slate-800 transition-all duration-200"
                >
                  <MapPin className="h-4 w-4 text-green-400 shrink-0" />
                  <span className="font-extrabold text-slate-200 text-sm">
                    {area.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Local Advantages Boxes */}
            <div className="space-y-3.5 pt-4">
              <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white uppercase">
                    Rapid 24-Hour Dispatch
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Being local means our site assessment assessors and installation vans can reach your property in Pretoria, Midrand, or Joburg within 24 hours of inquiry.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white uppercase">
                    Local Grid Alignment
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    We understand the exact loadshedding schedules and municipal substation patterns of City of Tshwane, City of Joburg, and Ekurhuleni to size systems that cycle perfectly.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Custom SVG Powered Map of Gauteng */}
          <div className="lg:col-span-6 flex justify-center">
            
            <div className="relative bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full overflow-hidden text-center">
              
              <div className="absolute top-4 right-4 bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                ● Live Service Area
              </div>

              <span className="text-[10px] font-extrabold text-green-400 uppercase tracking-widest block mb-1">
                Visual Footprint
              </span>
              <h3 className="text-base font-extrabold text-slate-300 uppercase mb-6">
                Active Installation Nodes
              </h3>

              {/* Gauteng province shape recreated in clean SVG */}
              <div className="relative h-64 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center justify-center p-4">
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  className="h-full w-full opacity-35 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                >
                  {/* Styled outline representation of Gauteng boundary */}
                  <path
                    d="M 25,12 C 40,8, 65,10, 80,18 C 90,25, 92,42, 85,55 C 80,68, 70,88, 55,92 C 40,95, 20,82, 12,65 C 8,50, 10,25, 25,12 Z"
                    fill="url(#mapGrad)"
                    stroke="#15803d"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <defs>
                    <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Overlaid Glowing Interactive Nodes representing Pretoria, Centurion, Midrand, Joburg, etc. */}
                {/* 1. Pretoria (North) */}
                <div className="absolute top-[20%] left-[45%] flex flex-col items-center group cursor-pointer">
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-slate-950 shadow-lg shadow-green-500/50 animate-ping absolute" />
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-slate-950 shadow-lg relative z-10" />
                  <span className="bg-slate-950/80 border border-slate-800 text-[10px] font-extrabold text-white px-1.5 py-0.5 rounded mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    Pretoria
                  </span>
                </div>

                {/* 2. Hammanskraal (Far North) */}
                <div className="absolute top-[8%] left-[42%] flex flex-col items-center group cursor-pointer">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-slate-950 shadow-lg relative z-10" />
                  <span className="bg-slate-950/80 border border-slate-800 text-[9px] font-bold text-slate-300 px-1.5 py-0.5 rounded mt-1">
                    Hammanskraal
                  </span>
                </div>

                {/* 3. Centurion (Between Pretoria & Joburg) */}
                <div className="absolute top-[34%] left-[44%] flex flex-col items-center group cursor-pointer">
                  <span className="w-3 h-3 rounded-full bg-green-500 border border-slate-950 shadow-lg relative z-10" />
                  <span className="bg-slate-950/80 border border-slate-800 text-[10px] font-extrabold text-white px-1.5 py-0.5 rounded mt-1">
                    Centurion
                  </span>
                </div>

                {/* 4. Midrand */}
                <div className="absolute top-[46%] left-[48%] flex flex-col items-center group cursor-pointer">
                  <span className="w-3 h-3 rounded-full bg-green-400 border border-slate-950 shadow-lg relative z-10" />
                  <span className="bg-slate-950/80 border border-slate-800 text-[10px] font-extrabold text-white px-1.5 py-0.5 rounded mt-1">
                    Midrand
                  </span>
                </div>

                {/* 5. Sandton */}
                <div className="absolute top-[56%] left-[52%] flex flex-col items-center group cursor-pointer">
                  <span className="w-3 h-3 rounded-full bg-green-500 border border-slate-950 shadow-lg relative z-10 animate-pulse" />
                  <span className="bg-slate-950/80 border border-slate-800 text-[10px] font-extrabold text-white px-1.5 py-0.5 rounded mt-1">
                    Sandton
                  </span>
                </div>

                {/* 6. Johannesburg (Central/South) */}
                <div className="absolute top-[68%] left-[48%] flex flex-col items-center group cursor-pointer">
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-slate-950 shadow-lg shadow-green-500/50 animate-ping absolute" />
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-slate-950 shadow-lg relative z-10" />
                  <span className="bg-slate-950/80 border border-slate-800 text-[10px] font-extrabold text-white px-1.5 py-0.5 rounded mt-1">
                    Johannesburg
                  </span>
                </div>

                {/* 7. Alberton (East Rand/South) */}
                <div className="absolute top-[78%] left-[58%] flex flex-col items-center group cursor-pointer">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-slate-950 shadow-lg relative z-10" />
                  <span className="bg-slate-950/80 border border-slate-800 text-[9px] font-bold text-slate-300 px-1.5 py-0.5 rounded mt-1">
                    Alberton
                  </span>
                </div>

                {/* 8. Boksburg (East) */}
                <div className="absolute top-[66%] left-[70%] flex flex-col items-center group cursor-pointer">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-slate-950 shadow-lg relative z-10" />
                  <span className="bg-slate-950/80 border border-slate-800 text-[9px] font-bold text-slate-300 px-1.5 py-0.5 rounded mt-1">
                    Boksburg
                  </span>
                </div>

                {/* 9. Roodepoort (West Rand) */}
                <div className="absolute top-[62%] left-[24%] flex flex-col items-center group cursor-pointer">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-slate-950 shadow-lg relative z-10" />
                  <span className="bg-slate-950/80 border border-slate-800 text-[9px] font-bold text-slate-300 px-1.5 py-0.5 rounded mt-1">
                    Roodepoort
                  </span>
                </div>

              </div>

              {/* Quick Contact CTA */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-left">
                <div>
                  <span className="text-[10px] text-slate-500 block font-black uppercase">Service Hub</span>
                  <p className="text-xs font-bold text-slate-300 mt-0.5">369 West Street, Pretoria</p>
                </div>
                <a
                  href="tel:0686765446"
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-extrabold px-3.5 py-2 rounded-xl transition-all duration-200 text-xs uppercase tracking-wide"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call Us</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
