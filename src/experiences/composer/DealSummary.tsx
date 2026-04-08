import { useState } from 'react';
import type { ProductId } from '../../data/types';
import type { CustomerProfile, CorridorDeal } from './ComposerExperience';
import { CORRIDORS, PRODUCTS } from '../../data/mockData';
import styles from './DealSummary.module.css';

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
  onBack: () => void;
  onStartOver: () => void;
}

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export function DealSummary({ customer, corridorDeals, onBack, onStartOver }: Props) {
  const [copied, setCopied] = useState(false);

  // Compute per-corridor economics
  const rows = corridorDeals.map((deal) => {
    const corridor = CORRIDORS.find((c) => c.id === deal.corridorId)!;
    const product = PRODUCTS.find((p) => p.corridorId === deal.corridorId && p.productId === deal.productId);
    const stripeCost = product?.stripeCost ?? 0;
    const stickerPrice = product?.stickerPrice ?? 0;

    // Scale from per-$100 to actual avg payout
    const scale = customer.avgPayoutAmount / 100;
    const customPerPayout = deal.customPrice * scale;
    const infraPerPayout = stripeCost * scale;
    const marginPerPayout = customPerPayout - infraPerPayout;
    const marginPct = customPerPayout > 0 ? (marginPerPayout / customPerPayout) * 100 : 0;
    const stickerPerPayout = stickerPrice * scale;

    // Monthly estimates
    const numPayoutsPerMonth = Math.round(customer.monthlyVolume / customer.avgPayoutAmount);
    const monthlyRevenue = customPerPayout * numPayoutsPerMonth;
    const monthlyMargin = marginPerPayout * numPayoutsPerMonth;

    const zone = deal.customPrice < stickerPrice ? (deal.customPrice < (stripeCost * 2) ? 'red' : 'amber') : 'green';

    return {
      corridor,
      deal,
      product,
      stripeCost,
      stickerPrice,
      customPerPayout,
      infraPerPayout,
      marginPerPayout,
      marginPct,
      stickerPerPayout,
      numPayoutsPerMonth,
      monthlyRevenue,
      monthlyMargin,
      zone,
    };
  });

  const totalMonthlyRevenue = rows.reduce((sum, r) => sum + r.monthlyRevenue, 0);
  const totalMonthlyMargin = rows.reduce((sum, r) => sum + r.monthlyMargin, 0);
  const blendedMarginPct = totalMonthlyRevenue > 0 ? (totalMonthlyMargin / totalMonthlyRevenue) * 100 : 0;
  const overallZone = blendedMarginPct >= 40 ? 'green' : blendedMarginPct >= 20 ? 'amber' : 'red';

  const discountRows = rows.filter((r) => r.deal.customPrice < r.stickerPrice);

  function buildSummaryText() {
    const lines: string[] = [
      `Deal Summary: ${customer.customerName}`,
      `Business type: ${customer.businessType === 'direct_us' ? 'US Direct' : customer.businessType === 'direct_uk' ? 'UK Direct' : 'Connect platform'}`,
      `Monthly volume: ${formatVolume(customer.monthlyVolume)}`,
      '',
      'Corridors:',
    ];
    for (const r of rows) {
      lines.push(
        `  ${r.corridor.flag} ${r.corridor.name}: ${PRODUCT_NAMES[r.deal.productId]} @ $${r.deal.customPrice.toFixed(2)}/per $100 — ${r.marginPct.toFixed(0)}% margin`
      );
      if (r.deal.discountNote) lines.push(`    Note: ${r.deal.discountNote}`);
    }
    lines.push('');
    lines.push(`Blended margin: ${blendedMarginPct.toFixed(0)}%`);
    lines.push(`Est. monthly Stripe revenue: ${formatVolume(totalMonthlyRevenue)}`);
    return lines.join('\n');
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className={styles.summary}>
      <div className={styles.summaryHeader}>
        <div>
          <h1 className={styles.summaryTitle}>Deal summary</h1>
          <p className={styles.summaryMeta}>
            {customer.customerName}
            {' '}&middot; {customer.businessType === 'direct_us' ? 'US Direct' : customer.businessType === 'direct_uk' ? 'UK Direct' : 'Connect platform'}
            {' '}&middot; {formatVolume(customer.monthlyVolume)}/mo
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.copyBtn} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy summary'}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <rect x="4" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M1 4.5v6A1.5 1.5 0 002.5 12H9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Health indicator */}
      <div className={`${styles.healthBanner} ${styles[`health_${overallZone}`]}`}>
        <div className={styles.healthLabel}>Deal health</div>
        <div className={styles.healthValue}>{blendedMarginPct.toFixed(0)}% blended margin</div>
        <div className={styles.healthDesc}>
          {overallZone === 'green' && 'Strong margins across all corridors'}
          {overallZone === 'amber' && 'Some corridors are below list price — review discount notes'}
          {overallZone === 'red' && 'One or more corridors are near or below floor — escalate for approval'}
        </div>
      </div>

      {/* Per-corridor rows */}
      <div className={styles.corridorRows}>
        <div className={styles.tableHeader}>
          <span>Corridor</span>
          <span>Product</span>
          <span>Price per $100</span>
          <span>Margin per payout</span>
          <span>Est. monthly rev.</span>
        </div>
        {rows.map((r) => (
          <div key={r.deal.corridorId} className={styles.tableRow}>
            <span className={styles.corridorCell}>
              {r.corridor.flag} {r.corridor.name}
              <span className={styles.currencyBadge}>{r.corridor.currency}</span>
            </span>
            <span className={styles.productCell}>
              <span className={styles.productDot} style={{ background: PRODUCT_COLORS[r.deal.productId] }} />
              {PRODUCT_NAMES[r.deal.productId]}
            </span>
            <span className={styles.priceCell}>
              <strong>${r.deal.customPrice.toFixed(2)}</strong>
              {r.deal.customPrice < r.stickerPrice && (
                <span className={styles.vsSticker}>list ${r.stickerPrice.toFixed(2)}</span>
              )}
            </span>
            <span className={`${styles.marginCell} ${styles[r.zone]}`}>
              ${r.marginPerPayout.toFixed(2)}
              <span className={styles.marginPct}>{r.marginPct.toFixed(0)}%</span>
            </span>
            <span className={styles.revenueCell}>{formatVolume(r.monthlyRevenue)}</span>
          </div>
        ))}

        {/* Totals row */}
        <div className={`${styles.tableRow} ${styles.totalsRow}`}>
          <span>Total</span>
          <span></span>
          <span></span>
          <span className={`${styles.marginCell} ${styles[overallZone]}`}>
            {blendedMarginPct.toFixed(0)}% blended
          </span>
          <span className={styles.revenueCell}><strong>{formatVolume(totalMonthlyRevenue)}</strong></span>
        </div>
      </div>

      {/* Discount log */}
      {discountRows.length > 0 && (
        <div className={styles.discountLog}>
          <div className={styles.discountLogTitle}>Discount log</div>
          {discountRows.map((r) => (
            <div key={r.deal.corridorId} className={styles.discountLogRow}>
              <span>{r.corridor.flag} {r.corridor.name}</span>
              <span>{PRODUCT_NAMES[r.deal.productId]}</span>
              <span className={styles.discountAmt}>
                ${r.deal.customPrice.toFixed(2)} (list ${r.stickerPrice.toFixed(2)})
              </span>
              <span className={styles.discountNote}>
                {r.deal.discountNote || <em className={styles.noNote}>No note</em>}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M7 3L3 7l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Edit corridors
        </button>
        <button className={styles.startOverBtn} onClick={onStartOver}>
          Start new deal
        </button>
      </div>
    </div>
  );
}
