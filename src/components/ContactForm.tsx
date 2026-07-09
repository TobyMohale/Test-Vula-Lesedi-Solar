import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "Pretoria",
    systemInterest: "Solar Power Systems",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const locationsInGauteng = [
    "Pretoria", "Centurion", "Midrand", "Sandton", 
    "Johannesburg", "Alberton", "Boksburg", "Roodepoort", 
    "Hammanskraal", "Other Gauteng Area"
  ];

  const systemTiers = [
    "Solar Power Systems",
    "Battery Backup Systems Only",
    "Inverter Installations & Upgrades",
    "Solar Geyser & Hot Water Solutions",
    "General Electrical or Automation Maintenance"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate client-side submission and trigger success UI
    setIsSubmitted(true);
  };

  const getWhatsAppSubmitLink = () => {
    const text = `Hi Vula Lesedi Power Solutions! I would like to request a FREE quotation:
- Name: ${formData.name}
- Phone: ${formData.phone}
- Email: ${formData.email}
- Area in Gauteng: ${formData.location}
- System of Interest: ${formData.systemInterest}
- Message: ${formData.message || "None provided"}`;

    return `https://wa.me/27686765446?text=${encodeURIComponent(text)}`;
  };

  const getEmailSubmitLink = () => {
    const subject = `Vula Lesedi Power Solutions Inquiry - ${formData.name}`;
    const body = `Hi Vula Lesedi!

I would like to request a FREE quotation for my property:
- Name: ${formData.name}
- Phone: ${formData.phone}
- Email: ${formData.email}
- Area in Gauteng: ${formData.location}
- System of Interest: ${formData.systemInterest}
- Message: ${formData.message || "None provided"}

Please contact me back as soon as possible.`;

    return `mailto:lesedisolarandbackup@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="py-20 bg-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-100 px-3 py-1.5 rounded-full inline-block mb-3 border border-green-200">
            Contact & Consultation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2240] tracking-tight uppercase leading-none">
            Get Your Free Quote Today
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded"></div>
          <p className="text-base text-slate-600 font-bold mt-4">
            Ready to secure your home or business against load shedding outages? Drop us a line or use our instant WhatsApp channels for a fast assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Direct Contact Info (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
            
            <div className="space-y-6 text-left">
              <h3 className="text-2xl font-extrabold text-[#0a2240] uppercase tracking-tight">
                Vula Lesedi Channels
              </h3>
              <p className="text-sm font-bold text-slate-500 leading-relaxed">
                Connect directly with our Pretoria service office or speak directly with our installations dispatcher.
              </p>

              <div className="space-y-4 pt-4">
                
                {/* 1. Phone */}
                <a 
                  href="tel:0686765446" 
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 hover:border-green-500/20 hover:shadow-md transition-all duration-200 group"
                  id="contact-phone-card"
                >
                  <div className="p-3 bg-green-100 text-[#16a34a] rounded-xl group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-black uppercase">Click to Call</span>
                    <span className="font-extrabold text-[#0a2240] text-base md:text-lg">068 676 5446</span>
                  </div>
                </a>

                {/* 2. WhatsApp */}
                <a 
                  href="https://wa.me/27686765446?text=Hi%20Vula%20Lesedi%20Power%20Solutions,%20I%20would%20like%20to%20get%20a%20free%20quote." 
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 hover:border-green-500/20 hover:shadow-md transition-all duration-200 group"
                  id="contact-whatsapp-card"
                >
                  <div className="p-3 bg-green-100 text-[#16a34a] rounded-xl group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-black uppercase">WhatsApp Thread</span>
                    <span className="font-extrabold text-[#16a34a] text-base md:text-lg">068 676 5446</span>
                  </div>
                </a>

                {/* 3. Email */}
                <a 
                  href="mailto:lesedisolarandbackup@gmail.com" 
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 hover:border-green-500/20 hover:shadow-md transition-all duration-200 group"
                  id="contact-email-card"
                >
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-[#0a2240] group-hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-black uppercase">Direct Email</span>
                    <span className="font-extrabold text-[#0a2240] text-sm md:text-base break-all">
                      lesedisolarandbackup@gmail.com
                    </span>
                  </div>
                </a>

                {/* 4. Address */}
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-black uppercase">Pretoria Headquarters</span>
                    <span className="font-extrabold text-slate-700 text-sm md:text-base">
                      369 West Street, 0182, Pretoria
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quality badge inside info column */}
            <div className="mt-8 border-t border-slate-200/60 pt-6 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 font-bold leading-relaxed text-left">
                All inquiries are answered within 2 to 4 working hours by a qualified assessor. Estimates and on-site sizing quotes are 100% free of charge.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Consultation Form (7 columns) */}
          <div className="lg:col-span-7 bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-center">
            
            {/* Success State */}
            {isSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-green-100 text-[#16a34a] rounded-full flex items-center justify-center mx-auto border border-green-200">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0a2240] uppercase">
                    Form Prepared Successfully!
                  </h3>
                  <p className="text-slate-600 text-sm font-bold mt-2.5 max-w-md mx-auto">
                    Your assessment request has been formatted. Choose one of our direct delivery systems below to instantly send it to the Vula Lesedi dispatcher.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5 max-w-md mx-auto pt-4">
                  <a
                    href={getWhatsAppSubmitLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold py-3.5 px-5 rounded-xl shadow-lg shadow-green-600/10 transition-all duration-200"
                    id="success-whatsapp-cta"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Send over WhatsApp</span>
                  </a>
                  <a
                    href={getEmailSubmitLink()}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0a2240] hover:bg-[#061426] text-white font-extrabold py-3.5 px-5 rounded-xl border border-slate-800 transition-all duration-200"
                    id="success-email-cta"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Send over Email</span>
                  </a>
                </div>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold underline transition-colors pt-4 block mx-auto"
                >
                  Edit My Information / Start Over
                </button>
              </div>
            ) : (
              /* Core Form */
              <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. Sipho Nkosi"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="e.g. 082 123 4567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="e.g. sipho@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>

                  {/* Location Dropdown */}
                  <div className="space-y-1.5">
                    <label htmlFor="location" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      Gauteng Location *
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold focus:outline-none focus:border-[#16a34a] cursor-pointer"
                    >
                      {locationsInGauteng.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* System Interest Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="systemInterest" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    Product Interest *
                  </label>
                  <select
                    id="systemInterest"
                    name="systemInterest"
                    value={formData.systemInterest}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold focus:outline-none focus:border-[#16a34a] cursor-pointer"
                  >
                    {systemTiers.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    Message / Special Requests
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="e.g. I need a quote to power a large double door fridge, my home Wi-Fi router, and standard ceiling lights."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold focus:outline-none focus:border-[#16a34a] resize-none"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full bg-[#0a2240] hover:bg-[#051121] text-white font-extrabold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 cursor-pointer text-sm uppercase tracking-wider mt-2"
                  id="contact-form-submit"
                >
                  <Send className="h-4 w-4" />
                  <span>Prepare Free Proposal Request</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
