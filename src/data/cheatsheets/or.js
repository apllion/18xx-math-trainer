const orItems = [
  {
    title: 'Lay Track',
    formula: '1-2 yellow tiles, or 1 upgrade per OR',
    note: 'Must be connected to existing track or home station. Green replaces yellow, brown replaces green.',
    gameTips: {
      '1846': 'Two tile lays per turn. Private companies grant extra lays.',
      '1830': 'One tile lay OR one upgrade per turn.',
    },
  },
  {
    title: 'Place Token',
    formula: 'Cost varies by token slot (see game data)',
    note: 'Tokens block other companies from using that city revenue. First token (home) is free.',
    gameTips: {
      '1889': 'Token costs: free, then ¥40.',
      '1830': 'Token costs: free, $40, $100, $100.',
      '1846': 'Token costs: free, $40, $100, $100.',
    },
  },
  {
    title: 'Run Routes',
    formula: 'Revenue = Sum of city/town values on route',
    note: 'Each train runs a separate route. Routes cannot reuse track. Must include a tokened city.',
    gameTips: {
      '1846': '3/5 and 4/6 trains run the higher number of stops but only count best stops.',
    },
  },
  {
    title: 'Revenue Distribution',
    formula: 'Pay: each share gets Revenue ÷ 10. Withhold: all to treasury.',
    note: 'Paying moves stock right/up. Withholding moves stock left/down. Half-pay in some games.',
    gameTips: {
      '1830': 'No half-pay. Full pay or full withhold only.',
      '1846': 'Half-pay available: half to treasury, half as dividends.',
      '1849': 'No half-pay option.',
    },
  },
  {
    title: 'Buy Trains',
    formula: 'Must own at least 1 train after first route run',
    note: 'Can buy from bank or other companies. New train types can trigger rusting of old trains.',
    gameTips: {
      '1830': 'Can buy one train from bank and one from another company per OR.',
      '1889': 'Similar to 1830 train buying rules.',
    },
  },
  {
    title: 'Emergency Buy',
    formula: 'Shortfall = Train Cost - Company Treasury',
    note: 'President must cover shortfall from personal cash. May need to sell shares (at current price, not moving market).',
    gameTips: {
      '1830': 'President must buy cheapest available train. Can sell shares to raise cash.',
      '1846': 'No emergency buy in 1846 — receivership instead.',
      '1849': 'President pays the difference from personal cash.',
    },
  },
];

export default orItems;
