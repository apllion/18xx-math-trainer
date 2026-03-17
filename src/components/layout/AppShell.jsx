import Header from './Header';
import BottomNav from './BottomNav';
import styles from './AppShell.module.css';

export default function AppShell({ children, selectedGame, onGameChange }) {
  return (
    <div className={styles.shell}>
      <Header selectedGame={selectedGame} onGameChange={onGameChange} />
      <main className={styles.main}>{children}</main>
      <BottomNav />
    </div>
  );
}
