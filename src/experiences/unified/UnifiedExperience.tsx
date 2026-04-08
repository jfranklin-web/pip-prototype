import { useState } from 'react';
import type { BusinessType, UseCaseId, TransactionType } from '../../data/types';
import { ProtoHeader } from '../../components/ProtoHeader';
import { Footer } from '../../components/Footer';
import { GoalStep } from './GoalStep';
import { CorridorStep } from './CorridorStep';
import { ResultsStep } from './ResultsStep';
import styles from './UnifiedExperience.module.css';

type Step = 1 | 2 | 3;

export interface Profile {
  customerName: string;
  transactionType: TransactionType;
  selectedGoals: UseCaseId[];
  businessType: BusinessType;
  monthlyVolume: number;
  avgPayoutAmount: number;
}

interface Props {
  onShowAbout: () => void;
  onShowChangelog: () => void;
}

const STEP_LABELS = ['Your goals', 'Corridors', 'Results'];

export function UnifiedExperience({ onShowAbout, onShowChangelog }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [profile, setProfile] = useState<Profile>({
    customerName: '',
    transactionType: 'me_to_others',
    selectedGoals: [],
    businessType: 'direct_us',
    monthlyVolume: 1_000_000,
    avgPayoutAmount: 100,
  });
  const [selectedCorridors, setSelectedCorridors] = useState<string[]>([]);

  function toggleCorridor(id: string) {
    setSelectedCorridors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  return (
    <div className={styles.page}>
      <ProtoHeader />

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
          <GoalStep
            profile={profile}
            onChange={setProfile}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <CorridorStep
            selectedCorridors={selectedCorridors}
            onToggle={toggleCorridor}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <ResultsStep
            profile={profile}
            selectedCorridors={selectedCorridors}
            onBack={() => setStep(2)}
            onStartOver={() => { setStep(1); setSelectedCorridors([]); }}
          />
        )}
      </main>

      <Footer onShowAbout={onShowAbout} onShowChangelog={onShowChangelog} />
    </div>
  );
}
