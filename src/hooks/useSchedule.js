import useLocalStorage from './useLocalStorage';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_ACTIVITIES = [
  {
    name: 'Mental Math Drills',
    description: 'Market cap, emergency buy, and withhold ratio calculations. Focus on speed — aim for under 10 seconds per question.',
  },
  {
    name: 'Stock Valuation Drills',
    description: 'Par value decisions, portfolio concentration, and yield vs stock jump analysis. Practice comparing investment alternatives.',
  },
  {
    name: 'Route Optimization Drills',
    description: 'Train rush clock, token ROI, and liquidation value problems. Build intuition for operating round decisions.',
  },
  {
    name: 'Game Analysis',
    description: 'Study a recorded game (yours or online). Identify the inflection point, trace train timing, and note key stock round decisions.',
  },
  {
    name: 'Puzzle Scenarios',
    description: 'Work through "what would you do?" positions: forced train buys, dump timing, end-game portfolio optimization.',
  },
  {
    name: 'Live Play / Practice',
    description: 'Play a full game (in person or on 18xx.games). Focus on applying one concept from this week\'s drills.',
  },
  {
    name: 'Post-Mortem Review',
    description: 'Write up your game from Saturday. Identify your biggest mistake, the key turning point, and one lesson to carry forward.',
  },
];

function getWeekKey(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function createWeek(weekKey) {
  return {
    weekKey,
    days: DAY_LABELS.map((label, i) => ({
      label,
      activity: DAY_ACTIVITIES[i].name,
      description: DAY_ACTIVITIES[i].description,
      completed: false,
    })),
  };
}

export default function useSchedule() {
  const [scheduleData, setScheduleData] = useLocalStorage('schedule', {});

  const currentWeekKey = getWeekKey(new Date());

  function getWeek(weekKey = currentWeekKey) {
    return scheduleData[weekKey] || createWeek(weekKey);
  }

  function toggleDay(weekKey, dayIndex) {
    setScheduleData((prev) => {
      const week = prev[weekKey] || createWeek(weekKey);
      const days = [...week.days];
      days[dayIndex] = { ...days[dayIndex], completed: !days[dayIndex].completed };
      return { ...prev, [weekKey]: { ...week, days } };
    });
  }

  function getStreak() {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const wk = getWeekKey(d);
      const dayOfWeek = (d.getDay() + 6) % 7; // 0=Mon
      const week = scheduleData[wk];
      if (week && week.days[dayOfWeek]?.completed) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }

  function navigateWeek(weekKey, direction) {
    const d = new Date(weekKey);
    d.setDate(d.getDate() + direction * 7);
    return d.toISOString().slice(0, 10);
  }

  return {
    currentWeekKey,
    getWeek,
    toggleDay,
    getStreak,
    navigateWeek,
    DAY_LABELS,
  };
}
