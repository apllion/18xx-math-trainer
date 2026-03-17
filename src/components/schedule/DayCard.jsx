import { useState } from 'react';
import Card from '../shared/Card';
import styles from './DayCard.module.css';

export default function DayCard({ day, isToday, onToggle }) {
  const [showInfo, setShowInfo] = useState(false);

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowInfo((prev) => !prev);
  };

  return (
    <Card
      className={`${styles.card} ${isToday ? styles.today : ''} ${day.completed ? styles.completed : ''}`}
      onClick={onToggle}
    >
      <div className={styles.header}>
        <span className={styles.dayLabel}>{day.label}</span>
        <div className={styles.headerRight}>
          {day.description && (
            <button
              className={`${styles.infoBtn} ${showInfo ? styles.infoBtnActive : ''}`}
              onClick={handleInfoClick}
              title="Show details"
            >
              ⓘ
            </button>
          )}
          <span className={styles.checkmark}>{day.completed ? '✓' : ''}</span>
        </div>
      </div>
      <p className={styles.activity}>{day.activity}</p>
      {showInfo && day.description && (
        <p className={styles.description}>{day.description}</p>
      )}
    </Card>
  );
}
