import styles from './ProtoHeader.module.css';

interface Props {
  onBack?: () => void;
}

export function ProtoHeader({ onBack }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {onBack && (
          <button className={styles.backLink} onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Experiences
          </button>
        )}
        <div className={styles.brand}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.icon}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.title}>Pricing Indicator Prototype <span className={styles.mockLabel}>(mock data)</span></span>
        </div>
      </div>
    </div>
  );
}
