const endgameItems = [
  {
    title: 'Game End Triggers',
    formula: 'Bank breaks → finish current set of ORs',
    note: 'Game ends at the end of the current OR set when the bank runs out of money.',
    gameTips: {
      '1889': 'Bank size: ¥7,000. Game ends after current OR set.',
      '1830': 'Bank size: $12,000. Can also end when a share hits the top of the stock market.',
      '1846': 'Bank size varies by player count. Ends after current OR.',
      '1849': 'Bank size: varies. Game end triggered by bank break.',
      '18Chesapeake': 'Bank size: $8,000.',
    },
  },
  {
    title: 'Final Scoring',
    formula: 'Score = Cash + Share Values (at current market price)',
    note: 'Each share you hold is worth its current stock price. Cash on hand counts at face value.',
    gameTips: {},
  },
  {
    title: 'Portfolio Valuation',
    formula: 'Share Value = # Shares × Current Stock Price',
    note: 'President\'s cert = 2 shares at current price. Count all companies.',
    gameTips: {},
  },
  {
    title: 'Bank Break Timing',
    formula: 'Track total payouts to estimate remaining ORs',
    note: 'Sum of all dividends paid per OR ≈ drain rate. Bank ÷ drain rate ≈ ORs remaining.',
    gameTips: {
      '1830': 'Typical drain: $800-$2000 per OR in late game.',
      '1889': 'Smaller bank breaks faster. Watch for surprise endings.',
    },
  },
  {
    title: 'Late-Game Strategy',
    formula: 'Maximize: (stock price growth) + (dividend income) per remaining OR',
    note: 'In final rounds, dividend income is guaranteed. Stock price increases are speculative.',
    gameTips: {
      '1830': 'Diesels (D-trains) can massively boost revenue. Time your purchase.',
      '1846': 'Late game 7/8 trains are powerful. Position for them.',
    },
  },
];

export default endgameItems;
