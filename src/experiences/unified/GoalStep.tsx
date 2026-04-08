import { useState, useEffect } from 'react';
import type { BusinessType, UseCaseId, TransactionType } from '../../data/types';
import type { Profile } from './UnifiedExperience';
import { USE_CASES } from '../../data/mockData';
import { findSeedProfile } from '../../data/seedProfiles';
import { formatVolume } from '../../utils/pricing';
import styles from './GoalStep.module.css';

const TRANSACTION_TYPES: { id: TransactionType; label: string; description: string; icon: string }[] = [
  {
    id: 'me_to_others',
    label: 'Pay third parties',
    description: 'Pay gig workers, contractors, sellers, or any external recipient',
    icon: '👥',
  },
  {
    id: 'me_to_me',
    label: 'Repatriate funds',
    description: 'Move money to your own bank accounts in another country',
    icon: '🏦',
  },
];

const BUSINESS_TYPES: { id: BusinessType; label: string }[] = [
  { id: 'direct_us', label: 'US Direct' },
  { id: 'direct_uk', label: 'UK Direct' },
  { id: 'connect_platform', label: 'Connect platform' },
];

interface Props {
  profile: Profile;
  onChange: (updated: Profile) => void;
  onApplyCorridors: (corridors: string[]) => void;
  onNext: () => void;
}

export function GoalStep({ profile, onChange, onApplyCorridors, onNext }: Props) {
  const canContinue = profile.transactionType !== null && profile.selectedGoals.length > 0;
  const [seedApplied, setSeedApplied] = useState(false);

  const matchedSeed = findSeedProfile(profile.customerName);

  // Reset applied state when name changes to a non-matching or different match
  useEffect(() => {
    setSeedApplied(false);
  }, [profile.customerName]);

  function applyseed() {
    if (!matchedSeed) return;
    onChange({
      ...profile,
      customerName: matchedSeed.customerName,
      transactionType: matchedSeed.transactionType,
      selectedGoals: matchedSeed.selectedGoals,
      businessType: matchedSeed.businessType,
      monthlyVolume: matchedSeed.monthlyVolume,
      avgPayoutAmount: matchedSeed.avgPayoutAmount,
    });
    onApplyCorridors(matchedSeed.corridors);
    setSeedApplied(true);
  }

  function toggleGoal(id: UseCaseId) {
    onChange({
      ...profile,
      selectedGoals: profile.selectedGoals.includes(id)
        ? profile.selectedGoals.filter((g) => g !== id)
        : [...profile.selectedGoals, id],
    });
  }

  return (
    <div className={styles.step}>

      {/* Optional customer name */}
      <div className={styles.customerRow}>
        <label className={styles.customerLabel} htmlFor="customerName">
          Customer name
          <span className={styles.optional}>optional</span>
        </label>
        <input
          id="customerName"
          className={styles.customerInput}
          type="text"
          placeholder="e.g., Apex Marketplace"
          value={profile.customerName}
          onChange={(e) => onChange({ ...profile, customerName: e.target.value })}
        />
      </div>

      {matchedSeed && !seedApplied && (
        <div className={styles.seedBanner}>
          <div className={styles.seedBannerLeft}>
            <span className={styles.seedBannerIcon}>✦</span>
            <div>
              <div className={styles.seedBannerTitle}>Recognized: {matchedSeed.customerName}</div>
              <div className={styles.seedBannerDesc}>{matchedSeed.tagline}</div>
            </div>
          </div>
          <button className={styles.seedApplyBtn} onClick={applyseed}>
            Apply profile
          </button>
        </div>
      )}

      {seedApplied && (
        <div className={styles.seedApplied}>
          <span>Profile applied for {matchedSeed?.customerName ?? profile.customerName}. Corridors pre-selected on the next step.</span>
        </div>
      )}

      <div className={styles.divider} />

      {/* Section 1: What are you trying to do */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNum}>1</span>
          <div>
            <h2 className={styles.sectionTitle}>What are you trying to do?</h2>
            <p className={styles.sectionDesc}>This affects which products are eligible.</p>
          </div>
        </div>
        <div className={styles.txTypeGrid}>
          {TRANSACTION_TYPES.map((tx) => (
            <button
              key={tx.id}
              className={`${styles.txCard} ${profile.transactionType === tx.id ? styles.txSelected : ''}`}
              onClick={() => onChange({ ...profile, transactionType: tx.id })}
            >
              <span className={styles.txIcon}>{tx.icon}</span>
              <div>
                <div className={styles.txLabel}>{tx.label}</div>
                <div className={styles.txDesc}>{tx.description}</div>
              </div>
            </button>
          ))}
        </div>
        {profile.transactionType === 'me_to_me' && (
          <div className={styles.infoNote}>
            For repatriation, Fiat Global Payouts is the primary option. USDC and Offramp are available but require a crypto wallet or USDC holdings on your end.
          </div>
        )}
      </div>

      <div className={styles.divider} />

      {/* Section 2: What are you trying to solve for (multi-select) */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNum}>2</span>
          <div>
            <h2 className={styles.sectionTitle}>What are you optimizing for?</h2>
            <p className={styles.sectionDesc}>Select all that apply. We'll weight recommendations accordingly.</p>
          </div>
        </div>
        <div className={styles.goalsGrid}>
          {USE_CASES.map((uc) => {
            const isSelected = profile.selectedGoals.includes(uc.id);
            return (
              <button
                key={uc.id}
                className={`${styles.goalCard} ${isSelected ? styles.goalSelected : ''}`}
                onClick={() => toggleGoal(uc.id)}
                aria-pressed={isSelected}
              >
                <div className={styles.goalTop}>
                  <span className={styles.goalIcon}>{uc.icon}</span>
                  {isSelected && (
                    <svg className={styles.goalCheck} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="6" fill="#635bff"/>
                      <path d="M4.5 7l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className={styles.goalLabel}>{uc.label}</span>
                <span className={styles.goalDesc}>{uc.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.divider} />

      {/* Volume sliders */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNum}>3</span>
          <div>
            <h2 className={styles.sectionTitle}>Volume and payout size</h2>
            <p className={styles.sectionDesc}>Used to estimate economics in the results.</p>
          </div>
        </div>

        <div className={styles.slidersGrid}>
          <div className={styles.sliderField}>
            <div className={styles.sliderLabelRow}>
              <label className={styles.sliderLabel} htmlFor="monthlyVol">Monthly payout volume</label>
              <span className={styles.sliderValue}>{formatVolume(profile.monthlyVolume)}</span>
            </div>
            <input
              id="monthlyVol"
              type="range"
              className={styles.slider}
              min={100_000}
              max={100_000_000}
              step={100_000}
              value={profile.monthlyVolume}
              onChange={(e) => onChange({ ...profile, monthlyVolume: parseInt(e.target.value) })}
            />
            <div className={styles.sliderRange}><span>$100K</span><span>$100M</span></div>
          </div>

          <div className={styles.sliderField}>
            <div className={styles.sliderLabelRow}>
              <label className={styles.sliderLabel} htmlFor="avgPayout">Avg payout amount</label>
              <span className={styles.sliderValue}>${profile.avgPayoutAmount}</span>
            </div>
            <input
              id="avgPayout"
              type="range"
              className={styles.slider}
              min={10}
              max={10_000}
              step={10}
              value={profile.avgPayoutAmount}
              onChange={(e) => onChange({ ...profile, avgPayoutAmount: parseInt(e.target.value) })}
            />
            <div className={styles.sliderRange}><span>$10</span><span>$10,000</span></div>
          </div>
        </div>

        <div className={styles.volumeStats}>
          <div className={styles.volumeStat}>
            <span className={styles.volumeStatLabel}>Est. monthly payouts</span>
            <span className={styles.volumeStatValue}>
              ~{Math.round(profile.monthlyVolume / profile.avgPayoutAmount).toLocaleString()}
            </span>
          </div>
          <div className={styles.volumeStat}>
            <span className={styles.volumeStatLabel}>Volume tier</span>
            <span className={styles.volumeStatValue}>
              {profile.monthlyVolume >= 50_000_000 ? '$50M+' :
               profile.monthlyVolume >= 10_000_000 ? '$10M-$50M' :
               profile.monthlyVolume >= 1_000_000 ? '$1M-$10M' : 'Under $1M'}
            </span>
          </div>
        </div>

        {/* Business type — smaller, at the bottom */}
        <div className={styles.businessTypeRow}>
          <span className={styles.btRowLabel}>Sender eligibility</span>
          <div className={styles.btButtons}>
            {BUSINESS_TYPES.map((bt) => (
              <button
                key={bt.id}
                className={`${styles.btBtn} ${profile.businessType === bt.id ? styles.btSelected : ''}`}
                onClick={() => onChange({ ...profile, businessType: bt.id })}
              >
                {bt.label}
              </button>
            ))}
          </div>
          {profile.businessType === 'connect_platform' && (
            <span className={styles.btNote}>Connect platforms can only use Fiat Global Payouts.</span>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.nextBtn} onClick={onNext} disabled={!canContinue}>
          Choose corridors
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {!canContinue && (
          <span className={styles.hint}>Select what you're optimizing for to continue</span>
        )}
      </div>
    </div>
  );
}
