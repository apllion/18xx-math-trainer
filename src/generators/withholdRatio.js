import { pick, randInt } from '../utils/random';

export default function withholdRatio(gameData, difficulty) {
  const currency = gameData.currency || '$';
  const company = pick(gameData.companies);

  if (difficulty === 'easy') {
    const revenue = pick([60, 80, 100, 120, 140, 160, 200]);

    return {
      question: `${company.abbr} earns ${currency}${revenue} this OR and decides to withhold. How much goes into the company treasury?`,
      answer: revenue,
      unit: currency,
      hint: 'When a company withholds, 100% of revenue stays in the treasury.',
      explanation: `All ${currency}${revenue} stays in the company treasury. No dividends are paid to shareholders. The stock price will move left (down) on the stock market as a penalty for withholding.`,
      context: 'Withholding is necessary when a company needs to save for a train or other major purchase. But it costs you — the stock drops, and shareholders receive nothing.',
    };
  }

  if (difficulty === 'medium') {
    const revenue = pick([80, 100, 120, 140, 160, 180, 200, 240]);
    const stockPrice = pick([60, 67, 76, 82, 90, 100, 110]);
    const playerShares = pick([3, 4, 5, 6]);
    const perShare = revenue / 10;
    const playerDividend = perShare * playerShares;

    // Withhold drops stock, pay raises it
    const withholdDrop = pick([5, 8, 10, 12]);
    const payRise = pick([5, 8, 10, 12]);
    const priceDifference = withholdDrop + payRise; // swing between the two outcomes
    const portfolioSwing = priceDifference * playerShares;

    const payBenefit = playerDividend + (payRise * playerShares);
    const totalSwing = playerDividend + portfolioSwing; // dividends gained + full price swing (rise avoided loss + drop)

    return {
      question: `${company.abbr} at ${currency}${stockPrice} earns ${currency}${revenue}. You hold ${playerShares} shares. Paying: stock rises ${currency}${payRise}, you get ${currency}${perShare}/share. Withholding: stock drops ${currency}${withholdDrop}. What is the total swing in your personal wealth between paying vs withholding?`,
      answer: totalSwing,
      unit: currency,
      hint: 'Pay benefit = dividend income + portfolio gain from price rise. Compare against withholding where you get neither AND lose portfolio value.',
      explanation: `Paying: Dividends ${currency}${perShare} x ${playerShares} = ${currency}${playerDividend}. Portfolio gain: ${currency}${payRise} x ${playerShares} = ${currency}${payRise * playerShares}. Total pay benefit: ${currency}${payBenefit}. Withholding costs you ${currency}${playerDividend} in dividends PLUS ${currency}${portfolioSwing} in portfolio swing (price drops instead of rising). Total personal swing: ${currency}${playerDividend + portfolioSwing}.`,
      context: 'The decision to withhold vs pay is always personal vs corporate. Withholding helps the company but hurts the shareholders. As president, you must weigh your own interests against the company\'s needs.',
    };
  }

  // Hard: multi-round analysis
  const revenue = pick([120, 140, 160, 180, 200, 240]);
  const stockPrice = pick([67, 76, 82, 90, 100]);
  const treasury = randInt(2, 10) * 10;
  const targetTrain = pick(gameData.trains.slice(2, 5));
  const trainCost = targetTrain.cost;
  const playerShares = pick([4, 5, 6]);
  const perShare = revenue / 10;

  // How many ORs of withholding to afford the train?
  const cashNeeded = trainCost - treasury;
  const orsToWithhold = Math.ceil(cashNeeded / revenue);
  const dividendsLost = perShare * playerShares * orsToWithhold;
  const priceDropPerOR = pick([5, 8, 10]);
  const totalPriceDrop = priceDropPerOR * orsToWithhold;
  const portfolioLoss = totalPriceDrop * playerShares;
  const totalPersonalCost = dividendsLost + portfolioLoss;

  return {
    question: `${company.abbr} has ${currency}${treasury} treasury and needs a ${targetTrain.name}-train (${currency}${trainCost}). Revenue is ${currency}${revenue}/OR. How many ORs of withholding to afford the train? You hold ${playerShares} shares — what is your total personal cost (lost dividends + portfolio loss at ${currency}${priceDropPerOR} stock drop/OR)?`,
    answer: orsToWithhold,
    unit: 'operating rounds',
    hint: `Cash needed: ${currency}${trainCost} - ${currency}${treasury} = ${currency}${cashNeeded}. Divide by revenue per OR.`,
    explanation: `Need: ${currency}${cashNeeded}. At ${currency}${revenue}/OR: ${cashNeeded}/${revenue} = ${(cashNeeded / revenue).toFixed(1)} → ${orsToWithhold} ORs. Lost dividends: ${currency}${perShare} x ${playerShares} x ${orsToWithhold} = ${currency}${dividendsLost}. Portfolio loss: ${currency}${priceDropPerOR} x ${playerShares} x ${orsToWithhold} = ${currency}${portfolioLoss}. Total personal cost: ${currency}${totalPersonalCost}.`,
    context: `Withholding ${orsToWithhold} ORs costs you ${currency}${totalPersonalCost} personally to save the company ${currency}${cashNeeded} for a train. ${totalPersonalCost > cashNeeded ? 'Your personal cost exceeds what the company saves — consider whether the train is worth it or if an emergency buy might be less painful.' : 'The personal cost is less than the company saves — withholding is reasonable here.'}`,
  };
}
