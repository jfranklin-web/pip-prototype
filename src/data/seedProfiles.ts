import type { BusinessType, UseCaseId, TransactionType } from './types';

export interface SeedProfile {
  matchTerms: string[];       // case-insensitive substrings
  customerName: string;
  tagline: string;            // shown in the suggestion banner
  transactionType: TransactionType;
  selectedGoals: UseCaseId[];
  businessType: BusinessType;
  monthlyVolume: number;
  avgPayoutAmount: number;
  corridors: string[];
}

export const SEED_PROFILES: SeedProfile[] = [
  {
    matchTerms: ['meta', 'facebook', 'instagram'],
    customerName: 'Meta',
    tagline: 'Global creator payouts via Facebook and Instagram monetization programs',
    transactionType: 'me_to_others',
    selectedGoals: ['marketplace_sellers', 'fastest_settlement'],
    businessType: 'connect_platform',
    monthlyVolume: 50_000_000,
    avgPayoutAmount: 350,
    corridors: ['india', 'philippines', 'mexico'],
  },
  {
    matchTerms: ['uber', 'lyft'],
    customerName: 'Uber',
    tagline: 'Daily driver earnings payouts across LATAM and APAC markets',
    transactionType: 'me_to_others',
    selectedGoals: ['marketplace_gig', 'fastest_settlement', 'lowest_cost'],
    businessType: 'direct_us',
    monthlyVolume: 20_000_000,
    avgPayoutAmount: 120,
    corridors: ['india', 'mexico', 'nigeria'],
  },
  {
    matchTerms: ['airbnb'],
    customerName: 'Airbnb',
    tagline: 'Host payouts for short-term rental earnings in key markets',
    transactionType: 'me_to_others',
    selectedGoals: ['marketplace_sellers', 'lowest_cost'],
    businessType: 'connect_platform',
    monthlyVolume: 30_000_000,
    avgPayoutAmount: 900,
    corridors: ['philippines', 'mexico', 'argentina'],
  },
  {
    matchTerms: ['anthropic', 'openai', 'scale ai', 'scale'],
    customerName: 'Scale AI',
    tagline: 'Contractor and annotator payouts for AI training data programs',
    transactionType: 'me_to_others',
    selectedGoals: ['marketplace_gig', 'fastest_settlement', 'high_volatility'],
    businessType: 'direct_us',
    monthlyVolume: 3_000_000,
    avgPayoutAmount: 200,
    corridors: ['india', 'philippines', 'nigeria'],
  },
  {
    matchTerms: ['coinbase', 'crypto', 'binance'],
    customerName: 'Coinbase',
    tagline: 'Stablecoin and crypto user payouts to local bank accounts globally',
    transactionType: 'me_to_others',
    selectedGoals: ['lowest_cost', 'fastest_settlement', 'high_volatility'],
    businessType: 'direct_us',
    monthlyVolume: 10_000_000,
    avgPayoutAmount: 250,
    corridors: ['nigeria', 'argentina', 'philippines'],
  },
  {
    matchTerms: ['spotify', 'apple music', 'soundcloud', 'tidal'],
    customerName: 'Spotify',
    tagline: 'Artist and label royalty disbursements across emerging markets',
    transactionType: 'me_to_others',
    selectedGoals: ['marketplace_sellers', 'lowest_cost'],
    businessType: 'direct_us',
    monthlyVolume: 5_000_000,
    avgPayoutAmount: 45,
    corridors: ['india', 'mexico', 'philippines'],
  },
  {
    matchTerms: ['amazon', 'shopify', 'ebay', 'etsy'],
    customerName: 'Amazon',
    tagline: 'Third-party seller disbursements from marketplace earnings',
    transactionType: 'me_to_others',
    selectedGoals: ['marketplace_sellers', 'lowest_cost', 'fastest_settlement'],
    businessType: 'connect_platform',
    monthlyVolume: 100_000_000,
    avgPayoutAmount: 1200,
    corridors: ['india', 'mexico', 'philippines'],
  },
  {
    matchTerms: ['stripe', 'treasury'],
    customerName: 'Stripe Treasury',
    tagline: 'Internal fund repatriation across regional operating entities',
    transactionType: 'me_to_me',
    selectedGoals: ['lowest_cost', 'fastest_settlement'],
    businessType: 'direct_us',
    monthlyVolume: 25_000_000,
    avgPayoutAmount: 50_000,
    corridors: ['india', 'mexico', 'nigeria'],
  },
];

export function findSeedProfile(name: string): SeedProfile | null {
  if (!name || name.trim().length < 2) return null;
  const lower = name.toLowerCase().trim();
  return SEED_PROFILES.find((s) =>
    s.matchTerms.some((term) => lower.includes(term))
  ) ?? null;
}
