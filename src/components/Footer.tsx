import { useState } from 'react';
import styles from './Footer.module.css';

interface Props {
  onShowAbout: () => void;
  onShowChangelog: () => void;
}

export function Footer({ onShowAbout, onShowChangelog }: Props) {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <div className={styles.metaGrid}>
          <span className={styles.metaLabel}>Built by</span>
          <span className={styles.metaValue}>jfranklin</span>
        </div>
        <p className={styles.tagline}>Prototyped with love and frustration</p>
      </div>

      <div className={styles.right}>
        <div className={styles.disclaimerWrapper}>
          <button
            className={styles.disclaimerBtn}
            onClick={() => setDisclaimerOpen((v) => !v)}
            aria-expanded={disclaimerOpen}
          >
            Disclaimer
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="4.5" r="0.75" fill="currentColor"/>
            </svg>
          </button>
          {disclaimerOpen && (
            <div className={styles.disclaimerPopover} role="tooltip">
              All pricing is illustrative and based on publicly available information.
              Actual pricing, margins, and discounting terms may differ. This prototype
              is for internal PM and AE use only.
            </div>
          )}
        </div>

        <div className={styles.linkBtns}>
          <a
            className={styles.linkBtn}
            href="https://github.com/jfranklin-web/pip-prototype"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.64 7.64 0 012 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
          <button className={styles.linkBtn} onClick={onShowAbout}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            About
          </button>
          <button className={styles.linkBtn} onClick={onShowChangelog}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 4h10M3 8h10M3 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Changelog
          </button>
        </div>
      </div>
    </footer>
  );
}
