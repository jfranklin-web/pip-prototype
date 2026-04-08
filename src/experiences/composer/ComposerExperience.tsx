import { useState } from 'react';
import type { BusinessType, ProductId } from '../../data/types';
import { ProtoHeader } from '../../components/ProtoHeader';
import { Footer } from '../../components/Footer';
import { CustomerStep } from './CustomerStep';
import { CorridorProductStep } from './CorridorProductStep';
import { DealSummary } from './DealSummary';
import styles from './ComposerExperience.module.css';

type Step = 1 | 2 | 3;

export interface CorridorDeal {
  corridorId: string;
  productId: ProductId;
  customPrice: number;       // per $100 payout
  discountNote: string;
}

export interface CustomerProfile {
  customerName: string;
  businessType: BusinessType;
  monthlyVolume: number;     // $
  avgPayoutAmount: number;   // $
}

interface Props {
  onBack: () => void;
  onShowAbout: () => void;
  onShowChangelog: () => void;
}

export function ComposerExperience({ onBack, onShowAbout, onShowChangelog }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [customer, setCustomer] = useState<CustomerProfile>({
    customerName: '',
    businessType: 'direct_us',
    monthlyVolume: 1_000_000,
    avgPayoutAmount: 100,
  });
  const [corridorDeals, setCorridorDeals] = useState<CorridorDeal[]>([]);

  const STEP_LABELS = ['Customer', 'Corridors + pricing', 'Deal summary'];

  function updateCorridorDeal(corridorId: string, patch: Partial<CorridorDeal>) {
    setCorridorDeals((prev) => {
      const idx = prev.findIndex((d) => d.corridorId === corridorId);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  }

  function addCorridor(deal: CorridorDeal) {
    setCorridorDeals((prev) => [...prev, deal]);
  }

  function removeCorridor(corridorId: string) {
    setCorridorDeals((prev) => prev.filter((d) => d.corridorId !== corridorId));
  }

  return (
    <div className={styles.page}>
      <ProtoHeader onBack={onBack} />

      <div className={styles.progressBar}>
        {STEP_LABELS.map((label, i) => {
          const stepNum = (i + 1) as Step;
          const isDone = step > stepNum;
          const isActive = step === stepNum;
          return (
            <div key={i} className={styles.progressStep}>
              <div className={`${styles.stepDot} ${isDone ? styles.stepDone : ''} ${isActive ? styles.stepActive : ''}`}>
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : stepNum}
              </div>
              <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}>{label}</span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`${styles.stepConnector} ${isDone ? styles.stepConnectorDone : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      <main className={styles.main}>
        {step === 1 && (
          <CustomerStep
            customer={customer}
            onChange={setCustomer}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <CorridorProductStep
            customer={customer}
            corridorDeals={corridorDeals}
            onAdd={addCorridor}
            onUpdate={updateCorridorDeal}
            onRemove={removeCorridor}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <DealSummary
            customer={customer}
            corridorDeals={corridorDeals}
            onBack={() => setStep(2)}
            onStartOver={() => {
              setStep(1);
              setCorridorDeals([]);
            }}
          />
        )}
      </main>

      <Footer onShowAbout={onShowAbout} onShowChangelog={onShowChangelog} />
    </div>
  );
}
