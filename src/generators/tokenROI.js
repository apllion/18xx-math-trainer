import { pick, randInt } from '../utils/random';

export default function tokenROI(gameData, difficulty) {
  const currency = gameData.currency || '$';
  const company = pick(gameData.companies);
  const tokenCosts = gameData.tokenCosts;

  if (difficulty === 'easy') {
    const tokenIndex = randInt(1, Math.min(2, tokenCosts.length - 1));
    const tokenCost = tokenCosts[tokenIndex];
    const revenueIncrease = pick([10, 20, 30, 40, 50]);
    const rounds = 3;
    const totalGain = revenueIncrease * rounds;
    const netGain = totalGain - tokenCost;

    return {
      question: `${company.abbr}'s next token costs ${currency}${tokenCost}. Placing it increases route revenue by ${currency}${revenueIncrease}/OR. Over ${rounds} operating rounds, is the token worth it? What is the net gain or loss?`,
      answer: Math.abs(netGain),
      unit: currency,
      hint: `Revenue gain over ${rounds} ORs minus token cost. Positive = worth it.`,
      explanation: `Revenue gain: ${currency}${revenueIncrease} x ${rounds} = ${currency}${totalGain}. Token cost: ${currency}${tokenCost}. Net: ${currency}${totalGain} - ${currency}${tokenCost} = ${netGain >= 0 ? '+' : '-'}${currency}${Math.abs(netGain)}. ${netGain >= 0 ? 'The token pays for itself!' : 'The token doesn\'t pay off in this timeframe.'}`,
      context: `Token costs in ${gameData.id}: ${tokenCosts.map((c, i) => `#${i + 1}: ${currency}${c}`).join(', ')}. Tokens are most valuable early in the game when there are more ORs left to recoup the investment.`,
    };
  }

  if (difficulty === 'medium') {
    const tokenIndex = randInt(1, Math.min(3, tokenCosts.length - 1));
    const tokenCost = tokenCosts[tokenIndex];
    const revenueIncrease = pick([20, 30, 40, 50, 60]);
    const rounds = pick([4, 5, 6]);
    const totalGain = revenueIncrease * rounds;

    // Opportunity cost: what else could you do with that money?
    const trainUpgrade = pick(gameData.trains.slice(1, 4));
    const trainRevenueBoost = pick([30, 40, 50, 60, 80]);
    const opportunityCost = trainRevenueBoost * rounds;

    const tokenROIValue = totalGain - tokenCost;
    const trainROIValue = opportunityCost - trainUpgrade.cost;

    return {
      question: `${company.abbr} has ${currency}${tokenCost + trainUpgrade.cost + 50} in treasury. Option A: place a token (${currency}${tokenCost}) for +${currency}${revenueIncrease}/OR. Option B: save toward a ${trainUpgrade.name}-train upgrade (${currency}${trainUpgrade.cost}) that adds ~${currency}${trainRevenueBoost}/OR. Which has better ROI over ${rounds} ORs?`,
      answer: Math.max(tokenROIValue, trainROIValue),
      unit: currency,
      hint: `Compare: (revenue boost x rounds) - cost for each option.`,
      explanation: `Token: ${currency}${revenueIncrease} x ${rounds} - ${currency}${tokenCost} = ${currency}${tokenROIValue} net. Train: ${currency}${trainRevenueBoost} x ${rounds} - ${currency}${trainUpgrade.cost} = ${currency}${trainROIValue} net. ${tokenROIValue > trainROIValue ? 'Token wins!' : trainROIValue > tokenROIValue ? 'Train upgrade wins!' : 'They\'re equal — prefer the train for permanence.'}`,
      context: 'Every treasury dollar has an opportunity cost. Spending on tokens means less for trains, track, or saving for future phases. Good players constantly compare ROI across options.',
    };
  }

  // Hard: include blocking value
  const tokenIndex = randInt(1, Math.min(3, tokenCosts.length - 1));
  const tokenCost = tokenCosts[tokenIndex];
  const revenueIncrease = pick([20, 30, 40, 50]);
  const rounds = pick([4, 5, 6, 7]);
  const totalGain = revenueIncrease * rounds;

  // Blocking: opponent's company loses revenue
  const opponent = gameData.companies.find(c => c.abbr !== company.abbr) || company;
  const blockingValue = pick([20, 30, 40, 50, 60]);
  const totalBlocking = blockingValue * rounds;
  const totalValue = totalGain + totalBlocking;
  const netValue = totalValue - tokenCost;

  return {
    question: `${company.abbr}'s token costs ${currency}${tokenCost}. It adds ${currency}${revenueIncrease}/OR to your routes AND blocks ${opponent.abbr} from a ${currency}${blockingValue}/OR route bonus. Over ${rounds} ORs, what is the total strategic value (your gain + opponent's loss)?`,
    answer: totalValue,
    unit: currency,
    hint: `Total value = your revenue gain + opponent's denied revenue, both multiplied by rounds remaining.`,
    explanation: `Your gain: ${currency}${revenueIncrease} x ${rounds} = ${currency}${totalGain}. Opponent's loss: ${currency}${blockingValue} x ${rounds} = ${currency}${totalBlocking}. Total strategic value: ${currency}${totalValue}. After token cost: net ${currency}${netValue}. Cost-to-value ratio: ${(tokenCost / totalValue * 100).toFixed(0)}%.`,
    context: `Blocking tokens are often more valuable than revenue tokens. Denying an opponent ${currency}${blockingValue}/OR is equivalent to earning that much yourself in a two-player game. In multiplayer, blocking is less efficient but still powerful if the opponent is the leader.`,
  };
}
