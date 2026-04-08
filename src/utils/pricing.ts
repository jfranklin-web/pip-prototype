import type { ProductData, UseCaseId, BusinessType, FitLevel } from '../data/types';

/**
 * Compute fit level for a product given user selections.
 * Returns 'not_eligible' if the product doesn't work for this business type or isn't available.
 */
export function computeFit(
  product: ProductData,
  selectedUseCase: UseCaseId,
  selectedBusinessType: BusinessType
): FitLevel {
  // Not available
  if (!product.available) return 'not_eligible';

  // Business type eligibility
  if (!product.eligibleBusinessTypes.includes(selectedBusinessType)) return 'not_eligible';

  // Fit by use case and product characteristics
  const { productId, corridorId } = product;
  const isHighVolatilityCorridor = ['argentina', 'nigeria'].includes(corridorId);

  switch (selectedUseCase) {
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
      // Gig workers: Fiat GP is best (no crypto needed), others require crypto wallet
      if (productId === 'fiat_payouts') return 'best_fit';
      if (productId === 'offramp') return 'partial'; // no crypto wallet for recipient
      return 'partial'; // USDC requires crypto wallet -- partial, not best

    case 'marketplace_sellers':
      // Connect platform can only use Fiat GP
      if (selectedBusinessType === 'connect_platform') {
        return productId === 'fiat_payouts' ? 'best_fit' : 'not_eligible';
      }
      // Direct: all three work, Fiat is most established
      if (productId === 'fiat_payouts') return 'best_fit';
      if (productId === 'offramp') return 'partial';
      return 'partial';

    default:
      return 'partial';
  }
}

/**
 * Format a dollar amount for display.
 */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Get the Fiat GP discount guidance fee for a given monthly volume.
 */
export function getFiatGuidanceFee(monthlyVolume: number): { guidance: number; floor: number } {
  if (monthlyVolume >= 50_000_000) return { guidance: 0.75, floor: 0.50 };
  if (monthlyVolume >= 10_000_000) return { guidance: 1.00, floor: 0.67 };
  if (monthlyVolume >= 1_000_000)  return { guidance: 1.25, floor: 0.83 };
  return { guidance: 1.50, floor: 1.00 };
}
