const drillTypes = [
  { id: 'marketCap', name: 'Market Cap', description: 'Calculate company market capitalization from stock price', category: 'valuation' },
  { id: 'parValue', name: 'Par Value Decision', description: 'Choose optimal par value given cash and strategy', category: 'stock' },
  { id: 'rustHorizon', name: 'Rust Horizon', description: 'Predict when trains will rust based on purchase patterns', category: 'trains' },
  { id: 'liquidation', name: 'Liquidation Value', description: 'Calculate total company asset value', category: 'valuation' },
  { id: 'yieldVsJump', name: 'Yield vs Stock Jump', description: 'Compare dividend income vs stock price appreciation', category: 'stock' },
  { id: 'portfolioConcentration', name: 'Portfolio Concentration', description: 'Analyze portfolio diversification and risk', category: 'stock' },
  { id: 'trainRush', name: 'Train Rush Clock', description: 'Calculate cash needed for next train purchase', category: 'trains' },
  { id: 'emergencyBuy', name: 'Emergency Buy', description: 'Calculate president out-of-pocket for mandatory train', category: 'trains' },
  { id: 'tokenROI', name: 'Token ROI', description: 'Evaluate token placement return on investment', category: 'operations' },
  { id: 'withholdRatio', name: 'Withhold Ratio', description: 'Compare withholding vs paying dividends', category: 'operations' },
];

export default drillTypes;

export function getDrillTypesByCategory() {
  const categories = {};
  for (const dt of drillTypes) {
    if (!categories[dt.category]) categories[dt.category] = [];
    categories[dt.category].push(dt);
  }
  return categories;
}
