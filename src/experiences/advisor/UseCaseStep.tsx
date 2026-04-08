import type { UseCaseId, BusinessType } from '../../data/types';
import { USE_CASES } from '../../data/mockData';
import styles from './UseCaseStep.module.css';

const BUSINESS_TYPES: { id: BusinessType; label: string; description: string }[] = [
  { id: 'direct_us', label: 'US Direct', description: 'US-based business, Direct integration' },
  { id: 'direct_uk', label: 'UK Direct', description: 'UK-based business, Direct integration' },
  { id: 'connect_platform', label: 'Connect platform', description: 'Marketplace or platform using Stripe Connect' },
];

interface Props {
  selectedUseCase: UseCaseId | null;
  selectedBusinessType: BusinessType;
  onSelectUseCase: (id: UseCaseId) => void;
  onSelectBusinessType: (type: BusinessType) => void;
  onNext: () => void;
}

export function UseCaseStep({
  selectedUseCase,
  selectedBusinessType,
  onSelectUseCase,
  onSelectBusinessType,
  onNext,
}: Props) {
  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>What are you trying to solve?</h1>
        <p className={styles.stepSubtitle}>
          Pick the goal that best describes the customer's primary need. This shapes which product fits best.
        </p>
      </div>

      <div className={styles.useCaseGrid}>
        {USE_CASES.map((uc) => (
          <button
            key={uc.id}
            className={`${styles.useCaseCard} ${selectedUseCase === uc.id ? styles.selected : ''}`}
            onClick={() => onSelectUseCase(uc.id)}
          >
            <span className={styles.ucIcon}>{uc.icon}</span>
            <span className={styles.ucLabel}>{uc.label}</span>
            <span className={styles.ucDesc}>{uc.description}</span>
          </button>
        ))}
      </div>

      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Customer profile</h2>
        <p className={styles.sectionDesc}>This determines which products are eligible.</p>
        <div className={styles.businessTypeGrid}>
          {BUSINESS_TYPES.map((bt) => (
            <button
              key={bt.id}
              className={`${styles.btCard} ${selectedBusinessType === bt.id ? styles.btSelected : ''}`}
              onClick={() => onSelectBusinessType(bt.id)}
            >
              <span className={styles.btLabel}>{bt.label}</span>
              <span className={styles.btDesc}>{bt.description}</span>
            </button>
          ))}
        </div>
        {selectedBusinessType === 'connect_platform' && (
          <div className={styles.eligibilityNote}>
            Connect platforms can only use Fiat Global Payouts. USDC Global Payouts and Offramp are US Direct only.
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.nextBtn}
          onClick={onNext}
          disabled={!selectedUseCase}
        >
          Choose corridors
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {!selectedUseCase && (
          <span className={styles.hint}>Select a goal above to continue</span>
        )}
      </div>
    </div>
  );
}
