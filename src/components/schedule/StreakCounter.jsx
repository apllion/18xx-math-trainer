import styles from './StreakCounter.module.css';

export default function StreakCounter({ streak }) {
  return (
    <div className={styles.streak}>
      <span className={styles.flame}>🔥</span>
      <span className={styles.count}>{streak}</span>
      <span className={styles.label}>day streak</span>
    </div>
  );
}
