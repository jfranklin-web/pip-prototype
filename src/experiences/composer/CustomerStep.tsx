import type { BusinessType } from '../../data/types';
import type { CustomerProfile } from './ComposerExperience';
import styles from './CustomerStep.module.css';

const BUSINESS_TYPES: { id: BusinessType; label: string }[] = [
  { id: 'direct_us', label: 'US Direct' },
  { id: 'direct_uk', label: 'UK Direct' },
  { id: 'connect_platform', label: 'Connect platform' },
];

interface Props {
  customer: CustomerProfile;
  onChange: (updated: CustomerProfile) => void;
  onNext: () => void;
}

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export function CustomerStep({ customer, onChange, onNext }: Props) {
  const canContinue = customer.customerName.trim().length > 0;

  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>Customer profile</h1>
        <p className={styles.stepSubtitle}>
          This determines which products are eligible and sizes the deal economics.
        </p>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="customerName">Customer name</label>
          <input
            id="customerName"
            className={styles.input}
            type="text"
            placeholder="e.g., Apex Marketplace"
            value={customer.customerName}
            onChange={(e) => onChange({ ...customer, customerName: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Business type</label>
          <div className={styles.btGrid}>
            {BUSINESS_TYPES.map((bt) => (
              <button
                key={bt.id}
                className={`${styles.btBtn} ${customer.businessType === bt.id ? styles.btSelected : ''}`}
                onClick={() => onChange({ ...customer, businessType: bt.id })}
              >
                {bt.label}
              </button>
            ))}
          </div>
          {customer.businessType === 'connect_platform' && (
            <p className={styles.eligNote}>
              Connect platforms can only use Fiat Global Payouts. USDC GP and Offramp are US Direct only.
            </p>
          )}
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="monthlyVolume">
              Monthly payout volume
              <span className={styles.fieldValue}>{formatVolume(customer.monthlyVolume)}</span>
            </label>
            <input
              id="monthlyVolume"
              className={styles.slider}
              type="range"
              min={100_000}
              max={100_000_000}
              step={100_000}
              value={customer.monthlyVolume}
              onChange={(e) => onChange({ ...customer, monthlyVolume: parseInt(e.target.value) })}
            />
            <div className={styles.sliderLabels}>
              <span>$100K</span>
              <span>$100M</span>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="avgPayout">
              Avg payout amount
              <span className={styles.fieldValue}>${customer.avgPayoutAmount}</span>
            </label>
            <input
              id="avgPayout"
              className={styles.slider}
              type="range"
              min={10}
              max={10_000}
              step={10}
              value={customer.avgPayoutAmount}
              onChange={(e) => onChange({ ...customer, avgPayoutAmount: parseInt(e.target.value) })}
            />
            <div className={styles.sliderLabels}>
              <span>$10</span>
              <span>$10,000</span>
            </div>
          </div>
        </div>

        <div className={styles.volumePreview}>
          <div className={styles.previewItem}>
            <span className={styles.previewLabel}>Estimated monthly payouts</span>
            <span className={styles.previewValue}>
              ~{Math.round(customer.monthlyVolume / customer.avgPayoutAmount).toLocaleString()}
            </span>
          </div>
          <div className={styles.previewItem}>
            <span className={styles.previewLabel}>Monthly volume tier</span>
            <span className={styles.previewValue}>
              {customer.monthlyVolume >= 50_000_000 ? '$50M+' :
               customer.monthlyVolume >= 10_000_000 ? '$10M-$50M' :
               customer.monthlyVolume >= 1_000_000 ? '$1M-$10M' : 'Under $1M'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.nextBtn}
          onClick={onNext}
          disabled={!canContinue}
        >
          Add corridors
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {!canContinue && <span className={styles.hint}>Enter a customer name to continue</span>}
      </div>
    </div>
  );
}
