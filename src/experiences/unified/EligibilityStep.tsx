import type { BusinessType } from '../../data/types';
import type { Profile } from './UnifiedExperience';
import styles from './EligibilityStep.module.css';

const BUSINESS_TYPES: { id: BusinessType; label: string; description: string }[] = [
  {
    id: 'direct_us',
    label: 'US Direct',
    description: 'US-based business using Stripe directly',
  },
  {
    id: 'direct_uk',
    label: 'UK Direct',
    description: 'UK-based business using Stripe directly',
  },
  {
    id: 'connect_platform',
    label: 'Connect platform',
    description: 'Platform paying out to third-party connected accounts',
  },
];

interface Props {
  profile: Profile;
  onChange: (updated: Profile) => void;
  onBack: () => void;
  onNext: () => void;
}

export function EligibilityStep({ profile, onChange, onBack, onNext }: Props) {
  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>Who is the sender?</h1>
        <p className={styles.stepSubtitle}>
          Sender type affects which products are available. Connect platforms can only use Fiat Global Payouts.
        </p>
      </div>

      <div className={styles.typeGrid}>
        {BUSINESS_TYPES.map((bt) => {
          const isSelected = profile.businessType === bt.id;
          return (
            <button
              key={bt.id}
              className={`${styles.typeCard} ${isSelected ? styles.typeSelected : ''}`}
              onClick={() => onChange({ ...profile, businessType: bt.id })}
              aria-pressed={isSelected}
            >
              <div className={styles.typeTop}>
                <span className={styles.typeLabel}>{bt.label}</span>
                {isSelected && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" fill="#635bff"/>
                    <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={styles.typeDesc}>{bt.description}</span>
              {bt.id === 'connect_platform' && (
                <span className={styles.typeNote}>Fiat Global Payouts only</span>
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M7 3L3 7l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <button className={styles.nextBtn} onClick={onNext}>
          See results
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
