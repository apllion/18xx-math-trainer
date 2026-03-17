import { useState } from 'react';
import useSchedule from '../../hooks/useSchedule';
import DayCard from './DayCard';
import StreakCounter from './StreakCounter';
import Button from '../shared/Button';
import styles from './WeeklySchedule.module.css';

export default function WeeklySchedule() {
  const { currentWeekKey, getWeek, toggleDay, getStreak, navigateWeek } = useSchedule();
  const [weekKey, setWeekKey] = useState(currentWeekKey);
  const week = getWeek(weekKey);
  const streak = getStreak();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Training Schedule</h2>
      <StreakCounter streak={streak} />

      <div className={styles.weekNav}>
        <Button variant="ghost" size="sm" onClick={() => setWeekKey(navigateWeek(weekKey, -1))}>
          ← Prev
        </Button>
        <span className={styles.weekLabel}>
          Week of {new Date(weekKey + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <Button variant="ghost" size="sm" onClick={() => setWeekKey(navigateWeek(weekKey, 1))}>
          Next →
        </Button>
      </div>

      <div className={styles.dayGrid}>
        {week.days.map((day, i) => (
          <DayCard
            key={i}
            day={day}
            isToday={weekKey === currentWeekKey && new Date().getDay() === (i === 6 ? 0 : i + 1)}
            onToggle={() => toggleDay(weekKey, i)}
          />
        ))}
      </div>
    </div>
  );
}
