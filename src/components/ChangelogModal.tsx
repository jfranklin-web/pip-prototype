import { useState } from 'react';
import styles from './ChangelogModal.module.css';

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  summary: string;
  details: string[];
}

const ENTRIES: ChangelogEntry[] = [
  {
    version: 'v0.1',
    date: 'Apr 2026',
    title: 'Initial prototype: Pricing Advisor + Deal Composer',
    summary: 'First working version. Two experiences: a use-case-first pricing advisor for PMs and a margin-aware deal composer for AEs. Five corridors, three products.',
    details: [
      'Pricing advisor: 3-step wizard — describe your goal, pick corridors, see side-by-side product comparison with fit badges and tradeoffs.',
      'Deal composer: 3-step wizard — enter customer profile, add corridors with custom pricing, view deal summary with margin health.',
      'Three products compared: Fiat Global Payouts, USDC Global Payouts, Offramp (USDC to local fiat).',
      'Five corridors: Philippines (PHP), Mexico (MXN), Argentina (ARS), Nigeria (NGN), India (INR).',
      'Margin meter: live visual indicator in deal composer showing margin % by corridor with green/amber/red zones.',
      'All pricing is illustrative based on publicly available sticker prices. No real deal data.',
    ],
  },
  {
    version: 'v0.0',
    date: 'Apr 2026',
    title: 'Project scaffolding',
    summary: 'Vite + React + TypeScript scaffold. Same design system and deploy workflow as the SOKR Status Prototype.',
    details: [
      'Framework: Vite + React + TypeScript. CSS Modules + Stripe/Compass design tokens (no Tailwind).',
      'Deploy: git push to github.com/jfranklin-web/pip-prototype triggers Vercel auto-build (~30s).',
      'Reuses ProtoHeader, Footer, AboutModal, ChangelogModal from SOKR Status Prototype.',
    ],
  },
];

interface Props {
  onClose: () => void;
}

export function ChangelogModal({ onClose }: Props) {
  const [expanded, setExpanded] = useState<string | null>(ENTRIES[0].version);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Changelog</h2>
            <p className={styles.subtitle}>What's changed in this prototype</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.entries}>
          {ENTRIES.map((entry) => {
            const isOpen = expanded === entry.version;
            return (
              <div key={entry.version} className={`${styles.entry} ${isOpen ? styles.entryOpen : ''}`}>
                <button
                  className={styles.entryHeader}
                  onClick={() => setExpanded(isOpen ? null : entry.version)}
                  aria-expanded={isOpen}
                >
                  <div className={styles.entryMeta}>
                    <span className={styles.versionBadge}>{entry.version}</span>
                    <span className={styles.entryDate}>{entry.date}</span>
                  </div>
                  <div className={styles.entryTitle}>{entry.title}</div>
                  <div className={styles.entrySummary}>{entry.summary}</div>
                  <svg
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    aria-hidden="true"
                  >
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {isOpen && (
                  <ul className={styles.detailList}>
                    {entry.details.map((detail, i) => (
                      <li key={i} className={styles.detailItem}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
