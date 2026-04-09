import styles from './AboutModal.module.css';

interface Props {
  onClose: () => void;
}

export function AboutModal({ onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>

        <div className={styles.hero}>
          <div className={styles.heroIcon} aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#635bff"/>
              <path d="M8 22h16M8 16h10M8 10h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="24" cy="16" r="4" fill="white" opacity="0.9"/>
              <path d="M22.5 16h3M24 14.5v3" stroke="#635bff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className={styles.heroTitle}>Pricing Indicator Prototype</h1>
          <p className={styles.heroTagline}>What's the right product for this customer?</p>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>The problem</h2>
            <p className={styles.sectionText}>
              Stripe offers three ways to pay third parties globally: Fiat Global Payouts, USDC Global Payouts,
              and Offramp. Each has different pricing, coverage, and tradeoffs. PMs and AEs need a fast way
              to compare products and build deals without digging through multiple pricing docs.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How it works</h2>
            <p className={styles.sectionText}>
              A single 4-step flow for both PMs and AEs. Start with what the customer is trying to do,
              select corridors, dial in volume, confirm sender eligibility, and see a full recommendation
              with availability and economics.
            </p>
            <div className={styles.featureList}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🎯</span>
                <div>
                  <span className={styles.featureTitle}>Goals</span>
                  <span className={styles.featureDesc}>
                    Transaction type (pay third parties or repatriate funds) and what you're optimizing
                    for: lowest cost, fastest settlement, or currency volatility protection.
                  </span>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🌍</span>
                <div>
                  <span className={styles.featureTitle}>Corridors + volume</span>
                  <span className={styles.featureDesc}>
                    Pick destination countries and set monthly volume and avg payout size.
                    Economics update live as you adjust the sliders.
                  </span>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🏢</span>
                <div>
                  <span className={styles.featureTitle}>Sender eligibility</span>
                  <span className={styles.featureDesc}>
                    US Direct, UK Direct, or Connect platform. This filters which products are available
                    before showing results.
                  </span>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📊</span>
                <div>
                  <span className={styles.featureTitle}>Results</span>
                  <span className={styles.featureDesc}>
                    Best product per corridor, full availability matrix, and a per-corridor economics
                    table with margin estimates and summary totals.
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Three products compared</h2>
            <p className={styles.sectionText}>
              <strong>Fiat Global Payouts</strong>: traditional rails, 58 countries, ~$3.00/payout for cross-border.
              Widest eligibility (Direct + Connect). T+1 to T+3 settlement.
            </p>
            <p className={styles.sectionText}>
              <strong>USDC Global Payouts</strong>: crypto rails via external wallet. US Direct only.
              ~$1.00/payout, instant 24/7 settlement. Recipient needs a crypto wallet.
            </p>
            <p className={styles.sectionText}>
              <strong>Offramp</strong>: user holds USDC; Stripe converts to local fiat on delivery.
              Rolling out (8 currencies live, 50+ by end 2026). US Direct only.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Questions this is designed to answer</h2>
            <ol className={styles.questionList}>
              <li>Does solution-first navigation (goal then corridor) work better than product-first?</li>
              <li>Is the three-product comparison easy to scan and act on?</li>
              <li>Does the live economics view give PMs and AEs enough to have a pricing conversation?</li>
              <li>What information is missing that teams need in a real selling conversation?</li>
            </ol>
          </section>

          <div className={styles.meta}>
            <span>Built by jfranklin + emym · April 2026</span>
            <span className={styles.metaDot}>·</span>
            <a
              href="https://github.com/jfranklin-web/pip-prototype"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.metaLink}
            >
              View source on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
