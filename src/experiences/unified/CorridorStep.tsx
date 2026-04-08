import { CORRIDORS } from '../../data/mockData';
import styles from './CorridorStep.module.css';

interface Props {
  selectedCorridors: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function CorridorStep({ selectedCorridors, onToggle, onBack, onNext }: Props) {
  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>Which corridors?</h1>
        <p className={styles.stepSubtitle}>
          Select the destination countries. You'll see a recommendation and full economics for each.
        </p>
      </div>

      <div className={styles.corridorGrid}>
        {CORRIDORS.map((corridor) => {
          const isSelected = selectedCorridors.includes(corridor.id);
          return (
            <button
              key={corridor.id}
              className={`${styles.corridorCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => onToggle(corridor.id)}
              aria-pressed={isSelected}
            >
              <span className={styles.flag}>{corridor.flag}</span>
              <div className={styles.corridorInfo}>
                <span className={styles.corridorName}>{corridor.name}</span>
                <span className={styles.corridorMeta}>{corridor.currency} · {corridor.region}</span>
              </div>
              {isSelected && (
                <svg className={styles.checkmark} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" fill="#635bff"/>
                  <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {selectedCorridors.length > 0 && (
        <div className={styles.selectionSummary}>
          {selectedCorridors.length} corridor{selectedCorridors.length > 1 ? 's' : ''} selected:
          {' '}{selectedCorridors.map((id) => CORRIDORS.find((c) => c.id === id)?.flag).join(' ')}
        </div>
      )}

      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M7 3L3 7l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <button className={styles.nextBtn} onClick={onNext} disabled={selectedCorridors.length === 0}>
          See results
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {selectedCorridors.length === 0 && (
          <span className={styles.hint}>Select at least one corridor</span>
        )}
      </div>
    </div>
  );
}
