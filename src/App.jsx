import { useState } from 'react';
import AppShell from './components/layout/AppShell';
import AppRoutes from './routes';

export default function App() {
  const [selectedGame, setSelectedGame] = useState('1889');

  return (
    <AppShell selectedGame={selectedGame} onGameChange={setSelectedGame}>
      <AppRoutes selectedGame={selectedGame} />
    </AppShell>
  );
}
