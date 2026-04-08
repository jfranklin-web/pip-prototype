import { useState } from 'react';
import type { ProductId } from '../../data/types';
import type { CustomerProfile, CorridorDeal } from './ComposerExperience';
import { CORRIDORS, PRODUCTS } from '../../data/mockData';
import { getFiatGuidanceFee } from '../../utils/pricing';
import { MarginMeter } from '../../components/MarginMeter';
import styles from './CorridorProductStep.module.css';

const PRODUCT_NAMES: Record<ProductId, string> = {
  fiat_payouts: 'Fiat Global Payouts',
  usdc_payouts: 'USDC Global Payouts',
  offramp: 'Offramp',
};

const PRODUCT_COLORS: Record<ProductId, string> = {
  fiat_payouts: '#635bff',
  usdc_payouts: '#10b981',
  offramp: '#f59e0b',
};

interface Props {
  customer: CustomerProfile;
  corridorDeals: CorridorDeal[];
  onAdd: (deal: CorridorDeal) => void;
  onUpdate: (corridorId: string, patch: Partial<CorridorDeal>) => void;
  onRemove: (corridorId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

function getDefaultProduct(_corridorId: string, businessType: string): ProductId {
  if (businessType === 'connect_platform') return 'fiat_payouts';
  return 'fiat_payouts'; // default recommendation
}

function getStickerAndFloor(corridorId: string, productId: ProductId, monthlyVolume: number): { sticker: number; floor: number; stripeCost: number } {
  const product = PRODUCTS.find((p) => p.corridorId === corridorId && p.productId === productId);
  if (!product || !product.available) return { sticker: 0, floor: 0, stripeCost: 0 };

  if (productId === 'fiat_payouts') {
    const { floor } = getFiatGuidanceFee(monthlyVolume);
    // sticker includes XB and FX; guidance is just the base fee adjustment
    const xbAndFx = product.stickerPrice - 1.50;
    return {
      sticker: product.stickerPrice,
      floor: floor + xbAndFx,
      stripeCost: product.stripeCost,
    };
  }
  if (productId === 'usdc_payouts') {
    // Routing fee 0.50% = $0.50 on $100; floor ~25bps = $0.25 on $100 + flat $0.50
    return { sticker: product.stickerPrice, floor: 0.75, stripeCost: product.stripeCost };
  }
  // Offramp
  return { sticker: product.stickerPrice, floor: 0.80, stripeCost: product.stripeCost };
}

export function CorridorProductStep({ customer, corridorDeals, onAdd, onUpdate, onRemove, onBack, onNext }: Props) {
  const [addingCorridor, setAddingCorridor] = useState<string>('');

  const usedCorridorIds = corridorDeals.map((d) => d.corridorId);
  const availableCorridors = CORRIDORS.filter((c) => !usedCorridorIds.includes(c.id));

  function handleAddCorridor() {
    if (!addingCorridor) return;
    const defaultProduct = getDefaultProduct(addingCorridor, customer.businessType);
    const { sticker } = getStickerAndFloor(addingCorridor, defaultProduct, customer.monthlyVolume);
    onAdd({
      corridorId: addingCorridor,
      productId: defaultProduct,
      customPrice: sticker,
      discountNote: '',
    });
    setAddingCorridor('');
  }

  function getAvailableProducts(corridorId: string): ProductId[] {
    const productIds: ProductId[] = ['fiat_payouts', 'usdc_payouts', 'offramp'];
    return productIds.filter((pid) => {
      const product = PRODUCTS.find((p) => p.corridorId === corridorId && p.productId === pid);
      if (!product || !product.available) return false;
      if (customer.businessType === 'connect_platform' && pid !== 'fiat_payouts') return false;
      return true;
    });
  }

  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>Corridors and pricing</h1>
        <p className={styles.stepSubtitle}>
          Add corridors, select a product per corridor, and set your custom price.
          The margin meter shows your room vs. sticker and floor.
        </p>
      </div>

      {/* Existing corridor deals */}
      {corridorDeals.length > 0 && (
        <div className={styles.dealRows}>
          {corridorDeals.map((deal) => {
            const corridor = CORRIDORS.find((c) => c.id === deal.corridorId);
            if (!corridor) return null;
            const availableProducts = getAvailableProducts(deal.corridorId);
            const { sticker, floor, stripeCost } = getStickerAndFloor(deal.corridorId, deal.productId, customer.monthlyVolume);
            const isBelowGuidance = deal.customPrice < sticker;
            const isBelowFloor = deal.customPrice < floor;

            return (
              <div key={deal.corridorId} className={styles.dealRow}>
                <div className={styles.dealRowHeader}>
                  <span className={styles.corridorFlag}>{corridor.flag}</span>
                  <div>
                    <span className={styles.corridorName}>{corridor.name}</span>
                    <span className={styles.corridorCurrency}>{corridor.currency}</span>
                  </div>
                  <button className={styles.removeBtn} onClick={() => onRemove(deal.corridorId)} aria-label="Remove">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Product selector */}
                <div className={styles.productSelector}>
                  {availableProducts.map((pid) => (
                    <button
                      key={pid}
                      className={`${styles.productBtn} ${deal.productId === pid ? styles.productBtnSelected : ''}`}
                      style={deal.productId === pid ? { borderColor: PRODUCT_COLORS[pid] } : {}}
                      onClick={() => {
                        const { sticker: newSticker } = getStickerAndFloor(deal.corridorId, pid, customer.monthlyVolume);
                        onUpdate(deal.corridorId, { productId: pid, customPrice: newSticker });
                      }}
                    >
                      <span className={styles.productDot} style={{ background: PRODUCT_COLORS[pid] }} />
                      {PRODUCT_NAMES[pid]}
                    </button>
                  ))}
                </div>

                {/* Pricing control */}
                <div className={styles.pricingRow}>
                  <div className={styles.priceControl}>
                    <label className={styles.priceLabel}>
                      Custom price (per $100)
                    </label>
                    <div className={styles.priceInputRow}>
                      <span className={styles.priceDollar}>$</span>
                      <input
                        className={styles.priceInput}
                        type="number"
                        min={0}
                        step={0.05}
                        value={deal.customPrice}
                        onChange={(e) => onUpdate(deal.corridorId, { customPrice: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className={styles.priceMeta}>
                      <span>List: <strong>${sticker.toFixed(2)}</strong></span>
                      <span>Floor: <strong>${floor.toFixed(2)}</strong></span>
                      <span className={styles.infraCost}>Infra cost: ~${stripeCost.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className={styles.meterWrapper}>
                    <MarginMeter
                      stripeCost={stripeCost}
                      customPrice={deal.customPrice}
                      stickerPrice={sticker}
                      floor={floor}
                    />
                  </div>
                </div>

                {/* Discount note */}
                {(isBelowGuidance || isBelowFloor) && (
                  <div className={styles.discountNoteSection}>
                    <label className={styles.discountNoteLabel}>
                      {isBelowFloor
                        ? 'Price is below floor — required: business justification'
                        : 'Price is below list — optional: reason for discount'}
                    </label>
                    <input
                      className={`${styles.discountNoteInput} ${isBelowFloor && !deal.discountNote ? styles.noteRequired : ''}`}
                      type="text"
                      placeholder={isBelowFloor ? 'Required: enter business justification' : 'e.g., competitive pressure, strategic account'}
                      value={deal.discountNote}
                      onChange={(e) => onUpdate(deal.corridorId, { discountNote: e.target.value })}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add corridor */}
      {availableCorridors.length > 0 && (
        <div className={styles.addCorridorRow}>
          <select
            className={styles.corridorSelect}
            value={addingCorridor}
            onChange={(e) => setAddingCorridor(e.target.value)}
          >
            <option value="">Select corridor to add...</option>
            {availableCorridors.map((c) => (
              <option key={c.id} value={c.id}>{c.flag} {c.name} ({c.currency})</option>
            ))}
          </select>
          <button
            className={styles.addBtn}
            onClick={handleAddCorridor}
            disabled={!addingCorridor}
          >
            + Add corridor
          </button>
        </div>
      )}

      {corridorDeals.length === 0 && (
        <div className={styles.emptyState}>Add at least one corridor to build a deal.</div>
      )}

      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M7 3L3 7l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <button
          className={styles.nextBtn}
          onClick={onNext}
          disabled={corridorDeals.length === 0}
        >
          View deal summary
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
