import React, { useState } from "react";
import { faqs } from "../data/solarData";
import { Plus, Minus, HelpCircle, BadgeHelp } from "lucide-react";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden" id="faqs">
      {/* Visual ornaments */}
      <div className="absolute top-1/3 -right-24 w-72 h-72 bg-green-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-72 h-72 bg-[#0a2240]/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-100 px-3 py-1.5 rounded-full inline-block mb-3 border border-green-200">
            Common Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2240] tracking-tight uppercase leading-none">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded"></div>
          <p className="text-base text-slate-600 font-bold mt-4">
            Have questions about system sizing, brand warranties, or load shedding backup switches? Find quick answers here.
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index} 
                className={`bg-white rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? "border-[#16a34a]/30 shadow-md" 
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {/* FAQ Header Tab */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-1.5 rounded-lg border shrink-0 ${
                      isOpen 
                        ? "bg-green-50 text-[#16a34a] border-green-100" 
                        : "bg-slate-50 text-slate-500 border-slate-100"
                    }`}>
                      <HelpCircle className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-extrabold text-[#0a2240] text-sm md:text-base tracking-tight pr-4">
                      {faq.question}
                    </span>
                  </div>

                  <div className={`p-1.5 rounded-full border ${
                    isOpen 
                      ? "bg-[#16a34a] text-white border-green-600" 
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                {/* FAQ Expandable Content */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-64 border-t border-slate-100" : "max-h-0"
                  }`}
                >
                  <div className="p-5 md:p-6 bg-slate-50/45 text-xs md:text-sm font-semibold text-slate-600 leading-relaxed text-left">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ footer reassurance */}
        <div className="mt-12 text-center bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs text-slate-500 font-bold">
            Still have a question that isn't answered here?
          </p>
          <a
            href="#contact"
            className="text-xs font-black text-[#16a34a] hover:text-[#0a2240] uppercase tracking-wider mt-2.5 inline-block"
          >
            Ask Our Installations Team Directly &rarr;
          </a>
        </div>

      </div>
    </section>
  );
}
