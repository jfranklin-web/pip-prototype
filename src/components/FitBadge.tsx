import type { FitLevel } from '../data/types';
import styles from './FitBadge.module.css';

const CONFIG: Record<FitLevel, { label: string; className: string }> = {
  best_fit:        { label: 'Best fit',       className: 'best' },
  partial:         { label: 'Partial fit',    className: 'partial' },
  not_recommended: { label: 'Not recommended', className: 'notRecommended' },
  not_eligible:    { label: 'Not eligible',   className: 'notEligible' },
};

interface Props {
  level: FitLevel;
}

export function FitBadge({ level }: Props) {
  const { label, className } = CONFIG[level];
  return <span className={`${styles.badge} ${styles[className]}`}>{label}</span>;
}
