import type { ProductData, UseCaseId, BusinessType, FitLevel, TransactionType } from '../data/types';

/**
 * Compute the best fit level for a product given multi-select goals + transaction type.
 * Returns 'not_eligible' first if the product doesn't work at all.
 * Otherwise returns the best fit across all selected goals.
 */
export function computeFit(
  product: ProductData,
  selectedGoals: UseCaseId[],
  selectedBusinessType: BusinessType,
  transactionType: TransactionType
): FitLevel {
  // Not available in this corridor
  if (!product.available) return 'not_eligible';

  // Business type eligibility
  if (!product.eligibleBusinessTypes.includes(selectedBusinessType)) return 'not_eligible';

  // Me-to-me: USDC GP and Offramp are partial (recipient = yourself, but crypto wallet still required)
  // Fiat GP is fine for me-to-me (your own bank account abroad)
  if (transactionType === 'me_to_me') {
    if (product.productId === 'usdc_payouts') return 'partial'; // need own crypto wallet
    if (product.productId === 'offramp') return 'partial'; // need to hold USDC
  }

  if (selectedGoals.length === 0) return 'partial';

  // Compute fit for each goal, return the best one
  const FIT_RANK: Record<FitLevel, number> = {
    best_fit: 4, partial: 3, not_recommended: 2, not_eligible: 1,
  };

  const fits = selectedGoals.map((goal) => fitForGoal(product, goal));
  const best = fits.reduce((a, b) => FIT_RANK[a] >= FIT_RANK[b] ? a : b, 'not_recommended' as FitLevel);
  return best;
}

function fitForGoal(product: ProductData, goal: UseCaseId): FitLevel {
  const { productId, corridorId } = product;
  const isHighVolatilityCorridor = ['argentina', 'nigeria'].includes(corridorId);

  switch (goal) {
    case 'lowest_cost':
      if (productId === 'usdc_payouts') return 'best_fit';
      if (productId === 'offramp') return 'partial';
      return 'not_recommended';

    case 'fastest_settlement':
      if (productId === 'usdc_payouts') return 'best_fit';
      if (productId === 'offramp') return 'partial';
      return 'not_recommended';

    case 'high_volatility':
      if (productId === 'usdc_payouts') return 'best_fit';
      if (productId === 'offramp') return isHighVolatilityCorridor ? 'best_fit' : 'partial';
      return isHighVolatilityCorridor ? 'not_recommended' : 'partial';

    case 'marketplace_gig':
      if (productId === 'fiat_payouts') return 'best_fit';
      return 'partial';

    case 'marketplace_sellers':
      if (productId === 'fiat_payouts') return 'best_fit';
      return 'partial';

    default:
      return 'partial';
  }
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export function getFiatGuidanceFee(monthlyVolume: number): { guidance: number; floor: number } {
  if (monthlyVolume >= 50_000_000) return { guidance: 0.75, floor: 0.50 };
  if (monthlyVolume >= 10_000_000) return { guidance: 1.00, floor: 0.67 };
  if (monthlyVolume >= 1_000_000)  return { guidance: 1.25, floor: 0.83 };
  return { guidance: 1.50, floor: 1.00 };
}
