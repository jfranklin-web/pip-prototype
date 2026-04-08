import { Footer } from '../components/Footer';
import { ProtoHeader } from '../components/ProtoHeader';
import styles from './Launcher.module.css';

type View = 'launcher' | 'advisor' | 'composer';

interface Props {
  onLaunch: (view: View) => void;
  onShowAbout: () => void;
  onShowChangelog: () => void;
}

export function Launcher({ onLaunch, onShowAbout, onShowChangelog }: Props) {
  return (
    <div className={styles.page}>
      <ProtoHeader />

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Global payouts, three ways</h1>
          <p className={styles.heroSubtitle}>
            Compare Fiat Global Payouts, USDC Global Payouts, and Offramp across corridors.
            Find the right product for a customer, or build a deal with margin visibility.
          </p>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardTag}>For PMs</div>
            <div className={styles.cardIcon}>🧭</div>
            <h2 className={styles.cardTitle}>Pricing advisor</h2>
            <p className={styles.cardDesc}>
              Start with what a customer is trying to solve. Pick corridors, then see all three products
              side by side with fit ratings, cost breakdowns, and tradeoffs.
            </p>
            <ul className={styles.cardFeatures}>
              <li>Use-case-first navigation (not product-first)</li>
              <li>Side-by-side comparison across 5 corridors</li>
              <li>Fit badge per product: Best fit, Partial, Not eligible</li>
              <li>Expandable tradeoffs and recipient requirements</li>
            </ul>
            <button className={styles.launchBtn} onClick={() => onLaunch('advisor')}>
              Open pricing advisor
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTag}>For AEs</div>
            <div className={styles.cardIcon}>📊</div>
            <h2 className={styles.cardTitle}>Deal composer</h2>
            <p className={styles.cardDesc}>
              Build a deal corridor by corridor. Set custom pricing and see your margin room in real time.
              Export a deal summary for Slack or email.
            </p>
            <ul className={styles.cardFeatures}>
              <li>Margin meter per corridor (green/amber/red zones)</li>
              <li>Discount floor guardrails built in</li>
              <li>Blended margin across all corridors in the deal</li>
              <li>One-click deal summary to copy and share</li>
            </ul>
            <button className={styles.launchBtn} onClick={() => onLaunch('composer')}>
              Open deal composer
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.productRow}>
          <div className={styles.productPill}>
            <span className={styles.productDot} style={{ background: '#635bff' }} />
            Fiat Global Payouts
            <span className={styles.productSub}>58 countries · T+1 to T+3</span>
          </div>
          <div className={styles.productPill}>
            <span className={styles.productDot} style={{ background: '#10b981' }} />
            USDC Global Payouts
            <span className={styles.productSub}>Global · Instant 24/7</span>
          </div>
          <div className={styles.productPill}>
            <span className={styles.productDot} style={{ background: '#f59e0b' }} />
            Offramp
            <span className={styles.productSub}>8 currencies live · Rolling out</span>
          </div>
        </div>
      </main>

      <Footer onShowAbout={onShowAbout} onShowChangelog={onShowChangelog} />
    </div>
  );
}
