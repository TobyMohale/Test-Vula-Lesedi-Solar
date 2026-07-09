import React, { useState } from "react";
import { 
  BookOpen, Calendar, Clock, User, ArrowRight, Search, 
  ChevronRight, ThumbsUp, MessageSquare, Share2, X, ChevronDown, CheckCircle2, Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: "Solar" | "Batteries" | "Savings" | "Gauteng Grid";
  categoryLabel: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  content: React.ReactNode;
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  const categories = [
    { id: "all", label: "All Articles" },
    { id: "Solar", label: "Solar Panels" },
    { id: "Batteries", label: "Battery Backup" },
    { id: "Savings", label: "Cost Savings" },
    { id: "Gauteng Grid", label: "Grid & Outages" }
  ];

  const articles: Article[] = [
    {
      id: "panel-efficiency-2026",
      title: "2026 Comparison: SunPower vs. Canadian Solar vs. JA Solar in South Africa",
      excerpt: "Complete guide to monocrystalline vs polycrystalline vs bifacial panel efficiency, real-world temperature coefficients, and choosing the right setup in Gauteng.",
      category: "Solar",
      categoryLabel: "Solar Panels",
      date: "February 28, 2026",
      readTime: "18 min read",
      author: "Vula Lesedi Engineering Team",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=80",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-medium">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h4 className="font-extrabold text-xs text-green-400 uppercase tracking-wider mb-2">Quick Answer: Which Solar Panel Efficiency Do You Need?</h4>
            <p className="text-xs text-slate-300">
              For most South African homes, monocrystalline panels with 20-21% efficiency offer the best balance of performance and value. High-efficiency panels (22-23%) are worth the premium only when roof space is severely limited. Polycrystalline panels (15-17%) are outdated for residential use in 2026.
            </p>
            <div className="mt-3 text-xs text-amber-400 font-bold">
              💡 Key insight: In South Africa’s hot climate, temperature coefficient matters as much as rated efficiency. A 21% panel with -0.29%/°C outperforms a 22% panel with -0.40%/°C in real-world conditions.
            </div>
          </div>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">Understanding Solar Panel Efficiency: What the Numbers Really Mean</h3>
          <p>
            Solar panel efficiency measures how much sunlight a panel converts into usable electricity. A 20% efficient panel converts 20% of incoming solar radiation into electrical power, while the remaining 80% becomes heat.
          </p>
          <p>
            In South Africa, understanding efficiency is critical because it directly impacts how many panels you need and whether your available roof space can accommodate your energy requirements during municipal load shedding and local grid failures.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">Efficiency Ranges by Technology (2026)</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li><strong>Monocrystalline:</strong> 20-23% (premium brands reach 22.8%)</li>
            <li><strong>Polycrystalline:</strong> 15-17% (rapidly declining market share)</li>
            <li><strong>Bifacial Monocrystalline:</strong> 20-22% front + 5-20% rear gain</li>
            <li><strong>PERC Technology:</strong> Adds 1-2% to base efficiency</li>
            <li><strong>Half-Cut Cells:</strong> Same efficiency, better performance in shade</li>
          </ul>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">Monocrystalline Solar Panels: Efficiency Range and Performance</h3>
          <p>
            Monocrystalline panels dominate the South African residential market in 2026, representing over 85% of new installations. Their efficiency advantage and superior performance in high temperatures make them the default choice for load shedding solutions.
          </p>

          <h4 className="text-xs font-black text-green-400 uppercase tracking-widest mt-4">Monocrystalline Efficiency Tiers</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Premium Tier</span>
              <p className="font-bold text-white text-xs">22-23% Efficiency</p>
              <p className="text-[11px] text-slate-400 mt-2">Best for: Limited roof space, maximum output requirements. Premium price bracket.</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black text-[#16a34a] uppercase tracking-wider block mb-1">Mid-Tier (Best Value)</span>
              <p className="font-bold text-white text-xs">20-21% Efficiency</p>
              <p className="text-[11px] text-slate-400 mt-2">Brands: Canadian Solar, JA Solar, Jinko. Perfect for residential Gauteng properties.</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Budget Tier</span>
              <p className="font-bold text-white text-xs">18-19% Efficiency</p>
              <p className="text-[11px] text-slate-400 mt-2">Requires extensive roof space, higher degradation over standard 25 years.</p>
            </div>
          </div>

          <p>
            For South African conditions, the mid-tier monocrystalline category offers the best value. A Canadian Solar HiKu6 panel at 20.5% efficiency delivers nearly identical real-world performance to premium panels when temperature losses are factored in, at a significantly reduced capital cost.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">Efficiency vs Real-World Performance in South African Climate</h3>
          <p>
            The efficiency rating on a solar panel datasheet is measured at Standard Test Conditions (STC): 25°C cell temperature. South African rooftops regularly exceed 65°C in summer, meaning real-world efficiency is always lower than the rated figure.
          </p>
          <p>
            A typical premium panel with a temperature coefficient of -0.29%/°C will maintain a higher real-world yield in Johannesburg than a budget panel with a temperature coefficient of -0.42%/°C, resulting in up to 360kWh of additional generation per year on a 5kW system.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">Our Technical Verdict for Gauteng Properties</h3>
          <p>
            Don't obsess purely over maximum theoretical efficiency. A well-designed system with quality 20-21% panels (such as Canadian Solar or JA Solar), proper northern orientation, and high-quality mounting will outperform an over-engineered layout. Focus on professional installation and clean battery backup integration first.
          </p>
        </div>
      )
    },
    {
      id: "how-to-save-electricity-sa",
      title: "How to Save Electricity Costs in South Africa with Solar Power",
      excerpt: "A practical guide to optimizing daily load schedules, upgrading to solar geysers, and maximizing return on investment under the rising Eskom tariff structures.",
      category: "Savings",
      categoryLabel: "Cost Savings",
      date: "February 23, 2026",
      readTime: "12 min read",
      author: "Johannesburg Technical Dispatch",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782728843/canadian-solar_krkiff.avif",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-medium">
          <p>
            With municipal electricity tariffs rising year after year across Pretoria and Johannesburg, securing self-generation isn't just about escaping load shedding—it is an essential long-term strategy to protect your business or household budget.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">1. Shift Your High-Load Cycles to Daylight Hours</h3>
          <p>
            The single most effective way to optimize your solar return on investment (ROI) is to change when you use high-draw appliances. Devices like washing machines, dishwashers, pool pumps, and tumble dryers should run sequentially between 10:00 and 14:00. This ensures you are utilizing direct solar generation from your roof panels, rather than pulling from your battery storage or paying expensive municipal peak rates.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">2. Upgrade to a Dedicated Solar Geyser</h3>
          <p>
            Standard electrical geysers account for up to 40% of a South African home's electricity bill. By retrofitting with a direct solar geyser or flat-plate collector system, you instantly remove this massive baseline load from your electrical switchboard. This allows a smaller, more affordable solar and battery backup configuration to handle the rest of your home's electronics safely.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">3. Configure Smart Battery Discharge Profiles</h3>
          <p>
            Using a modern hybrid inverter (like Sunsynk), you can program time-of-use discharge levels. For instance, you can set the battery to remain at 100% during high-risk load shedding blocks, but allow it to discharge to 40% during off-peak night periods, ensuring maximum self-sufficiency without risking empty storage during outages.
          </p>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h4 className="font-extrabold text-xs text-green-400 uppercase tracking-wider mb-2">⚡ The Bottom Line</h4>
            <p className="text-xs text-slate-300">
              A standard 5kW residential solar setup pays for itself within 4 to 6 years in Gauteng, depending on your current tariff bracket. Over 25 years, the savings amount to hundreds of thousands of Rands, while ensuring your family is entirely insulated from power outages.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "gauteng-local-installer",
      title: "Why Choosing a Certified Local Gauteng Solar Installer is Critical",
      excerpt: "The ultimate power move for your peace of mind. Why lightning surge standards, city registration, and rapid physical support matter for solar reliability.",
      category: "Gauteng Grid",
      categoryLabel: "Grid & Outages",
      date: "January 15, 2026",
      readTime: "10 min read",
      author: "Vula Lesedi Engineering Team",
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1000&q=80",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-medium">
          <p>
            Installing solar is a major property investment. While fly-by-night installers may offer cheap off-the-shelf equipment, choosing an uncertified team frequently leads to insurance rejections, electrical hazards, and components failing when you need them most.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">1. Electrical Certificate of Compliance (CoC)</h3>
          <p>
            In South Africa, any solar backup or generation installation must be signed off by a certified registered electrician with a Certificate of Compliance (CoC). This is a legal requirement. Without a valid CoC, your household insurance will refuse to pay out in the event of a fire, lightning surge damage, or electrical malfunction.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">2. Gauteng Lightning Protection Standards</h3>
          <p>
            The Highveld is famous for severe summer thunderstorms. Correctly grounded solar panel rails, high-quality surge protection devices (SPDs) inside the DC combiner boxes, and isolated earthing spikes are essential. Local certified engineers understand these environmental hazards and design robust safety mechanisms to protect your home.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">3. Rapid Physical Support & Warranty Crossovers</h3>
          <p>
            When an inverter experiences a firmware issue or a battery BMS trips, you need local specialists who can arrive on-site within hours. Vula Lesedi is physically situated in Gauteng, meaning our engineering dispatch team can support client properties across Pretoria, Johannesburg, and Midrand instantly without multi-day delays.
          </p>

          <div className="bg-green-950/40 border border-green-800/40 p-5 rounded-2xl flex items-start gap-3">
            <Award className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-1">Vula Lesedi Gold Standard</h4>
              <p className="text-xs text-slate-300">
                We issue comprehensive electrical Certificates of Compliance (CoC) with every residential installation, register the backup system with local municipal structures, and offer physical ongoing engineering maintenance.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "giant-batteries-trend",
      title: "The Future of Energy: Giant Batteries to Store Wind and Solar Power",
      excerpt: "Exploring the rise of heavy-duty commercial energy storage systems (BESS) and how decentralized battery banks are reshaping reliable power distribution.",
      category: "Batteries",
      categoryLabel: "Battery Backup",
      date: "February 28, 2026",
      readTime: "15 min read",
      author: "Vula Lesedi Commercial Unit",
      image: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782730986/images_ldn55c.jpg",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-medium">
          <p>
            As wind and solar generation capacity accelerates worldwide, the central engineering challenge has shifted from generation to storage. Large-scale Battery Energy Storage Systems (BESS) are now playing a pivotal role in stabilizing electrical grids and allowing major industrial commercial spaces to remain fully operational.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">Decentralized Power Stations</h3>
          <p>
            Rather than relying exclusively on massive centralized coal or gas fired stations, modern industrial districts are utilizing commercial battery containers. These systems charge during peak daylight solar generation periods and automatically inject power back into warehouse micro-grids during peak demand hours, minimizing energy expenses.
          </p>

          <h3 className="text-lg font-black text-white uppercase tracking-tight">Industrial Autonomy</h3>
          <p>
            For logistics hubs, printing warehouses, and manufacturing centers in Gauteng, a high-capacity lithium iron phosphate (LiFePO4) bank guarantees operational security. Our commercial units are equipped with smart multi-rack active balancing, automated air-conditioning cooling, and fused DC disconnects, ensuring reliable standby capacity.
          </p>
        </div>
      )
    }
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Animation configuration for list staggering
  const listContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const articleCardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 70, 
        damping: 15,
        mass: 1.1
      } 
    }
  };

  const wordsTransitionVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 18 
      } 
    }
  };

  return (
    <section className="py-24 bg-slate-50 text-slate-800 relative overflow-hidden" id="blog">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-green-100/40 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-slate-100/60 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with smooth unique transition */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-extrabold text-[#16a34a] uppercase tracking-widest bg-green-100 border border-green-200 px-3.5 py-1.5 rounded-full inline-block mb-4 shadow-sm">
            Solar Learning & News
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2240] tracking-tight uppercase leading-none">
            Expert Solar Guides & Insights
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded"></div>
          <p className="text-sm sm:text-base text-slate-600 font-bold mt-4 leading-relaxed">
            Boost your solar knowledge. Read local, professional advice on efficiency, battery storage, and cost-saving configurations optimized for South African climates.
          </p>
        </motion.div>

        {/* Filter Navigation & Search Input Bar with Smooth Fade-in */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-12"
        >
          
          {/* Categories list */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#0a2240] text-white shadow-md scale-102"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-[#0a2240] hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search solar guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/40 focus:border-[#16a34a] transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </motion.div>

        {/* Articles List Grid */}
        <AnimatePresence mode="wait">
          {filteredArticles.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8"
            >
              <p className="text-slate-500 font-bold text-sm">No articles match your search criteria. Please try another query.</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
                className="mt-4 px-4 py-2 bg-[#16a34a] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key={selectedCategory + searchTerm}
              variants={listContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredArticles.map((article) => (
                <motion.article 
                  key={article.id}
                  variants={articleCardVariants}
                  whileHover={{ y: -8, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                  className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 group flex flex-col justify-between"
                  id={`blog-article-${article.id}`}
                >
                  <div>
                    {/* Photo Wrap with professional scroll/zoom effect */}
                    <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-100">
                      <motion.img
                        initial={{ scale: 1.25, opacity: 0.85 }}
                        whileInView={{ scale: 1.0, opacity: 1 }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.05 }}
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute top-4 left-4 text-[9px] font-extrabold uppercase text-white bg-[#0a2240] px-2.5 py-1 rounded-full shadow-md z-10">
                        {article.categoryLabel}
                      </span>
                    </div>

                    {/* Words sections with staggered smooth transition */}
                    <div className="p-6 space-y-3">
                      <motion.div 
                        variants={wordsTransitionVariants}
                        className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase"
                      >
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#16a34a]" />
                          <span>{article.date}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-[#16a34a]" />
                          <span>{article.readTime}</span>
                        </span>
                      </motion.div>

                      <motion.h3 
                        variants={wordsTransitionVariants}
                        className="font-extrabold text-base sm:text-lg text-[#0a2240] group-hover:text-[#16a34a] transition-colors leading-snug uppercase tracking-tight line-clamp-2"
                      >
                        {article.title}
                      </motion.h3>

                      <motion.p 
                        variants={wordsTransitionVariants}
                        className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3"
                      >
                        {article.excerpt}
                      </motion.p>
                    </div>
                  </div>

                  {/* Footer action button */}
                  <div className="px-6 pb-6 pt-2">
                    <motion.button
                      variants={wordsTransitionVariants}
                      onClick={() => setReadingArticle(article)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-800 text-xs font-black text-slate-700 hover:text-white uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Read Article Detail Overlay Lightbox Modal */}
        {readingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-[#0c1b30] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 text-left">
              
              {/* Close Button */}
              <button
                onClick={() => setReadingArticle(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-slate-950/80 hover:bg-[#16a34a] hover:text-white text-slate-300 border border-slate-800 rounded-full transition-colors cursor-pointer"
                aria-label="Close article"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Cover Image Header */}
              <div className="relative h-60 sm:h-72 w-full bg-slate-900">
                <img
                  src={readingArticle.image}
                  alt={readingArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1b30] via-slate-950/30 to-transparent" />
                
                {/* Meta block on bottom left */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-black uppercase text-green-400 bg-slate-950/90 border border-green-800/60 px-2.5 py-1 rounded-full inline-block mb-3">
                    {readingArticle.categoryLabel}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                    {readingArticle.title}
                  </h3>
                </div>
              </div>

              {/* Inner content scroll area */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar border-b border-slate-800/50">
                
                {/* Author metadata panel */}
                <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-800/60 text-xs text-slate-400 uppercase font-bold">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <User className="h-4 w-4 text-green-400" />
                    <span>By {readingArticle.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-green-400" />
                    <span>{readingArticle.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-green-400" />
                    <span>{readingArticle.readTime}</span>
                  </span>
                </div>

                {/* Main Rendered HTML/React Nodes */}
                <div className="prose prose-invert max-w-none text-slate-300">
                  {readingArticle.content}
                </div>

              </div>

              {/* Bottom bar of modal */}
              <div className="p-6 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-bold">Share this learning resource:</span>
                  <div className="flex gap-1.5">
                    <button className="p-1.5 hover:text-[#16a34a] transition-colors" aria-label="Share on Facebook"><Share2 className="h-4 w-4" /></button>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <a
                    href="https://wa.me/27686765446?text=Hi%20Vula%20Lesedi%20Power%20Solutions!%20I%20read%20your%20article%20about%20your%20solar%20services%20and%20efficiency%20comparison%20and%20would%20like%20to%20consult."
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-green-600 text-white font-black py-3 px-5 rounded-xl transition-colors text-xs uppercase tracking-wider"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Consult on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setReadingArticle(null)}
                    className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-slate-700/50"
                  >
                    Close Article
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
