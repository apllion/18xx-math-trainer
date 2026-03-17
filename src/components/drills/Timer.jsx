import { formatTime } from '../../utils/format';
import styles from './Timer.module.css';

export default function Timer({ remaining, isRunning, onToggle }) {
  const isLow = remaining <= 60;
  return (
    <div className={`${styles.timer} ${isLow ? styles.low : ''}`}>
      <span className={styles.time}>{formatTime(remaining)}</span>
      <button className={styles.toggleBtn} onClick={onToggle}>
        {isRunning ? '\u23F8' : '\u25B6'}
      </button>
    </div>
  );
}
