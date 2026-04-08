import type { UseCaseId, BusinessType, FitLevel } from '../../data/types';
import { CORRIDORS, PRODUCTS, USE_CASES } from '../../data/mockData';
import { computeFit } from '../../utils/pricing';
import { ProductCard } from '../../components/ProductCard';
import styles from './ResultsStep.module.css';

interface Props {
  selectedUseCase: UseCaseId;
  selectedBusinessType: BusinessType;
  selectedCorridors: string[];
  onBack: () => void;
  onStartOver: () => void;
}

const PRODUCT_ORDER = ['fiat_payouts', 'usdc_payouts', 'offramp'] as const;

export function ResultsStep({
  selectedUseCase,
  selectedBusinessType,
  selectedCorridors,
  onBack,
  onStartOver,
}: Props) {
  const useCase = USE_CASES.find((uc) => uc.id === selectedUseCase);
  const corridors = selectedCorridors
    .map((id) => CORRIDORS.find((c) => c.id === id))
    .filter(Boolean) as typeof CORRIDORS;

  return (
    <div className={styles.results}>
      <div className={styles.resultsHeader}>
        <div>
          <h1 className={styles.resultsTitle}>Recommendations</h1>
          <p className={styles.resultsMeta}>
            Goal: <strong>{useCase?.label}</strong>
            {' '}&middot; Business type: <strong>
              {selectedBusinessType === 'direct_us' ? 'US Direct' :
               selectedBusinessType === 'direct_uk' ? 'UK Direct' : 'Connect platform'}
            </strong>
            {' '}&middot; {corridors.length} corridor{corridors.length > 1 ? 's' : ''}
          </p>
        </div>
        <button className={styles.startOverBtn} onClick={onStartOver}>
          Start over
        </button>
      </div>

      <div className={styles.corridorSections}>
        {corridors.map((corridor) => {
          const products = PRODUCT_ORDER
            .map((pid) => PRODUCTS.find((p) => p.corridorId === corridor.id && p.productId === pid))
            .filter(Boolean) as typeof PRODUCTS;

          const fits: FitLevel[] = products.map((p) =>
            computeFit(p, selectedUseCase, selectedBusinessType)
          );

          // Find best product to highlight
          const bestIdx = fits.findIndex((f) => f === 'best_fit');

          return (
            <div key={corridor.id} className={styles.corridorSection}>
              <div className={styles.corridorHeader}>
                <span className={styles.corridorFlag}>{corridor.flag}</span>
                <div>
                  <span className={styles.corridorName}>{corridor.name}</span>
                  <span className={styles.corridorCurrency}>{corridor.currency}</span>
                </div>
              </div>
              <div className={styles.productGrid}>
                {products.map((product, i) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    fitLevel={fits[i]}
                    isRecommended={i === bestIdx && fits[i] === 'best_fit'}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M7 3L3 7l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Change corridors
        </button>
        <div className={styles.legend}>
          <span className={styles.legendItem} style={{ color: '#15803d' }}>Best fit</span>
          <span className={styles.legendItem} style={{ color: '#b45309' }}>Partial fit</span>
          <span className={styles.legendItem} style={{ color: '#b91c1c' }}>Not recommended</span>
          <span className={styles.legendItem} style={{ color: '#6b7280' }}>Not eligible</span>
        </div>
      </div>
    </div>
  );
}
