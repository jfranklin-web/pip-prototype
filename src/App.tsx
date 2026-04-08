import { useState } from 'react';
import { Launcher } from './launcher/Launcher';
import { AdvisorExperience } from './experiences/advisor/AdvisorExperience';
import { ComposerExperience } from './experiences/composer/ComposerExperience';
import { AboutModal } from './components/AboutModal';
import { ChangelogModal } from './components/ChangelogModal';

type View = 'launcher' | 'advisor' | 'composer';

export function App() {
  const [view, setView] = useState<View>('launcher');
  const [showAbout, setShowAbout] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  return (
    <>
      {view === 'launcher' && (
        <Launcher
          onLaunch={setView}
          onShowAbout={() => setShowAbout(true)}
          onShowChangelog={() => setShowChangelog(true)}
        />
      )}
      {view === 'advisor' && (
        <AdvisorExperience
          onBack={() => setView('launcher')}
          onShowAbout={() => setShowAbout(true)}
          onShowChangelog={() => setShowChangelog(true)}
        />
      )}
      {view === 'composer' && (
        <ComposerExperience
          onBack={() => setView('launcher')}
          onShowAbout={() => setShowAbout(true)}
          onShowChangelog={() => setShowChangelog(true)}
        />
      )}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </>
  );
}
