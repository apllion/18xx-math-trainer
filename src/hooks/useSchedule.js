import useLocalStorage from './useLocalStorage';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_ACTIVITIES = [
  {
    name: 'SR Math Drills',
    description: 'Stock Round calculations (20 min).\n\n' +
      '• Par Value Decision: Given your cash after privates, find the highest par that still leaves you ~$15-20 pocket change for a synergy share.\n' +
      '• Market Cap: Share Price × 10. Compare to Treasury + Train value — if Market Cap >> assets, the stock is overvalued.\n' +
      '• Portfolio Concentration: (Value of shares in Company A) ÷ Total Net Worth. If any company is >60%, calculate cost of diversifying.\n' +
      '• Dump Protection: Can any rival afford 50% of your company? Check their Cash + (Shares × Price).\n' +
      '• Yield vs Stock Jump: Compare (Dividend × Your Shares) vs buying another share at current price.',
  },
  {
    name: 'OR Math Drills',
    description: 'Operating Round calculations (20 min).\n\n' +
      '• Rust Horizon: Count trains remaining in bank ÷ companies acting before you. If your trains rust before you run them, plan an E-buy.\n' +
      '• Withhold Ratio: Retained Earnings ÷ Stock Price Drop. Only withhold if the train you buy earns more than the Net Worth you lose.\n' +
      '• Emergency Buy: Train Cost - Treasury = your personal contribution. Never E-buy a train that will rust — aim for permanents (5/6/D).\n' +
      '• Token ROI: Token Cost ÷ Added Revenue per run = ORs to break even. If game ends sooner, skip the token.',
  },
  {
    name: 'End-Game Drills',
    description: 'Liquidation phase calculations (20 min).\n\n' +
      '• Net Worth Snap: For each player, calculate Cash + (Shares × Current Price) in under 60 seconds.\n' +
      '• Final Payout: Expected Dividend × Remaining ORs. High-dividend low-price stock often beats low-dividend high-price.\n' +
      '• Last Sell Check: Is selling a share for $X now better than holding for a final $Y dividend if the price will crater?\n' +
      '• Bank Break Timing: Sum of all dividends per OR ≈ drain rate. Bank ÷ drain rate ≈ ORs remaining.',
  },
  {
    name: 'Game Analysis',
    description: 'Watch/study a pro game (30 min).\n\n' +
      '• Watch a high-level game on 18xx.games or a streamed final.\n' +
      '• Track the Priority Deal — why did the expert Pass instead of buying? Usually to manipulate who starts the next SR.\n' +
      '• Find the "Infection Point" — the exact turn where the winner\'s trajectory separated from the pack.\n' +
      '• Was it a train purchase? A stock dump? A specific tile lay?',
  },
  {
    name: 'Puzzle Scenarios',
    description: 'Map and position puzzles (30 min).\n\n' +
      '• Take a company and visualize its optimal route at 5-train/6-train level.\n' +
      '• Place two enemy tokens in the worst spots — find your Plan B route using 80% of the same track.\n' +
      '• "Next Buyer" Lookahead: If you buy a train, who is forced to buy next and trigger rusting? If it\'s your rival, buy. If it\'s you, wait.\n' +
      '• Liquidation Check: Pick an opponent, calculate their Shares × Price + Cash in under 60 seconds.',
  },
  {
    name: 'Live Play',
    description: 'Play one full game (3 hours).\n\n' +
      '• Use 18xx.games for a live (not async) match to practice under time pressure.\n' +
      '• Pick ONE expert goal: "Hold max 50% of any company" or "Force a train rush by turn 4."\n' +
      '• Winning is secondary — test a specific mechanic from this week\'s drills.\n' +
      '• During play, practice the calculations from Mon-Wed until they become reflexive.',
  },
  {
    name: 'Post-Mortem',
    description: 'Analyze Saturday\'s game (1.5 hours).\n\n' +
      '• Look at the final stock chart. Find where the winner\'s line spiked.\n' +
      '• Check every train you bought: Revenue × Runs it made vs Cost. Did each train pay for itself?\n' +
      '• A 4-train for $300 that ran 3 times at $40 = $120 return = $180 loss. This is the #1 medium-player mistake.\n' +
      '• Write up: inflection point, biggest mistake, one lesson to carry forward.',
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
    const stored = scheduleData[weekKey];
    if (!stored) return createWeek(weekKey);
    // Merge latest activity names and descriptions onto stored data
    return {
      ...stored,
      days: stored.days.map((day, i) => ({
        ...day,
        activity: DAY_ACTIVITIES[i].name,
        description: DAY_ACTIVITIES[i].description,
      })),
    };
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
