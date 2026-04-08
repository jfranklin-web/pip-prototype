import { useState } from 'react';
import type { UseCaseId, BusinessType } from '../../data/types';
import { ProtoHeader } from '../../components/ProtoHeader';
import { Footer } from '../../components/Footer';
import { UseCaseStep } from './UseCaseStep';
import { CorridorStep } from './CorridorStep';
import { ResultsStep } from './ResultsStep';
import styles from './AdvisorExperience.module.css';

type Step = 1 | 2 | 3;

interface Props {
  onBack: () => void;
  onShowAbout: () => void;
  onShowChangelog: () => void;
}

export function AdvisorExperience({ onBack, onShowAbout, onShowChangelog }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseId | null>(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType>('direct_us');
  const [selectedCorridors, setSelectedCorridors] = useState<string[]>([]);

  const STEP_LABELS = ['Your goal', 'Corridors', 'Results'];

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
              <div
                className={`${styles.stepDot} ${isDone ? styles.stepDone : ''} ${isActive ? styles.stepActive : ''}`}
              >
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  stepNum
                )}
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
          <UseCaseStep
            selectedUseCase={selectedUseCase}
            selectedBusinessType={selectedBusinessType}
            onSelectUseCase={setSelectedUseCase}
            onSelectBusinessType={setSelectedBusinessType}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <CorridorStep
            selectedCorridors={selectedCorridors}
            onToggleCorridor={(id) =>
              setSelectedCorridors((prev) =>
                prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
              )
            }
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <ResultsStep
            selectedUseCase={selectedUseCase!}
            selectedBusinessType={selectedBusinessType}
            selectedCorridors={selectedCorridors}
            onBack={() => setStep(2)}
            onStartOver={() => {
              setStep(1);
              setSelectedUseCase(null);
              setSelectedCorridors([]);
            }}
          />
        )}
      </main>

      <Footer onShowAbout={onShowAbout} onShowChangelog={onShowChangelog} />
    </div>
  );
}
