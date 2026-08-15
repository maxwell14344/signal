export type SentimentTone = "positive" | "negative" | "mixed";

export interface SentimentQuote {
  quote: string;
  source: string;
  url: string;
  sentiment: SentimentTone;
}

export interface PricingPlan {
  name: string;
  price: string;
  billing: string;
  notes?: string;
}

export interface Pricing {
  model: string;
  startingPrice: string;
  plans: PricingPlan[];
}

export interface Tool {
  slug: string;
  name: string;
  logo: string;
  website: string;
  category: string;
  subcategories: string[];
  tagline: string;
  tldr: string[];
  pricing: Pricing;
  pros: string[];
  cons: string[];
  sentiment: SentimentQuote[];
  bestFor: string[];
  hotTake: string;
  trending: boolean;
  rating: number;
  dateAdded: string;
  lastUpdated: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
}
