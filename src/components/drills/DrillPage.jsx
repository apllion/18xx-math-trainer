import useDrillSession from '../../hooks/useDrillSession';
import DrillSetup from './DrillSetup';
import DrillSession from './DrillSession';
import DrillResult from './DrillResult';

export default function DrillPage({ selectedGame }) {
  const session = useDrillSession();

  if (session.phase === 'setup') {
    return <DrillSetup selectedGame={selectedGame} onStart={(config) => {
      session.startSession(config);
    }} />;
  }

  if (session.phase === 'finished') {
    return <DrillResult answers={session.answers} onReset={session.resetSession} />;
  }

  return <DrillSession session={session} />;
}
