import { useState } from 'react';
import useDrillSession from '../../hooks/useDrillSession';
import DrillSetup from './DrillSetup';
import DrillSession from './DrillSession';
import DrillResult from './DrillResult';
import CalcTrainer from './CalcTrainer';
import styles from './DrillPage.module.css';

const MODES = [
  { id: 'calc', label: 'Calculation Trainer' },
  { id: 'scenario', label: 'Scenario Drills' },
];

export default function DrillPage({ selectedGame }) {
  const [mode, setMode] = useState('calc');
  const session = useDrillSession();

  // Scenario drills in progress — don't show mode tabs
  if (mode === 'scenario' && session.phase !== 'setup') {
    if (session.phase === 'finished') {
      return <DrillResult answers={session.answers} onReset={session.resetSession} />;
    }
    return <DrillSession session={session} />;
  }

  return (
    <div>
      <div className={styles.modeTabs}>
        {MODES.map(m => (
          <button
            key={m.id}
            className={`${styles.modeTab} ${mode === m.id ? styles.modeActive : ''}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'calc' ? (
        <CalcTrainer />
      ) : (
        <DrillSetup selectedGame={selectedGame} onStart={(config) => {
          session.startSession(config);
        }} />
      )}
    </div>
  );
}
