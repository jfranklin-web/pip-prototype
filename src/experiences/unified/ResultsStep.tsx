import { useState } from 'react';
import type { ProductData, FitLevel, ProductId } from '../../data/types';
import type { Profile } from './UnifiedExperience';
import { CORRIDORS, PRODUCTS } from '../../data/mockData';
import { computeFit, formatVolume } from '../../utils/pricing';
import { FitBadge } from '../../components/FitBadge';
import styles from './ResultsStep.module.css';

const PRODUCT_ORDER: ProductId[] = ['fiat_payouts', 'usdc_payouts', 'offramp'];

const PRODUCT_META: Record<ProductId, { name: string; shortName: string; color: string; desc: string }> = {
  fiat_payouts: { name: 'Fiat Global Payouts', shortName: 'Fiat GP', color: '#635bff', desc: 'Bank rails' },
  usdc_payouts: { name: 'USDC Global Payouts', shortName: 'USDC GP', color: '#10b981', desc: 'Crypto rails' },
  offramp:      { name: 'Offramp', shortName: 'Offramp', color: '#f59e0b', desc: 'USDC to local fiat' },
};

const FIT_RANK: Record<FitLevel, number> = {
  best_fit: 4, partial: 3, not_recommended: 2, not_eligible: 1,
};

interface CorridorResult {
  corridor: typeof CORRIDORS[number];
  products: ProductData[];
  fits: FitLevel[];
  bestIdx: number;
  bestProduct: ProductData | null;
}

interface Props {
  profile: Profile;
  selectedCorridors: string[];
  onBack: () => void;
  onStartOver: () => void;
}

export function ResultsStep({ profile, selectedCorridors, onBack, onStartOver }: Props) {
  const [expandedCorridor, setExpandedCorridor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const corridors = selectedCorridors
    .map((id) => CORRIDORS.find((c) => c.id === id))
    .filter(Boolean) as typeof CORRIDORS;

  // Build per-corridor results
  const results: CorridorResult[] = corridors.map((corridor) => {
    const products = PRODUCT_ORDER
      .map((pid) => PRODUCTS.find((p) => p.corridorId === corridor.id && p.productId === pid))
      .filter(Boolean) as ProductData[];

    const fits = products.map((p) =>
      computeFit(p, profile.selectedGoals, profile.businessType, profile.transactionType)
    );

    const bestIdx = fits.reduce((bestI, fit, i) =>
      FIT_RANK[fit] > FIT_RANK[fits[bestI]] ? i : bestI, 0
    );

    return {
      corridor,
      products,
      fits,
      bestIdx,
      bestProduct: fits[bestIdx] !== 'not_eligible' ? products[bestIdx] : null,
    };
  });

  // Economics: scale per-$100 pricing to actual avg payout amount
  const scale = profile.avgPayoutAmount / 100;
  const estimatedPayoutsPerMonth = Math.round(profile.monthlyVolume / profile.avgPayoutAmount);

  // Per corridor economics using the best eligible product
  const corridorEconomics = results.map(({ corridor, bestProduct, bestIdx, products, fits }) => {
    // Use best fit product; fall back to first available
    const product = bestProduct ?? products.find((_, i) => fits[i] !== 'not_eligible') ?? null;
    if (!product) return { corridor, product: null, costPerPayout: 0, infraPerPayout: 0, marginPerPayout: 0, marginPct: 0 };

    const costPerPayout = product.stickerPrice * scale;
    const infraPerPayout = product.stripeCost * scale;
    const marginPerPayout = costPerPayout - infraPerPayout;
    const marginPct = costPerPayout > 0 ? (marginPerPayout / costPerPayout) * 100 : 0;
    return { corridor, product, costPerPayout, infraPerPayout, marginPerPayout, marginPct, productIdx: bestIdx };
  });

  // Equal-split volume across corridors for totals
  const perCorridorVolume = profile.monthlyVolume / corridors.length;
  const perCorridorPayouts = Math.round(perCorridorVolume / profile.avgPayoutAmount);

  const totalMonthlyFees = corridorEconomics.reduce((sum, r) => {
    if (!r.product) return sum;
    return sum + r.costPerPayout * perCorridorPayouts;
  }, 0);

  const totalMonthlyMargin = corridorEconomics.reduce((sum, r) => {
    if (!r.product) return sum;
    return sum + r.marginPerPayout * perCorridorPayouts;
  }, 0);

  const blendedMarginPct = totalMonthlyFees > 0 ? (totalMonthlyMargin / totalMonthlyFees) * 100 : 0;

  // Availability matrix
  function getAvailability(corridorId: string, productId: ProductId) {
    const p = PRODUCTS.find((prod) => prod.corridorId === corridorId && prod.productId === productId);
    if (!p) return null;
    if (p.available) return 'live';
    return p.availabilityStatus;
  }

  function buildSummaryText() {
    const lines: string[] = [];
    if (profile.customerName) lines.push(`Customer: ${profile.customerName}`);
    lines.push(`Volume: ${formatVolume(profile.monthlyVolume)}/mo, avg payout $${profile.avgPayoutAmount}`);
    lines.push(`Transaction type: ${profile.transactionType === 'me_to_me' ? 'Repatriate funds' : 'Pay third parties'}`);
    lines.push(`Goals: ${profile.selectedGoals.join(', ')}`);
    lines.push('');
    lines.push('Recommendations:');
    for (const r of results) {
      const rec = r.bestProduct ? PRODUCT_META[r.bestProduct.productId].shortName : 'No eligible product';
      const fit = r.fits[r.bestIdx];
      lines.push(`  ${r.corridor.flag} ${r.corridor.name}: ${rec} (${fit.replace('_', ' ')})`);
    }
    lines.push('');
    lines.push('Economics (equal volume split):');
    for (const r of corridorEconomics) {
      if (!r.product) continue;
      lines.push(
        `  ${r.corridor.flag} ${r.corridor.name}: $${r.costPerPayout.toFixed(2)}/payout — ${r.marginPct.toFixed(0)}% margin`
      );
    }
    lines.push(`Blended margin: ${blendedMarginPct.toFixed(0)}%`);
    lines.push(`Est. monthly Stripe revenue: ${formatVolume(totalMonthlyMargin)}`);
    return lines.join('\n');
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  const profileGoalsLabel = profile.selectedGoals.length > 0
    ? profile.selectedGoals.map((g) => g.replace(/_/g, ' ')).join(', ')
    : 'No goals selected';

  return (
    <div className={styles.results}>
      {/* Header */}
      <div className={styles.resultsHeader}>
        <div>
          <h1 className={styles.resultsTitle}>
            {profile.customerName ? `Results for ${profile.customerName}` : 'Results'}
          </h1>
          <p className={styles.resultsMeta}>
            {profile.transactionType === 'me_to_me' ? 'Repatriation' : 'Third-party payouts'}
            {' '}&middot; {profile.businessType === 'direct_us' ? 'US Direct' : profile.businessType === 'direct_uk' ? 'UK Direct' : 'Connect platform'}
            {' '}&middot; {formatVolume(profile.monthlyVolume)}/mo
            {' '}&middot; {profileGoalsLabel}
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
          <button className={styles.startOverBtn} onClick={onStartOver}>Start over</button>
        </div>
      </div>

      {/* ── Section 1: Recommendations ────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionNum}>1</span>
          Recommendations
        </h2>
        <p className={styles.sectionDesc}>
          Best product per corridor based on your goals. Expand a corridor for the full comparison.
        </p>

        <div className={styles.recRows}>
          {results.map(({ corridor, products, fits, bestIdx, bestProduct }) => {
            const isOpen = expandedCorridor === corridor.id;
            return (
              <div key={corridor.id} className={styles.recRow}>
                <div className={styles.recRowMain}>
                  <div className={styles.recCorridorLabel}>
                    <span className={styles.recFlag}>{corridor.flag}</span>
                    <div>
                      <span className={styles.recCorridorName}>{corridor.name}</span>
                      <span className={styles.recCurrency}>{corridor.currency}</span>
                    </div>
                  </div>

                  {bestProduct ? (
                    <div className={styles.recProduct}>
                      <span className={styles.recProductDot} style={{ background: PRODUCT_META[bestProduct.productId].color }} />
                      <span className={styles.recProductName}>{PRODUCT_META[bestProduct.productId].name}</span>
                      <FitBadge level={fits[bestIdx]} />
                      <span className={styles.recPrice}>${bestProduct.stickerPrice.toFixed(2)}/per $100</span>
                      <span className={styles.recSettle}>{bestProduct.settlementTime}{bestProduct.available24x7 ? ' · 24/7' : ''}</span>
                    </div>
                  ) : (
                    <span className={styles.noProduct}>No eligible product for your profile</span>
                  )}

                  <button
                    className={styles.expandBtn}
                    onClick={() => setExpandedCorridor(isOpen ? null : corridor.id)}
                  >
                    Compare all
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={isOpen ? styles.chevronOpen : ''} aria-hidden="true">
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {isOpen && (
                  <div className={styles.recExpanded}>
                    {products.map((product, i) => {
                      const meta = PRODUCT_META[product.productId];
                      const fit = fits[i];
                      const isBest = i === bestIdx && fit !== 'not_eligible';
                      return (
                        <div key={product.productId} className={`${styles.productRow} ${isBest ? styles.productRowBest : ''} ${fit === 'not_eligible' ? styles.productRowIneligible : ''}`}>
                          <div className={styles.productRowName}>
                            <span className={styles.productDot} style={{ background: meta.color }} />
                            <div>
                              <div className={styles.productName}>{meta.name}</div>
                              <div className={styles.productDesc}>{meta.desc}</div>
                            </div>
                            {isBest && <span className={styles.bestTag}>Best fit</span>}
                          </div>
                          <FitBadge level={fit} />
                          {product.available ? (
                            <>
                              <span className={styles.productPrice}>${product.stickerPrice.toFixed(2)}<span className={styles.perHundred}>/per $100</span></span>
                              <span className={styles.productSettle}>{product.settlementTime}{product.available24x7 ? ' · 24/7' : ''}</span>
                            </>
                          ) : (
                            <span className={`${styles.productPrice} ${styles.comingSoon}`} style={{ gridColumn: 'span 2' }}>
                              {product.availabilityNote ?? `Coming ${product.availabilityStatus.replace('_', ' ')}`}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 2: Availability ────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionNum}>2</span>
          Availability
        </h2>
        <p className={styles.sectionDesc}>What's live today and what's rolling out.</p>

        <div className={styles.availTable}>
          <div className={styles.availHeader}>
            <span>Corridor</span>
            {PRODUCT_ORDER.map((pid) => (
              <span key={pid} className={styles.availProductHeader}>
                <span className={styles.availDot} style={{ background: PRODUCT_META[pid].color }} />
                {PRODUCT_META[pid].shortName}
              </span>
            ))}
          </div>
          {corridors.map((corridor) => (
            <div key={corridor.id} className={styles.availRow}>
              <span className={styles.availCorridorLabel}>
                {corridor.flag} {corridor.name}
              </span>
              {PRODUCT_ORDER.map((pid) => {
                const avail = getAvailability(corridor.id, pid);
                return (
                  <span key={pid} className={styles.availCell}>
                    {avail === 'live' && <span className={styles.availLive}>Live</span>}
                    {avail === 'q2_2026' && <span className={styles.availQ2}>Q2 2026</span>}
                    {avail === 'q3_2026' && <span className={styles.availQ3}>Q3 2026</span>}
                    {avail === null && <span className={styles.availNA}>N/A</span>}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Economics ──────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionNum}>3</span>
          Economics
        </h2>
        <p className={styles.sectionDesc}>
          Based on {formatVolume(profile.monthlyVolume)}/mo total volume, avg payout ${profile.avgPayoutAmount}.
          Volume split equally across {corridors.length} corridor{corridors.length > 1 ? 's' : ''} (~{formatVolume(perCorridorVolume)}/mo each).
          Uses recommended product per corridor.
        </p>

        <div className={styles.econTable}>
          <div className={styles.econHeader}>
            <span>Corridor</span>
            <span>Product</span>
            <span>Cost per payout</span>
            <span>Infra cost</span>
            <span>Margin per payout</span>
            <span>Margin %</span>
            <span>Est. monthly revenue</span>
          </div>
          {corridorEconomics.map(({ corridor, product, costPerPayout, infraPerPayout, marginPerPayout, marginPct }) => {
            if (!product) {
              return (
                <div key={corridor.id} className={styles.econRow}>
                  <span className={styles.econCorridorLabel}>{corridor.flag} {corridor.name}</span>
                  <span className={styles.noProductSmall} style={{ gridColumn: 'span 6' }}>No eligible product</span>
                </div>
              );
            }
            const monthlyRev = costPerPayout * perCorridorPayouts;
            const monthlyMargin = marginPerPayout * perCorridorPayouts;
            const zoneClass = marginPct >= 40 ? styles.marginGreen : marginPct >= 20 ? styles.marginAmber : styles.marginRed;
            return (
              <div key={corridor.id} className={styles.econRow}>
                <span className={styles.econCorridorLabel}>
                  {corridor.flag} {corridor.name}
                </span>
                <span className={styles.econProductCell}>
                  <span className={styles.econDot} style={{ background: PRODUCT_META[product.productId].color }} />
                  {PRODUCT_META[product.productId].shortName}
                </span>
                <span className={styles.econValue}>${costPerPayout.toFixed(2)}</span>
                <span className={styles.econMuted}>${infraPerPayout.toFixed(2)}</span>
                <span className={`${styles.econValue} ${zoneClass}`}>${marginPerPayout.toFixed(2)}</span>
                <span className={`${styles.econValue} ${zoneClass}`}>{marginPct.toFixed(0)}%</span>
                <span className={styles.econValue}>
                  {formatVolume(monthlyRev)}
                  <span className={styles.econMarginNote}> ({formatVolume(monthlyMargin)} margin)</span>
                </span>
              </div>
            );
          })}

          {/* Totals row */}
          <div className={`${styles.econRow} ${styles.econTotals}`}>
            <span style={{ gridColumn: 'span 2' }}>Total ({corridors.length} corridors, equal split)</span>
            <span></span>
            <span></span>
            <span></span>
            <span className={blendedMarginPct >= 40 ? styles.marginGreen : blendedMarginPct >= 20 ? styles.marginAmber : styles.marginRed}>
              {blendedMarginPct.toFixed(0)}% blended
            </span>
            <span>
              {formatVolume(totalMonthlyFees)}
              <span className={styles.econMarginNote}> ({formatVolume(totalMonthlyMargin)} margin)</span>
            </span>
          </div>
        </div>

        {/* Volume summary cards */}
        <div className={styles.econSummaryCards}>
          <div className={styles.econCard}>
            <span className={styles.econCardLabel}>Monthly payout volume</span>
            <span className={styles.econCardValue}>{formatVolume(profile.monthlyVolume)}</span>
            <span className={styles.econCardSub}>~{estimatedPayoutsPerMonth.toLocaleString()} payouts</span>
          </div>
          <div className={styles.econCard}>
            <span className={styles.econCardLabel}>Est. Stripe revenue</span>
            <span className={styles.econCardValue}>{formatVolume(totalMonthlyFees)}/mo</span>
            <span className={styles.econCardSub}>fees across all corridors</span>
          </div>
          <div className={styles.econCard}>
            <span className={styles.econCardLabel}>Est. margin</span>
            <span className={`${styles.econCardValue} ${blendedMarginPct >= 40 ? styles.marginGreen : blendedMarginPct >= 20 ? styles.marginAmber : styles.marginRed}`}>
              {formatVolume(totalMonthlyMargin)}/mo
            </span>
            <span className={styles.econCardSub}>{blendedMarginPct.toFixed(0)}% blended margin</span>
          </div>
        </div>
      </section>

      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M7 3L3 7l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Change corridors
        </button>
      </div>
    </div>
  );
}
