import { pick, randInt } from '../utils/random';

export default function emergencyBuy(gameData, difficulty) {
  const currency = gameData.currency || '$';
  const trains = gameData.trains;
  const company = pick(gameData.companies);

  if (difficulty === 'easy') {
    const train = pick(trains.slice(2, 5));
    const treasury = randInt(1, Math.floor(train.cost / 4)) * 10;
    const presidentPays = train.cost - treasury;

    return {
      question: `${company.abbr} must buy a ${train.name}-train (${currency}${train.cost}) but only has ${currency}${treasury} in treasury. How much must the president pay out of pocket?`,
      answer: presidentPays,
      unit: currency,
      hint: 'President pays = train cost - company treasury.',
      explanation: `${currency}${train.cost} - ${currency}${treasury} = ${currency}${presidentPays}. The president is personally liable for the difference when a company cannot afford a mandatory train purchase.`,
      context: 'Emergency train purchases are one of the most punishing mechanics in 18xx. As president, you are forced to spend your own cash (and sometimes sell your shares) to cover the shortfall.',
    };
  }

  if (difficulty === 'medium') {
    // Choose cheapest available train from multiple options
    const availableIdx = randInt(2, Math.min(4, trains.length - 1));
    const availableTrains = trains.slice(availableIdx, Math.min(availableIdx + 3, trains.length));
    const cheapest = availableTrains[0];
    const treasury = randInt(1, Math.floor(cheapest.cost / 5)) * 10;
    const presidentPays = cheapest.cost - treasury;

    const trainOptions = availableTrains
      .map(t => `${t.name} (${currency}${t.cost})`)
      .join(', ');

    return {
      question: `${company.abbr} is trainless with ${currency}${treasury} in treasury. Available trains: ${trainOptions}. The company must buy the cheapest available train. How much must the president contribute?`,
      answer: presidentPays,
      unit: currency,
      hint: `The cheapest train is the ${cheapest.name} at ${currency}${cheapest.cost}. Subtract treasury from that cost.`,
      explanation: `Cheapest available: ${cheapest.name} at ${currency}${cheapest.cost}. Treasury: ${currency}${treasury}. President pays: ${currency}${cheapest.cost} - ${currency}${treasury} = ${currency}${presidentPays}. In most 18xx games, a trainless company must buy the cheapest available train from the bank.`,
      context: `The president must buy the cheapest available train — they cannot choose to buy a more expensive one during an emergency. ${availableTrains.length > 1 ? `Higher trains (${availableTrains.slice(1).map(t => t.name).join(', ')}) are available but not mandatory.` : ''}`,
    };
  }

  // Hard: president must sell shares to raise cash
  const train = pick(trains.slice(2, 5));
  const treasury = randInt(1, Math.floor(train.cost / 6)) * 10;
  const shortfall = train.cost - treasury;
  const presidentCash = randInt(1, Math.floor(shortfall / 3)) * 10;
  const needFromSales = shortfall - presidentCash;

  // Simulate share sale
  const otherCompany = gameData.companies.find(c => c.abbr !== company.abbr) || company;
  const sharePrice = pick([60, 67, 76, 82, 90, 100, 110]);
  const sharesNeeded = Math.ceil(needFromSales / sharePrice);
  const saleProceeds = sharesNeeded * sharePrice;
  const totalRaised = presidentCash + saleProceeds;
  const excessCash = totalRaised - shortfall;

  return {
    question: `${company.abbr} must buy a ${train.name}-train (${currency}${train.cost}). Treasury: ${currency}${treasury}. President has ${currency}${presidentCash} cash and shares of ${otherCompany.abbr} at ${currency}${sharePrice}. How many shares must the president sell to cover the emergency buy?`,
    answer: sharesNeeded,
    unit: 'shares',
    hint: `Shortfall after treasury: ${currency}${shortfall}. After president's cash: ${currency}${needFromSales} still needed. Divide by share price and round up.`,
    explanation: `Train: ${currency}${train.cost} - Treasury: ${currency}${treasury} = ${currency}${shortfall} shortfall. President's cash: ${currency}${presidentCash}. Still need: ${currency}${needFromSales}. At ${currency}${sharePrice}/share: ${needFromSales}/${sharePrice} = ${(needFromSales / sharePrice).toFixed(1)} → ${sharesNeeded} shares (round up). Sale proceeds: ${currency}${saleProceeds}. ${excessCash > 0 ? `Excess ${currency}${excessCash} goes back to president.` : 'Exactly covers the shortfall.'}`,
    context: 'Forced share sales during emergency buys can crash stock prices (shares go to the bank pool) and may even cause the president to lose majority, transferring the presidency. This is a key weapon in aggressive 18xx play — dump a company on someone to force them into emergency buys.',
  };
}
