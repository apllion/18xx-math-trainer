import { pick, randInt } from '../utils/random';

export default function yieldVsJump(gameData, difficulty) {
  const currency = gameData.currency || '$';

  if (difficulty === 'easy') {
    const revenue = pick([40, 60, 80, 100, 120, 150, 200]);
    const shares = 10;
    const perShare = revenue / shares;
    const playerShares = pick([2, 3, 4, 5, 6]);
    const playerPayout = perShare * playerShares;

    return {
      question: `A company earns ${currency}${revenue} and pays dividends. Each share receives ${currency}${perShare}. You hold ${playerShares} shares. How much do you receive?`,
      answer: playerPayout,
      unit: currency,
      hint: `Dividend per share x your shares. Revenue is split equally among all 10 shares.`,
      explanation: `${currency}${perShare}/share x ${playerShares} shares = ${currency}${playerPayout}. The remaining ${currency}${revenue - playerPayout} goes to other shareholders (or the bank for unsold shares).`,
      context: 'When a company pays dividends, its stock price moves right (up) on the market. When it withholds, the stock price moves left (down). Dividends are your primary income in 18xx.',
    };
  }

  if (difficulty === 'medium') {
    const stockPrice = pick([60, 67, 76, 82, 90, 100, 110, 120]);
    const revenue = pick([60, 80, 100, 120, 140, 160, 180, 200]);
    const perShare = revenue / 10;
    const playerShares = pick([3, 4, 5, 6]);
    const playerPayout = perShare * playerShares;
    const shareValueGain = pick([5, 8, 10, 12, 15]);
    const portfolioGain = shareValueGain * playerShares;

    return {
      question: `Stock is at ${currency}${stockPrice}. Company earns ${currency}${revenue} and pays dividends (${currency}${perShare}/share). If paying moves the stock up ${currency}${shareValueGain}, you hold ${playerShares} shares. Compare: cash received vs portfolio value increase.`,
      answer: playerPayout,
      unit: currency,
      hint: 'Cash = per share dividend x your shares. Portfolio gain = price increase x your shares. Both benefit you.',
      explanation: `Cash received: ${currency}${perShare} x ${playerShares} = ${currency}${playerPayout}. Portfolio increase: ${currency}${shareValueGain} x ${playerShares} = ${currency}${portfolioGain}. Total benefit: ${currency}${playerPayout + portfolioGain}. The dividend is immediate cash; the portfolio gain only matters at game end or if you sell.`,
      context: 'Dividends give you liquid cash to invest elsewhere, while stock price increases build your net worth. In the mid-game, cash flexibility often matters more than portfolio value.',
    };
  }

  // Hard: multi-round yield analysis
  const stockPrice = pick([67, 76, 82, 90, 100, 110]);
  const revenue = pick([100, 120, 140, 160, 180, 200, 240]);
  const perShare = revenue / 10;
  const playerShares = pick([4, 5, 6]);
  const rounds = pick([3, 4, 5]);
  const priceJumps = []; // simulated price jumps per round
  let currentPrice = stockPrice;
  for (let i = 0; i < rounds; i++) {
    const jump = pick([5, 8, 10, 10, 12, 15]);
    priceJumps.push(jump);
    currentPrice += jump;
  }

  const totalDividends = perShare * playerShares * rounds;
  const totalPortfolioGain = priceJumps.reduce((s, j) => s + j, 0) * playerShares;
  const finalPrice = stockPrice + priceJumps.reduce((s, j) => s + j, 0);

  return {
    question: `${currency}${stockPrice} stock, ${currency}${revenue} revenue/OR, you hold ${playerShares} shares. Over ${rounds} ORs of paying dividends, what is your total cash received? (Assume revenue stays constant.)`,
    answer: totalDividends,
    unit: currency,
    hint: `Per share per OR: ${currency}${perShare}. Multiply by your shares and number of ORs.`,
    explanation: `Per OR: ${currency}${perShare} x ${playerShares} = ${currency}${perShare * playerShares}. Over ${rounds} ORs: ${currency}${perShare * playerShares} x ${rounds} = ${currency}${totalDividends}. Meanwhile, stock might rise from ${currency}${stockPrice} to ~${currency}${finalPrice}, adding ~${currency}${totalPortfolioGain} in portfolio value.`,
    context: `Total benefit over ${rounds} ORs: ~${currency}${totalDividends + totalPortfolioGain} (${currency}${totalDividends} cash + ~${currency}${totalPortfolioGain} portfolio). Think of dividends as yield — ${currency}${perShare * playerShares} on ${currency}${stockPrice * playerShares} invested = ${((perShare * playerShares) / (stockPrice * playerShares) * 100).toFixed(1)}% per OR.`,
  };
}
