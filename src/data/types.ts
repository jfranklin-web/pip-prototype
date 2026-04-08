export type ProductId = 'fiat_payouts' | 'usdc_payouts' | 'offramp';
export type BusinessType = 'direct_us' | 'direct_uk' | 'connect_platform';
export type UseCaseId =
  | 'lowest_cost'
  | 'fastest_settlement'
  | 'high_volatility'
  | 'marketplace_gig'
  | 'marketplace_sellers';
export type FitLevel = 'best_fit' | 'partial' | 'not_recommended' | 'not_eligible';
export type AvailabilityStatus = 'live' | 'q2_2026' | 'q3_2026';

export interface Corridor {
  id: string;
  name: string;
  flag: string;
  currency: string;
  region: string;
}

export interface UseCase {
  id: UseCaseId;
  label: string;
  description: string;
  icon: string;
}

export interface FeeBreakdownItem {
  label: string;
  amount: string;
}

export interface ProductData {
  corridorId: string;
  productId: ProductId;
  // Availability
  available: boolean;
  availabilityStatus: AvailabilityStatus;
  availabilityNote?: string;
  // Pricing per $100 payout, US sender
  stripeCost: number;           // Stripe infra cost in $
  stickerPrice: number;         // All-in sticker price in $
  // Characteristics
  settlementTime: string;
  available24x7: boolean;
  eligibleBusinessTypes: BusinessType[];
  // Fee breakdown shown on card
  feeBreakdown: FeeBreakdownItem[];
  // Trade-offs shown when expanded
  pros: string[];
  cons: string[];
  recipientRequirements: string[];
  // Volatility note (shown for ARS/NGN corridors)
  volatilityNote?: string;
}

// Discounting guidance per product for Deal Composer
export interface DiscountGuidance {
  productId: ProductId;
  // For Fiat GP: per-payout fee guidance tiers
  fiatGuidanceTiers?: { monthlyVolumeMin: number; guidance: number; floor: number }[];
  // For USDC GP / Offramp: bps guidance
  bpsGuidance?: number;
  bpsFloor?: number;
  note?: string;
}
