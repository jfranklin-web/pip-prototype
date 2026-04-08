import { useState } from 'react';
import { UnifiedExperience } from './experiences/unified/UnifiedExperience';
import { AboutModal } from './components/AboutModal';
import { ChangelogModal } from './components/ChangelogModal';

export function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  return (
    <>
      <UnifiedExperience
        onShowAbout={() => setShowAbout(true)}
        onShowChangelog={() => setShowChangelog(true)}
      />
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </>
  );
}
