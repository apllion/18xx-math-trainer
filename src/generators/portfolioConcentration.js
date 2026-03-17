import { pick, randInt } from '../utils/random';

export default function portfolioConcentration(gameData, difficulty) {
  const currency = gameData.currency || '$';
  const companies = gameData.companies;

  if (difficulty === 'easy') {
    const numCompanies = pick([2, 3]);
    const holdings = [];
    let totalValue = 0;

    for (let i = 0; i < numCompanies; i++) {
      const shares = pick([1, 2, 3, 4]);
      const price = pick([50, 60, 70, 80, 90, 100]);
      const value = shares * price;
      holdings.push({
        company: companies[i % companies.length].abbr,
        shares,
        price,
        value,
      });
      totalValue += value;
    }

    const targetHolding = holdings[0];
    const percentage = Math.round((targetHolding.value / totalValue) * 100);

    const holdingsList = holdings
      .map(h => `${h.shares} shares of ${h.company} at ${currency}${h.price}`)
      .join(', ');

    return {
      question: `Your portfolio: ${holdingsList}. What percentage of your portfolio is in ${targetHolding.company}?`,
      answer: percentage,
      unit: '%',
      hint: `Calculate each holding's value (shares x price), sum them, then divide ${targetHolding.company}'s value by the total.`,
      explanation: `${holdings.map(h => `${h.company}: ${h.shares} x ${currency}${h.price} = ${currency}${h.value}`).join('. ')}. Total: ${currency}${totalValue}. ${targetHolding.company}: ${currency}${targetHolding.value}/${currency}${totalValue} = ${percentage}%.`,
      context: 'Portfolio concentration is risky in 18xx. If one company gets dumped on you or its stock crashes, a concentrated portfolio takes a huge hit. Diversification protects against other players\' actions.',
    };
  }

  if (difficulty === 'medium') {
    const numCompanies = pick([4, 5]);
    const holdings = [];
    let totalValue = 0;

    for (let i = 0; i < numCompanies; i++) {
      const shares = randInt(1, 5);
      const price = pick([55, 65, 70, 76, 82, 90, 100, 110, 120]);
      const value = shares * price;
      holdings.push({
        company: companies[i % companies.length].abbr,
        shares,
        price,
        value,
      });
      totalValue += value;
    }

    const sorted = [...holdings].sort((a, b) => b.value - a.value);
    const topHolding = sorted[0];
    const percentage = Math.round((topHolding.value / totalValue) * 100);

    const holdingsList = holdings
      .map(h => `${h.company}: ${h.shares}@${currency}${h.price}`)
      .join(', ');

    return {
      question: `Portfolio: ${holdingsList}. Which company is your largest holding, and what percentage of your portfolio does it represent?`,
      answer: percentage,
      unit: '%',
      hint: 'Calculate each holding value, find the largest, then compute its share of the total.',
      explanation: `Values: ${holdings.map(h => `${h.company}: ${currency}${h.value}`).join(', ')}. Total: ${currency}${totalValue}. Largest: ${topHolding.company} at ${currency}${topHolding.value} = ${percentage}% of portfolio.`,
      context: `A rule of thumb: if any single company is more than 40% of your portfolio, you're heavily exposed. Other players can manipulate that company's stock to hurt you.`,
    };
  }

  // Hard: include privates and cash in net worth calculation
  const numCompanies = pick([3, 4, 5]);
  const holdings = [];
  let stockValue = 0;

  for (let i = 0; i < numCompanies; i++) {
    const shares = randInt(1, 6);
    const price = pick([55, 67, 76, 82, 90, 100, 110, 120, 135]);
    const value = shares * price;
    holdings.push({
      company: companies[i % companies.length].abbr,
      shares,
      price,
      value,
    });
    stockValue += value;
  }

  const numPrivates = randInt(1, 2);
  const playerPrivates = [];
  let privateValue = 0;
  for (let i = 0; i < numPrivates; i++) {
    const priv = gameData.privates[i % gameData.privates.length];
    playerPrivates.push(priv);
    privateValue += priv.cost;
  }

  const cash = randInt(5, 30) * 10;
  const totalNetWorth = stockValue + privateValue + cash;
  const sorted = [...holdings].sort((a, b) => b.value - a.value);
  const topHolding = sorted[0];
  const percentage = Math.round((topHolding.value / totalNetWorth) * 100);

  const holdingsList = holdings
    .map(h => `${h.company}: ${h.shares}@${currency}${h.price}`)
    .join(', ');
  const privatesList = playerPrivates
    .map(p => `${p.name} (${currency}${p.cost})`)
    .join(', ');

  return {
    question: `Portfolio: ${holdingsList}. Privates: ${privatesList}. Cash: ${currency}${cash}. What is your total net worth, and what percentage is your largest stock holding?`,
    answer: totalNetWorth,
    unit: currency,
    hint: 'Net worth = all stock values + private face values + cash. Then find the largest stock holding as a percentage of net worth.',
    explanation: `Stocks: ${currency}${stockValue}. Privates: ${currency}${privateValue}. Cash: ${currency}${cash}. Net worth: ${currency}${totalNetWorth}. Largest holding: ${topHolding.company} at ${currency}${topHolding.value} = ${percentage}% of net worth.`,
    context: `Including cash and privates gives the full picture. At ${percentage}% concentration in ${topHolding.company}, you are ${percentage > 40 ? 'heavily exposed — consider diversifying' : percentage > 25 ? 'moderately concentrated — acceptable if the company is strong' : 'well diversified'}.`,
  };
}
