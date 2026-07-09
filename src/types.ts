export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features?: string[];
}

export interface BrandPartner {
  id: string;
  name: string;
  description: string;
  type: string;
  logoUrl?: string;
}

export interface ServiceArea {
  name: string;
  active: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Appliance {
  id: string;
  name: string;
  watts: number;
  icon: string;
  category: "lighting" | "entertainment" | "appliances" | "heavy";
  defaultCount: number;
  defaultHours: number;
}

export interface EstimationResult {
  dailyKwh: number;
  recommendedInverterKva: number;
  recommendedBatteryKwh: number;
  recommendedPanelsWatts: number;
  systemTier: string;
  approxPriceRange: string;
  systemDescription: string;
}
