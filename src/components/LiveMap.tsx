import React from "react";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

export default function LiveMap() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300" id="map">
      {/* Decorative background blur shapes */}
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-green-100/40 dark:bg-green-950/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-amber-50/40 dark:bg-amber-950/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-100 dark:bg-green-950/40 border border-green-200 dark:border-green-900 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-sm">
            Our Location
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2240] dark:text-white tracking-tight uppercase leading-none">
            Pretoria Headquarters
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded"></div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-bold mt-4 leading-relaxed">
            Visit our central office for in-person consultations, system design demonstrations, or to speak directly with our engineering team.
          </p>
        </div>

        {/* Live Interactive Google Map Frame */}
        <div className="relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-2 sm:p-3">
          {/* Real Interactive Map Iframe (Completely free, no API key required, works out-of-the-box!) */}
          <div className="w-full h-[480px] sm:h-[550px] rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-slate-950">
            <iframe
              title="Vula Lesedi Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3595.6416182390886!2d28.226725076307137!3d-25.747754677364654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9561de69fe248d%3A0xe67db07be9b251fc!2s369%20West%20St%2C%20Pretoria%20North%2C%20Pretoria%2C%200182!5e0!3m2!1sen!2sza!4v1719782400000!5m2!1sen!2sza"
              className="w-full h-full border-0 grayscale-[10%] contrast-[110%] dark:invert-[90%] dark:hue-rotate-[180deg]"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Quick Info bar overlays for map details at bottom of the panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            {/* Address */}
            <div className="flex items-center gap-3 p-2">
              <div className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[#16a34a] rounded-xl shadow-sm">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-black uppercase">Our HQ Address</span>
                <span className="text-xs font-extrabold text-[#0a2240] dark:text-white leading-tight block">
                  369 West Street, Pretoria North, 0182
                </span>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-center gap-3 p-2">
              <div className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[#16a34a] rounded-xl shadow-sm">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-black uppercase">Business Hours</span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 leading-tight block">
                  Mon - Sat: 08:00 AM - 05:00 PM
                </span>
              </div>
            </div>

            {/* Contact Action */}
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[#16a34a] rounded-xl shadow-sm">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-black uppercase">Inquiries Hotline</span>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 leading-tight block">
                    068 676 5446
                  </span>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=-25.7479,28.2293"
                target="_blank"
                rel="noreferrer"
                className="p-2 text-white bg-[#0a2240] dark:bg-slate-800 hover:bg-[#16a34a] rounded-xl shadow-md transition-colors"
                title="Open in Google Maps"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
