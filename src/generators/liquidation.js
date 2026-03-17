import { pick, randInt } from '../utils/random';

export default function liquidation(gameData, difficulty) {
  const currency = gameData.currency || '$';
  const trains = gameData.trains;
  const company = pick(gameData.companies);

  if (difficulty === 'easy') {
    const train = pick(trains.slice(0, 4));
    const treasury = randInt(2, 15) * 10;
    const totalValue = train.cost + treasury;

    return {
      question: `${company.abbr} has a ${train.name}-train (cost ${currency}${train.cost}) and ${currency}${treasury} in treasury. What is the company's total asset value?`,
      answer: totalValue,
      unit: currency,
      hint: 'Add the train value and treasury together.',
      explanation: `${train.name}-train: ${currency}${train.cost} + Treasury: ${currency}${treasury} = ${currency}${totalValue}. In a forced sale or liquidation, this is the total company assets.`,
      context: 'Company asset value matters when determining if a company can afford an emergency train purchase, and during receivership or nationalization in some game variants.',
    };
  }

  if (difficulty === 'medium') {
    // Multiple trains + tokens
    const train1 = pick(trains.slice(0, 3));
    const train2 = pick(trains.slice(2, 5));
    const tokensPlaced = randInt(1, Math.min(3, company.tokens));
    const tokenCost = gameData.tokenCosts
      .slice(0, tokensPlaced)
      .reduce((sum, c) => sum + c, 0);
    const treasury = randInt(3, 20) * 10;
    const totalValue = train1.cost + train2.cost + tokenCost + treasury;

    return {
      question: `${company.abbr} owns a ${train1.name}-train (${currency}${train1.cost}) and a ${train2.name}-train (${currency}${train2.cost}), has placed ${tokensPlaced} token(s) (total cost: ${currency}${tokenCost}), and has ${currency}${treasury} in treasury. What is the total asset value?`,
      answer: totalValue,
      unit: currency,
      hint: 'Sum all train costs + token costs + treasury.',
      explanation: `Trains: ${currency}${train1.cost} + ${currency}${train2.cost} = ${currency}${train1.cost + train2.cost}. Tokens: ${currency}${tokenCost}. Treasury: ${currency}${treasury}. Total: ${currency}${totalValue}.`,
      context: `${company.abbr} has ${company.tokens} available token slots. Token costs in ${gameData.id}: ${gameData.tokenCosts.map(c => currency + c).join(', ')}. Tokens are sunk costs but represent invested capital.`,
    };
  }

  // Hard: include route value comparison
  const train1 = pick(trains.slice(1, 4));
  const train2 = pick(trains.slice(3, trains.length));
  const tokensPlaced = randInt(2, company.tokens);
  const tokenCost = gameData.tokenCosts
    .slice(0, tokensPlaced)
    .reduce((sum, c) => sum + c, 0);
  const treasury = randInt(5, 25) * 10;

  const routeData1 = gameData.typicalRouteValues[train1.name];
  const routeData2 = gameData.typicalRouteValues[train2.name];
  const route1 = routeData1 ? randInt(routeData1.min, routeData1.max) : randInt(80, 200);
  const route2 = routeData2 ? randInt(routeData2.min, routeData2.max) : randInt(150, 400);
  const totalRoute = route1 + route2;
  const assetValue = train1.cost + train2.cost + tokenCost + treasury;

  return {
    question: `${company.abbr} has: ${train1.name}-train (${currency}${train1.cost}, runs for ${currency}${route1}), ${train2.name}-train (${currency}${train2.cost}, runs for ${currency}${route2}), ${tokensPlaced} tokens (${currency}${tokenCost} invested), and ${currency}${treasury} treasury. What is total asset value, and what is total route revenue per OR?`,
    answer: assetValue,
    unit: currency,
    hint: 'Asset value = sum of train costs + token costs + treasury. Route revenue is separate — it\'s what the trains earn per operating round.',
    explanation: `Asset value: ${currency}${train1.cost} + ${currency}${train2.cost} + ${currency}${tokenCost} + ${currency}${treasury} = ${currency}${assetValue}. Route revenue: ${currency}${route1} + ${currency}${route2} = ${currency}${totalRoute}/OR. Revenue-to-asset ratio: ${(totalRoute / assetValue * 100).toFixed(1)}% per OR.`,
    context: `A company earning ${currency}${totalRoute} per OR on ${currency}${assetValue} in assets has a ${(totalRoute / assetValue * 100).toFixed(0)}% return rate. High return rates mean the company is efficient — its trains are earning well relative to their cost.`,
  };
}
