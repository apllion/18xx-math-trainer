import { pick, randInt } from '../utils/random';

export default function parValue(gameData, difficulty) {
  const currency = gameData.currency || '$';

  // 1849 has no fixed par values — generate a variable pricing question
  if (!gameData.parValues || gameData.hasVariablePar) {
    return variableParQuestion(gameData, difficulty, currency);
  }

  const parValues = gameData.parValues;
  const floatPercent = gameData.floatPercent || 60;
  const sharesToFloat = Math.ceil((floatPercent / 100) * 10);

  if (difficulty === 'easy') {
    const par = pick(parValues);
    const cost = par * sharesToFloat;
    return {
      question: `In ${gameData.id}, you need to buy ${sharesToFloat} shares to float a company (${floatPercent}%). If you choose a par value of ${currency}${par}, how much do you spend?`,
      answer: cost,
      unit: currency,
      hint: `Multiply the par value by the number of shares needed to float: ${sharesToFloat} shares.`,
      explanation: `${currency}${par} x ${sharesToFloat} shares = ${currency}${cost}. To float a company, the president must buy ${sharesToFloat} of 10 shares (${floatPercent}% of the company).`,
      context: `In ${gameData.id}, companies float at ${floatPercent}%, meaning ${sharesToFloat} shares must be purchased from the IPO before the company receives its treasury.`,
    };
  }

  if (difficulty === 'medium') {
    const playerCash = randInt(250, 700);
    // Find par values the player can afford
    const affordable = parValues.filter(p => p * sharesToFloat <= playerCash);
    if (affordable.length === 0) {
      // Fallback to easy-style
      const par = parValues[0];
      const cost = par * sharesToFloat;
      return {
        question: `The lowest par value in ${gameData.id} is ${currency}${par}. How much cash do you need to float a company at this par?`,
        answer: cost,
        unit: currency,
        hint: `${sharesToFloat} shares at ${currency}${par} each.`,
        explanation: `${currency}${par} x ${sharesToFloat} = ${currency}${cost}.`,
        context: 'Choosing the lowest par conserves cash but starts the stock price at the bottom of the market.',
      };
    }
    const bestPar = affordable[affordable.length - 1];
    const cost = bestPar * sharesToFloat;
    const leftover = playerCash - cost;

    return {
      question: `You have ${currency}${playerCash} in cash. In ${gameData.id}, you need ${sharesToFloat} shares to float (${floatPercent}%). What is the highest par value you can afford? Available pars: ${parValues.map(p => currency + p).join(', ')}`,
      answer: bestPar,
      unit: currency,
      hint: `Divide your cash by ${sharesToFloat} to find the max you can pay per share, then pick the highest par at or below that amount.`,
      explanation: `${currency}${playerCash} / ${sharesToFloat} = ${currency}${(playerCash / sharesToFloat).toFixed(1)} per share. The highest par at or below this is ${currency}${bestPar}. Total cost: ${currency}${cost}, leaving ${currency}${leftover}.`,
      context: 'Choosing a higher par means the company starts at a higher stock price and receives more treasury (in full-cap games). But you keep less cash for other investments.',
    };
  }

  // Hard: factor in float percent, treasury, and remaining cash for strategy
  const playerCash = randInt(300, 800);
  const affordable = parValues.filter(p => p * sharesToFloat <= playerCash);
  if (affordable.length < 2) {
    const par = parValues[0];
    const treasuryAmount = gameData.incrementalCap ? par * sharesToFloat : par * 10;
    return {
      question: `With only ${currency}${playerCash}, your only option in ${gameData.id} is the ${currency}${par} par. How much treasury will the company receive when it floats?`,
      answer: treasuryAmount,
      unit: currency,
      hint: gameData.incrementalCap
        ? 'In incremental capitalization, the company only receives cash for shares actually sold.'
        : 'In full capitalization, the company receives par x 10 shares in treasury.',
      explanation: gameData.incrementalCap
        ? `Incremental cap: ${currency}${par} x ${sharesToFloat} shares sold = ${currency}${treasuryAmount} treasury.`
        : `Full cap: ${currency}${par} x 10 shares = ${currency}${treasuryAmount} treasury.`,
      context: gameData.incrementalCap
        ? 'With incremental capitalization (like 1846), the company only gets money for shares actually purchased. Additional shares sold later add to treasury.'
        : 'With full capitalization, the company gets the entire 10-share value in treasury when it floats, regardless of how many shares the president bought.',
    };
  }

  const lowPar = affordable[0];
  const highPar = affordable[affordable.length - 1];
  const lowCost = lowPar * sharesToFloat;
  const highCost = highPar * sharesToFloat;
  const lowTreasury = gameData.incrementalCap ? lowCost : lowPar * 10;
  const highTreasury = gameData.incrementalCap ? highCost : highPar * 10;
  const treasuryDiff = highTreasury - lowTreasury;

  return {
    question: `You have ${currency}${playerCash}. Should you par at ${currency}${lowPar} or ${currency}${highPar}? How much more treasury does the company get at the higher par, and how much less cash do you keep?`,
    answer: treasuryDiff,
    unit: currency,
    hint: gameData.incrementalCap
      ? `Compare treasury: each par x ${sharesToFloat} shares (incremental cap).`
      : 'Compare treasury: each par x 10 shares (full cap). Then compare leftover cash.',
    explanation: `At ${currency}${lowPar}: costs ${currency}${lowCost}, treasury = ${currency}${lowTreasury}, you keep ${currency}${playerCash - lowCost}. At ${currency}${highPar}: costs ${currency}${highCost}, treasury = ${currency}${highTreasury}, you keep ${currency}${playerCash - highCost}. Treasury difference: ${currency}${treasuryDiff}. Cash difference: ${currency}${highCost - lowCost}.`,
    context: 'Higher par = more treasury but less personal cash. The trade-off depends on whether the company needs money more than you do. A richer company can buy better trains sooner.',
  };
}

function variableParQuestion(gameData, difficulty, currency) {
  const company = pick(gameData.companies);
  const floatPercent = gameData.floatPercent || 60;
  const sharesToFloat = Math.ceil((floatPercent / 100) * 10);

  if (difficulty === 'easy') {
    const price = randInt(5, 15) * 10;
    const cost = price * sharesToFloat;
    return {
      question: `In ${gameData.id}, par values are variable. If you start ${company.abbr} at ${currency}${price} per share, how much do you spend to buy ${sharesToFloat} shares (${floatPercent}% float)?`,
      answer: cost,
      unit: currency,
      hint: 'Multiply the chosen stock price by the number of shares to float.',
      explanation: `${currency}${price} x ${sharesToFloat} = ${currency}${cost}.`,
      context: `${gameData.id} uses variable par pricing — you can choose any available stock price as the starting value for a new company.`,
    };
  }

  if (difficulty === 'medium') {
    const playerCash = randInt(200, 500);
    const maxParPerShare = Math.floor(playerCash / sharesToFloat);
    const roundedMax = Math.floor(maxParPerShare / 5) * 5;
    return {
      question: `You have ${currency}${playerCash} in ${gameData.id}. What's the maximum par value per share you can afford if you need to buy ${sharesToFloat} shares to float?`,
      answer: maxParPerShare,
      unit: currency,
      hint: `Divide your cash by ${sharesToFloat} and round down.`,
      explanation: `${currency}${playerCash} / ${sharesToFloat} = ${currency}${(playerCash / sharesToFloat).toFixed(1)}. Rounding down: ${currency}${maxParPerShare} per share. (On a stock market with ${currency}5 increments, the practical max would be ${currency}${roundedMax}.)`,
      context: 'In variable par games, choosing your initial stock price is a key strategic decision. Higher par means more initial treasury but more personal investment.',
    };
  }

  // Hard
  const targetTrain = pick(gameData.trains.slice(0, 3));
  const trainCost = targetTrain.cost;
  const minTreasury = trainCost;
  const minPar = Math.ceil(minTreasury / 10);

  return {
    question: `In ${gameData.id}, you want ${company.abbr} to afford a ${targetTrain.name}-train (${currency}${trainCost}) from treasury alone after floating. What minimum par value do you need? (Full cap: treasury = par x 10)`,
    answer: minPar,
    unit: currency,
    hint: `Treasury = par x 10 shares. Set par x 10 >= ${currency}${trainCost}.`,
    explanation: `${currency}${trainCost} / 10 = ${currency}${(trainCost / 10).toFixed(1)}. Minimum par: ${currency}${minPar}. This gives treasury of ${currency}${minPar * 10}, which covers the ${currency}${trainCost} train${minPar * 10 > trainCost ? ` with ${currency}${minPar * 10 - trainCost} to spare` : ' exactly'}.`,
    context: 'Setting par high enough to buy a train on the first OR is a critical calculation. If the company can\'t afford a train, the president may face an emergency buy.',
  };
}
