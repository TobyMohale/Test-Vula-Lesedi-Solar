import { ServiceItem, BrandPartner, ServiceArea, FAQItem, Appliance } from "../types";

export const mainServices: ServiceItem[] = [
  {
    id: "solar-power",
    title: "Solar Power Systems",
    description: "Custom solar solutions designed around each customer's energy needs and budget. Clean, sustainable power for complete energy independence.",
    icon: "Sun",
    features: [
      "Custom system sizing and configuration",
      "Tier-1 photovoltaic solar panels",
      "Professional mounting structure installation",
      "Full integration with residential or commercial DB boards"
    ]
  },
  {
    id: "battery-backup",
    title: "Battery Backup Systems",
    description: "Reliable lithium battery backup solutions to protect your home or business during load shedding and unexpected power outages.",
    icon: "Battery",
    features: [
      "High-performance Lithium Iron Phosphate (LiFePO4) batteries",
      "Ultra-fast switchover during blackouts (<20ms)",
      "Long cycle-life (6000+ charges, 10+ years expectancy)",
      "Modular design for easy capacity upgrades"
    ]
  },
  {
    id: "inverters",
    title: "Inverter Installations",
    description: "Professional installation of smart hybrid inverters for seamless management of solar generation, battery storage, and grid utility power.",
    icon: "Cpu",
    features: [
      "Sunsynk, Deye, and Luxpower approved installations",
      "Smart power management and scheduling",
      "Mobile app monitoring for real-time yield tracking",
      "Dual MPPT optimization for maximum panel output"
    ]
  },
  {
    id: "hot-water",
    title: "Solar Geysers & Hot Water",
    description: "Energy-efficient solar geysers and backup water heating solutions to reduce up to 40% of your monthly electricity bill.",
    icon: "Flame",
    features: [
      "Solar geyser assessments, repairs, and retrofits",
      "High-efficiency solar collectors",
      "Smart geyser controllers and timers",
      "Substantial long-term electricity bill savings"
    ]
  },
  {
    id: "maintenance",
    title: "Maintenance & Repairs",
    description: "Comprehensive assessments, system inspections, panel cleaning, troubleshooting, and performance optimization for peak system health.",
    icon: "Wrench",
    features: [
      "Professional solar panel washing and cleaning",
      "Thermal inspection of wiring and connections",
      "Inverter firmware updates and system recalibration",
      "Detailed health report and optimization recommendations"
    ]
  }
];

export const secondaryServices: ServiceItem[] = [
  {
    id: "elec-install",
    title: "Electrical Installations",
    description: "Expert electrical wiring, power upgrades, and certified installations for residential and commercial properties.",
    icon: "Zap"
  },
  {
    id: "fault-finding",
    title: "Fault Finding & Diagnostics",
    description: "Advanced testing and troubleshooting to identify and resolve electrical faults, short circuits, and power trips.",
    icon: "Search"
  },
  {
    id: "wiring-rewiring",
    title: "Wiring & Rewiring",
    description: "Complete house rewiring and distribution board upgrades to ensure maximum safety and compliance.",
    icon: "Repeat"
  },
  {
    id: "gate-motors",
    title: "Gate Motor Services",
    description: "Professional installation, repair, and backup power integration for Centurion and ET gate motors.",
    icon: "Key"
  },
  {
    id: "electric-fence",
    title: "Electric Fences",
    description: "High-voltage perimeter security installations, energizer replacements, fault diagnostics, and battery backups.",
    icon: "ShieldAlert"
  },
  {
    id: "gen-maintenance",
    title: "General Maintenance",
    description: "Ongoing support, light fixture fittings, surge protection installation, and general care by experienced teams.",
    icon: "CheckSquare"
  }
];

export const brandPartners: BrandPartner[] = [
  {
    id: "canadian-solar",
    name: "Canadian Solar",
    description: "Premium Tier-1 photovoltaic panels with outstanding durability and peak performance during low-light hours.",
    type: "Solar Panels",
    logoUrl: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782726136/canadian-solar-logo_epxgv5.avif"
  },
  {
    id: "sunsynk",
    name: "Sunsynk",
    description: "Industry-favorite hybrid inverters with advanced smart load management and intuitive mobile-app tracking.",
    type: "Inverters",
    logoUrl: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782726137/sunsynk-logo_rfh6js.avif"
  },
  {
    id: "deye",
    name: "Deye",
    description: "Extremely robust hybrid inverters engineered for flexible battery integration and high-efficiency power flow.",
    type: "Inverters & Batteries",
    logoUrl: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782726136/deye-logo_udwqmb.avif"
  },
  {
    id: "ja-solar",
    name: "JA Solar",
    description: "High-yield monocrystalline modules backed by solid local output warranties and superior hot-climate tolerance.",
    type: "Solar Panels",
    logoUrl: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782726136/ja-solar-logo_ymlszm.avif"
  },
  {
    id: "dyness",
    name: "Dyness",
    description: "Intelligent lithium battery packs featuring modular rack-mountable designs for hassle-free upgrades.",
    type: "Lithium Batteries",
    logoUrl: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782726137/dyness-logo_vnc27o.avif"
  },
  {
    id: "growatt",
    name: "Growatt",
    description: "Cost-efficient hybrid configurations paired with highly functional remote-monitoring telemetry.",
    type: "Inverters & Storage",
    logoUrl: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782726136/ai-generated-IMAGE_xgpuqf.avif"
  },
  {
    id: "luxpower",
    name: "Luxpower",
    description: "Extremely reliable single and three-phase hybrid backup power solutions trusted by local engineers.",
    type: "Inverters",
    logoUrl: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782726136/ai-generated-IMAGE_5_spal5p.avif"
  },
  {
    id: "freedom-won",
    name: "Freedom Won",
    description: "South Africa's premier long-life high-capacity lithium iron phosphate (LiFePO4) energy systems.",
    type: "Premium Storage",
    logoUrl: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782726137/ai-generated-IMAGE_2_hrbher.avif"
  },
  {
    id: "shoto",
    name: "Shoto",
    description: "Commercial-grade lithium cell packs offering exceptional depth-of-discharge and high cycle reliability.",
    type: "Lithium Batteries",
    logoUrl: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782726137/ai-generated-IMAGE_3_yqlfoc.avif"
  },
  {
    id: "victron",
    name: "Victron Energy",
    description: "World-renowned smart blue-power chargers, controllers, and inverters for elite off-grid systems.",
    type: "Inverters & Chargers",
    logoUrl: "https://res.cloudinary.com/dagphoc0j/image/upload/v1782726137/ai-generated-IMAGE_4_sfhkop.avif"
  }
];

export const serviceAreas: ServiceArea[] = [
  { name: "Pretoria", active: true },
  { name: "Centurion", active: true },
  { name: "Midrand", active: true },
  { name: "Sandton", active: true },
  { name: "Johannesburg", active: true },
  { name: "Alberton", active: true },
  { name: "Boksburg", active: true },
  { name: "Roodepoort", active: true },
  { name: "Hammanskraal", active: true }
];

export const faqs: FAQItem[] = [
  {
    question: "How does load shedding protection work?",
    answer: "During load shedding, your battery backup system detects the power failure in less than 20 milliseconds and takes over automatically. Your essential appliances (Wi-Fi, lights, fridge, TV) continue to run seamlessly without rebooting."
  },
  {
    question: "What's the difference between battery backup and a full solar system?",
    answer: "A battery backup system consists of an inverter and batteries charged from Eskom grid power. It keeps you powered during outages but doesn't reduce your electricity bill. A full solar system adds solar panels to generate your own electricity, reducing your grid reliance and saving you substantial money monthly."
  },
  {
    question: "Do you supply and install quality brands?",
    answer: "Yes, we only supply top-tier hardware from industry-leading manufacturers, including Sunsynk, Deye, Canadian Solar, JA Solar, and LuxpowerTek. All products carry official manufacturer warranties (typically 5 to 10 years on inverters and batteries)."
  },
  {
    question: "How long does a typical installation take?",
    answer: "A standard residential inverter and battery backup system takes 1 day to install. A full solar installation (panels, inverter, and batteries) takes 1 to 2 days depending on the roof structure and scale of the system."
  },
  {
    question: "Do you provide a Certificate of Compliance (CoC)?",
    answer: "Absolutely! Electrical safety is our top priority. All our installations are supervised or executed by qualified electricians and come with an official electrical Certificate of Compliance (CoC) to protect your property and ensure insurance validity."
  }
];

export const appliances: Appliance[] = [
  { id: "router", name: "Wi-Fi Router & Fiber ONT", watts: 15, icon: "Wifi", category: "lighting", defaultCount: 1, defaultHours: 8 },
  { id: "lights", name: "LED Lights (per bulb)", watts: 10, icon: "Lightbulb", category: "lighting", defaultCount: 8, defaultHours: 5 },
  { id: "tv", name: "Smart TV & Soundbar", watts: 150, icon: "Tv", category: "entertainment", defaultCount: 1, defaultHours: 4 },
  { id: "laptop", name: "Laptops / Phones Charger", watts: 65, icon: "Laptop", category: "entertainment", defaultCount: 2, defaultHours: 6 },
  { id: "fridge", name: "Fridge & Freezer", watts: 120, icon: "IceCream", category: "appliances", defaultCount: 1, defaultHours: 24 },
  { id: "microwave", name: "Microwave Oven", watts: 1200, icon: "Flame", category: "appliances", defaultCount: 1, defaultHours: 0.5 },
  { id: "kettle", name: "Electric Kettle", watts: 2000, icon: "Coffee", category: "heavy", defaultCount: 1, defaultHours: 0.2 },
  { id: "borehole", name: "Borehole / Pool Pump", watts: 1100, icon: "Droplets", category: "heavy", defaultCount: 0, defaultHours: 2 },
  { id: "ac", name: "Air Conditioner (9000 BTU)", watts: 1000, icon: "Wind", category: "heavy", defaultCount: 0, defaultHours: 3 }
];
