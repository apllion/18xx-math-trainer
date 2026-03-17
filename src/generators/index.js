import marketCap from './marketCap';
import parValue from './parValue';
import rustHorizon from './rustHorizon';
import liquidation from './liquidation';
import yieldVsJump from './yieldVsJump';
import portfolioConcentration from './portfolioConcentration';
import trainRush from './trainRush';
import emergencyBuy from './emergencyBuy';
import tokenROI from './tokenROI';
import withholdRatio from './withholdRatio';
import { getGame } from '../data/games';

const generators = {
  marketCap,
  parValue,
  rustHorizon,
  liquidation,
  yieldVsJump,
  portfolioConcentration,
  trainRush,
  emergencyBuy,
  tokenROI,
  withholdRatio,
};

export function generateDrill(type, gameId, difficulty) {
  const generator = generators[type];
  if (!generator) throw new Error(`Unknown drill type: ${type}`);
  const gameData = getGame(gameId);
  return generator(gameData, difficulty);
}

export function getDrillTypes() {
  return Object.keys(generators);
}

export default generators;
