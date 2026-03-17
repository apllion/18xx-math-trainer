import GameSelector from '../shared/GameSelector';
import styles from './Header.module.css';

export default function Header({ selectedGame, onGameChange }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>18xx Trainer</h1>
      <GameSelector value={selectedGame} onChange={onGameChange} />
    </header>
  );
}
