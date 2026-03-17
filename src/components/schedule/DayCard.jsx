import Card from '../shared/Card';
import styles from './DayCard.module.css';

export default function DayCard({ day, isToday, onToggle }) {
  return (
    <Card
      className={`${styles.card} ${isToday ? styles.today : ''} ${day.completed ? styles.completed : ''}`}
      onClick={onToggle}
    >
      <div className={styles.header}>
        <span className={styles.dayLabel}>{day.label}</span>
        <span className={styles.checkmark}>{day.completed ? '✓' : ''}</span>
      </div>
      <p className={styles.activity}>{day.activity}</p>
    </Card>
  );
}
