import { useState } from 'react';
import type { ProductData, FitLevel } from '../data/types';
import { FitBadge } from './FitBadge';
import styles from './ProductCard.module.css';

const PRODUCT_NAMES: Record<string, string> = {
  fiat_payouts: 'Fiat Global Payouts',
  usdc_payouts: 'USDC Global Payouts',
  offramp: 'Offramp',
};

const PRODUCT_COLORS: Record<string, string> = {
  fiat_payouts: '#635bff',
  usdc_payouts: '#10b981',
  offramp: '#f59e0b',
};

const PRODUCT_DESCS: Record<string, string> = {
  fiat_payouts: 'Traditional bank rails',
  usdc_payouts: 'Crypto rails to external wallet',
  offramp: 'USDC to local fiat via rails',
};

interface Props {
  product: ProductData;
  fitLevel: FitLevel;
  isRecommended?: boolean;
}

export function ProductCard({ product, fitLevel, isRecommended }: Props) {
  const [expanded, setExpanded] = useState(false);
  const name = PRODUCT_NAMES[product.productId];
  const color = PRODUCT_COLORS[product.productId];
  const desc = PRODUCT_DESCS[product.productId];
  const unavailable = !product.available;

  return (
    <div className={`${styles.card} ${unavailable ? styles.unavailable : ''} ${isRecommended ? styles.recommended : ''}`}>
      {isRecommended && <div className={styles.recommendedBanner}>Recommended</div>}

      <div className={styles.header}>
        <div className={styles.productId}>
          <span className={styles.productDot} style={{ background: color }} />
          <div>
            <div className={styles.productName}>{name}</div>
            <div className={styles.productDesc}>{desc}</div>
          </div>
        </div>
        <FitBadge level={fitLevel} />
      </div>

      {unavailable ? (
        <div className={styles.unavailableBody}>
          <span className={styles.comingSoon}>
            {product.availabilityNote ?? `Coming ${product.availabilityStatus.replace('_', ' ').toUpperCase()}`}
          </span>
          {product.pros.length > 0 && (
            <ul className={styles.previewPros}>
              {product.pros.map((pro, i) => <li key={i}>{pro}</li>)}
            </ul>
          )}
        </div>
      ) : (
        <>
          <div className={styles.keyStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>All-in (per $100)</span>
              <span className={styles.statValue}>${product.stickerPrice.toFixed(2)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Settlement</span>
              <span className={styles.statValue}>{product.settlementTime}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>24/7</span>
              <span className={styles.statValue}>{product.available24x7 ? 'Yes' : 'No'}</span>
            </div>
          </div>

          <div className={styles.feeBreakdown}>
            {product.feeBreakdown.map((item, i) => (
              <div key={i} className={styles.feeLine}>
                <span>{item.label}</span>
                <span className={styles.feeAmt}>{item.amount}</span>
              </div>
            ))}
            <div className={`${styles.feeLine} ${styles.feeTotal}`}>
              <span>Total (per $100)</span>
              <span className={styles.feeAmt}>${product.stickerPrice.toFixed(2)}</span>
            </div>
          </div>

          {product.volatilityNote && (
            <div className={styles.volatilityNote}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1L1 10h10L6 1z" stroke="#b45309" strokeWidth="1.25" strokeLinejoin="round"/>
                <path d="M6 5v2.5" stroke="#b45309" strokeWidth="1.25" strokeLinecap="round"/>
                <circle cx="6" cy="8.5" r="0.5" fill="#b45309"/>
              </svg>
              {product.volatilityNote}
            </div>
          )}

          <button
            className={styles.expandBtn}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? 'Hide details' : 'Show tradeoffs + requirements'}
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              className={expanded ? styles.chevronOpen : ''}
              aria-hidden="true"
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {expanded && (
            <div className={styles.expanded}>
              {product.pros.length > 0 && (
                <div className={styles.tradeoffSection}>
                  <div className={styles.tradeoffTitle}>Pros</div>
                  <ul className={styles.tradeoffList}>
                    {product.pros.map((p, i) => (
                      <li key={i} className={styles.proItem}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.cons.length > 0 && (
                <div className={styles.tradeoffSection}>
                  <div className={styles.tradeoffTitle}>Cons</div>
                  <ul className={styles.tradeoffList}>
                    {product.cons.map((c, i) => (
                      <li key={i} className={styles.conItem}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.recipientRequirements.length > 0 && (
                <div className={styles.tradeoffSection}>
                  <div className={styles.tradeoffTitle}>Recipient needs</div>
                  <ul className={styles.tradeoffList}>
                    {product.recipientRequirements.map((r, i) => (
                      <li key={i} className={styles.reqItem}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
