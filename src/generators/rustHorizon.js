import { pick, randInt } from '../utils/random';

export default function rustHorizon(gameData, difficulty) {
  const currency = gameData.currency || '$';
  const trains = gameData.trains;
  // Find trains that can be rusted (have a rustedBy value)
  const rustableTrains = trains.filter(t => t.rustedBy);

  if (difficulty === 'easy') {
    const target = pick(rustableTrains);
    const ruster = trains.find(t => t.name === target.rustedBy);

    return {
      question: `In ${gameData.id}, what happens to ${target.name}-trains when the first ${target.rustedBy}-train is purchased?`,
      answer: target.quantity,
      unit: 'trains rusted',
      hint: `${target.name}-trains are rusted by ${target.rustedBy}-trains. How many ${target.name}-trains exist?`,
      explanation: `All ${target.quantity} ${target.name}-trains are immediately removed from the game when the first ${target.rustedBy}-train is bought. Any company relying solely on ${target.name}-trains will be trainless and must buy a new train.`,
      context: `Rusting is permanent — rusted trains are gone forever. In ${gameData.id}, there are ${target.quantity} ${target.name}-trains. The ${target.rustedBy}-train costs ${currency}${ruster ? ruster.cost : '???'}. Plan your train purchases to avoid being caught without a train.`,
    };
  }

  if (difficulty === 'medium') {
    // Pick a train phase and ask how many trains remain before rust triggers
    const target = pick(rustableTrains);
    const ruster = trains.find(t => t.name === target.rustedBy);
    if (!ruster) {
      // Fallback
      return rustHorizon(gameData, 'easy');
    }

    // Count trains between current and ruster
    const targetIdx = trains.indexOf(target);
    const rusterIdx = trains.indexOf(ruster);
    const betweenTrains = trains.slice(targetIdx + 1, rusterIdx + 1);
    // Count all intermediate trains + only 1 copy of the ruster (buying the first one triggers rust)
    const totalBetween = betweenTrains.reduce((sum, t) => sum + t.quantity, 0) - (ruster.quantity - 1);

    return {
      question: `In ${gameData.id}, all ${target.name}-trains have been bought. How many total train purchases must occur before ${target.name}-trains rust? (Trains between ${target.name} and ${target.rustedBy}: ${betweenTrains.map(t => t.name).join(', ')})`,
      answer: totalBetween,
      unit: 'train purchases',
      hint: `Add up the quantities of all train types between ${target.name} and ${target.rustedBy}, then add 1 for the first ${target.rustedBy}-train that triggers rust.`,
      explanation: `${betweenTrains.slice(0, -1).map(t => `${t.name}: ${t.quantity}`).join(' + ')}${betweenTrains.length > 1 ? ' + ' : ''}first ${ruster.name}: 1 = ${totalBetween} purchases until rust. Only 1 ${target.rustedBy}-train needs to be bought to rust all ${target.name}-trains.`,
      context: 'Counting the "rust horizon" — how many train purchases away rust is — is essential for timing. Each OR typically sees 1-3 train purchases depending on player count and game state.',
    };
  }

  // Hard: estimate operating rounds until rust
  const target = pick(rustableTrains);
  const ruster = trains.find(t => t.name === target.rustedBy);
  if (!ruster) {
    return rustHorizon(gameData, 'medium');
  }

  const targetIdx = trains.indexOf(target);
  const rusterIdx = trains.indexOf(ruster);
  const betweenTrains = trains.slice(targetIdx + 1, rusterIdx + 1);
  const totalBetween = betweenTrains.reduce((sum, t) => sum + t.quantity, 0) - (ruster.quantity - 1);
  const numCompanies = gameData.companies.length;
  const trainsAlreadyBought = randInt(1, Math.max(1, Math.floor(totalBetween / 2)));
  const remaining = totalBetween - trainsAlreadyBought;
  const purchasesPerOR = pick([1, 2, 2, 3]);
  const estimatedORs = Math.ceil(remaining / purchasesPerOR);

  return {
    question: `In ${gameData.id}, ${trainsAlreadyBought} of the ${totalBetween} trains between the ${target.name} and ${target.rustedBy} phases have been bought. If roughly ${purchasesPerOR} train(s) are purchased per operating round, approximately how many ORs until ${target.name}-trains rust?`,
    answer: estimatedORs,
    unit: 'operating rounds',
    hint: `${totalBetween} - ${trainsAlreadyBought} = ${remaining} trains remaining. Divide by ${purchasesPerOR} purchases per OR.`,
    explanation: `${remaining} remaining purchases / ${purchasesPerOR} per OR = ~${estimatedORs} ORs. With ${numCompanies} companies in the game, this is roughly ${estimatedORs <= 2 ? 'imminent — prepare now!' : estimatedORs <= 4 ? 'approaching — start planning.' : 'some time away, but watch the pace.'}`,
    context: `Estimating rust timing helps you decide whether to buy cheap trains (which might rust soon) or save for permanent ones. A company caught trainless must emergency-buy, often at the president's personal expense.`,
  };
}
