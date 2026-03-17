const srItems = [
  {
    title: 'Par Value Selection',
    formula: 'Initial Treasury = Par × Shares Sold (to float)',
    note: 'Choose par to balance treasury size vs share affordability. Higher par = more treasury but fewer players can buy in.',
    gameTips: {
      '1889': '50% float — 5 shares to float. Par range: ¥65-¥100.',
      '1830': '60% float — 6 shares to float. Par range: $67-$100.',
      '1846': '20% float (incremental cap) — 2 shares to float. Treasury grows as shares sell.',
      '1849': 'No fixed par values — stock price set by initial auction.',
      '18Chesapeake': '50% float — 5 shares to float. Par range: $50-$100.',
    },
  },
  {
    title: 'Float Cost',
    formula: 'Float Cost = Par Value × Shares to Float',
    note: 'Total cash players must invest to get a company running.',
    gameTips: {
      '1889': 'Float cost = Par × 5 (50% of 10 shares)',
      '1830': 'Float cost = Par × 6 (60% of 10 shares)',
      '1846': 'Float cost = Par × 2 (20%, incremental)',
      '1849': 'Float cost = auction price × shares needed (60%)',
      '18Chesapeake': 'Float cost = Par × 5 (50% of 10 shares)',
    },
  },
  {
    title: 'Share Limit',
    formula: 'Max shares per player = 60% (usually)',
    note: 'Cannot buy beyond cert limit. President\'s cert counts as 2 shares (20%).',
    gameTips: {
      '1889': '60% limit, cert limit varies by player count.',
      '1830': '60% limit. Certificate limit: 2p=28, 3p=20, 4p=16, 5p=13, 6p=11.',
      '1846': '60% limit per company.',
      '1849': '60% limit.',
      '18Chesapeake': '60% limit. Cert limits similar to 1830.',
    },
  },
  {
    title: 'Market Cap',
    formula: 'Market Cap = Share Price × 10',
    note: 'Total company value if all shares sold at current price.',
    gameTips: {},
  },
  {
    title: 'Sell Restrictions',
    formula: 'Cannot sell shares in SR you bought them',
    note: 'First stock round of the game: no sells. Cannot sell president\'s share unless someone else holds enough to take over.',
    gameTips: {
      '1830': 'Can sell in same round you bought (after first SR). Can cause presidency changes.',
      '1846': 'Cannot sell shares until company has operated.',
    },
  },
  {
    title: 'Priority Deal',
    formula: 'Goes to player on left of last buyer',
    note: 'In a tie, priority is decisive. Worth tracking.',
    gameTips: {},
  },
];

export default srItems;
