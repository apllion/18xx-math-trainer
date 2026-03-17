import { pick, randInt } from '../utils/random';

export default function trainRush(gameData, difficulty) {
  const currency = gameData.currency || '$';
  const trains = gameData.trains;
  const company = pick(gameData.companies);

  if (difficulty === 'easy') {
    const train = pick(trains.slice(1, 5));

    return {
      question: `${company.abbr} needs to buy a ${train.name}-train. How much does it cost?`,
      answer: train.cost,
      unit: currency,
      hint: `Look up the cost of a ${train.name}-train in ${gameData.id}.`,
      explanation: `A ${train.name}-train costs ${currency}${train.cost} in ${gameData.id}. There are ${train.quantity} available. ${train.rustedBy ? `These will be rusted when ${train.rustedBy}-trains appear.` : 'These trains are permanent and never rust.'}`,
      context: `Train costs in ${gameData.id}: ${trains.map(t => `${t.name}=${currency}${t.cost}`).join(', ')}. Memorizing these costs helps you plan purchases during operating rounds.`,
    };
  }

  if (difficulty === 'medium') {
    const train = pick(trains.slice(1, 5));
    const treasury = randInt(2, Math.floor(train.cost / 20)) * 10;
    const shortfall = train.cost - treasury;

    return {
      question: `${company.abbr} has ${currency}${treasury} in treasury and must buy a ${train.name}-train (${currency}${train.cost}). How much more cash does the company need?`,
      answer: shortfall,
      unit: currency,
      hint: 'Shortfall = train cost - current treasury.',
      explanation: `${currency}${train.cost} - ${currency}${treasury} = ${currency}${shortfall} needed. The company must find this money — either by earning revenue first, or the president may need to contribute from personal funds.`,
      context: `When a company is short on cash for a mandatory train purchase, the president must cover the difference. This is called an "emergency buy" and can be devastating to a player's finances.`,
    };
  }

  // Hard: factor in route revenue from next OR
  const currentTrain = pick(trains.slice(0, 3));
  const nextTrain = trains[trains.indexOf(currentTrain) + 1] || trains[trains.length - 1];
  const treasury = randInt(3, 15) * 10;

  const routeData = gameData.typicalRouteValues[currentTrain.name];
  const routeRevenue = routeData
    ? randInt(routeData.min, routeData.max)
    : randInt(40, 150);

  // If company withholds this OR, can it afford next train?
  const afterWithhold = treasury + routeRevenue;
  const canAfford = afterWithhold >= nextTrain.cost;
  const gap = nextTrain.cost - afterWithhold;

  return {
    question: `${company.abbr} has ${currency}${treasury} in treasury, a ${currentTrain.name}-train earning ${currency}${routeRevenue} this OR. The next train type (${nextTrain.name}) costs ${currency}${nextTrain.cost}. If the company withholds revenue, can it afford the ${nextTrain.name}-train next OR? What's the surplus or shortfall?`,
    answer: Math.abs(gap),
    unit: currency,
    hint: `After withholding: treasury + revenue = total cash. Compare against ${nextTrain.name}-train cost.`,
    explanation: `After withholding: ${currency}${treasury} + ${currency}${routeRevenue} = ${currency}${afterWithhold}. ${nextTrain.name}-train: ${currency}${nextTrain.cost}. ${canAfford ? `Surplus of ${currency}${-gap} — the company can afford it.` : `Shortfall of ${currency}${gap} — the company cannot afford it from treasury alone.`}`,
    context: `${canAfford ? 'Withholding to save for a train is a common strategy, though it drops the stock price.' : 'Even after withholding, the company is short. The president should plan to inject cash or find another revenue source.'} Stock price drops when withholding, so consider whether the train purchase is worth the price hit.`,
  };
}
