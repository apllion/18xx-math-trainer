import { pick, randInt } from '../utils/random';

// Typical 18xx stock prices
const STOCK_PRICES = [45, 50, 55, 60, 65, 67, 70, 76, 80, 82, 90, 100, 110, 112, 120, 135, 148, 150, 165, 180, 200, 220, 250];
const SMALL_PRICES = [50, 55, 60, 65, 67, 70, 76, 80, 82, 90, 100];
const REVENUES = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 220, 240, 260, 280, 300, 340, 380, 400];
const CITY_VALUES = [10, 20, 30, 40, 50, 60, 70, 80, 100];
const TRAIN_COSTS = [80, 160, 180, 200, 250, 300, 400, 450, 500, 600, 630, 700, 800, 1000, 1100, 1200];

const categories = {
  routes: {
    name: 'Route Addition',
    description: 'Add city values to calculate route revenue',
    generate(difficulty) {
      const stops = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6;
      const values = [];
      for (let i = 0; i < stops; i++) {
        values.push(pick(CITY_VALUES));
      }
      const answer = values.reduce((a, b) => a + b, 0);
      return {
        question: values.join(' + '),
        answer,
        label: `${stops}-stop route`,
      };
    },
  },

  marketCap: {
    name: 'Market Cap (×10)',
    description: 'Multiply stock price by 10 shares',
    generate(difficulty) {
      const prices = difficulty === 'easy' ? SMALL_PRICES : STOCK_PRICES;
      const price = pick(prices);
      if (difficulty === 'hard') {
        const shares = pick([6, 7, 8]);
        return {
          question: `${price} × ${shares}`,
          answer: price * shares,
          label: `${shares} shares at ${price}`,
        };
      }
      return {
        question: `${price} × 10`,
        answer: price * 10,
        label: `Market cap at ${price}`,
      };
    },
  },

  dividend: {
    name: 'Dividend Split (÷10)',
    description: 'Divide revenue by 10 for per-share payout',
    generate(difficulty) {
      const revenue = pick(REVENUES.filter(r => r % 10 === 0));
      if (difficulty === 'easy') {
        return {
          question: `${revenue} ÷ 10`,
          answer: revenue / 10,
          label: `Per-share dividend`,
        };
      }
      const shares = pick(difficulty === 'medium' ? [3, 4, 5] : [4, 5, 6]);
      const perShare = revenue / 10;
      const total = perShare * shares;
      return {
        question: `${revenue} ÷ 10 × ${shares}`,
        answer: total,
        label: `Your cut (${shares} shares)`,
      };
    },
  },

  shortfall: {
    name: 'Shortfall (−)',
    description: 'Train cost minus treasury = president pays',
    generate(difficulty) {
      const cost = pick(TRAIN_COSTS);
      const treasury = randInt(
        difficulty === 'easy' ? Math.floor(cost * 0.5) : Math.floor(cost * 0.1),
        Math.floor(cost * 0.8)
      );
      // Round treasury to nearest 10
      const roundedTreasury = Math.round(treasury / 10) * 10;
      return {
        question: `${cost} − ${roundedTreasury}`,
        answer: cost - roundedTreasury,
        label: 'Emergency buy shortfall',
      };
    },
  },

  portfolio: {
    name: 'Portfolio Value (× then +)',
    description: 'Shares × price for multiple holdings, then sum',
    generate(difficulty) {
      const n = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
      const holdings = [];
      let total = 0;
      for (let i = 0; i < n; i++) {
        const shares = pick([2, 3, 4, 5]);
        const price = pick(SMALL_PRICES);
        holdings.push({ shares, price });
        total += shares * price;
      }
      const parts = holdings.map(h => `${h.shares}×${h.price}`);
      return {
        question: parts.join(' + '),
        answer: total,
        label: `${n}-company portfolio`,
      };
    },
  },

  percentage: {
    name: 'Concentration (%)',
    description: 'What percentage of your net worth is in one company?',
    generate(difficulty) {
      const total = pick([800, 1000, 1200, 1500, 1800, 2000, 2400, 3000]);
      const part = randInt(Math.floor(total * 0.2), Math.floor(total * 0.7));
      // Round part to nearest 50
      const roundedPart = Math.round(part / 50) * 50;
      const pct = Math.round((roundedPart / total) * 100);
      return {
        question: `${roundedPart} / ${total} = ?%`,
        answer: pct,
        label: 'Portfolio concentration',
      };
    },
  },

  trainROI: {
    name: 'Train ROI',
    description: 'Revenue × runs vs train cost',
    generate(difficulty) {
      const cost = pick([80, 180, 300, 450, 630]);
      const revenue = pick([20, 30, 40, 60, 80, 100, 120, 140]);
      const runs = pick(difficulty === 'easy' ? [3, 4, 5] : [2, 3, 4, 5, 6, 7]);
      const totalRevenue = revenue * runs;
      const profit = totalRevenue - cost;
      return {
        question: `${revenue} × ${runs} − ${cost}`,
        answer: profit,
        label: `Train profit over ${runs} runs`,
      };
    },
  },

  floatCost: {
    name: 'Float Cost',
    description: 'Par × shares to float',
    generate(difficulty) {
      const par = pick([50, 55, 60, 65, 67, 70, 75, 76, 80, 82, 90, 100]);
      const sharesToFloat = pick(difficulty === 'easy' ? [5] : [2, 5, 6]);
      return {
        question: `${par} × ${sharesToFloat}`,
        answer: par * sharesToFloat,
        label: `Float at ${par} (${sharesToFloat} shares)`,
      };
    },
  },

  doubleRoute: {
    name: 'Double Route',
    description: 'Add two separate route revenues',
    generate(difficulty) {
      const stops1 = difficulty === 'easy' ? 2 : 3;
      const stops2 = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
      const route1 = [];
      const route2 = [];
      for (let i = 0; i < stops1; i++) route1.push(pick(CITY_VALUES));
      for (let i = 0; i < stops2; i++) route2.push(pick(CITY_VALUES));
      const sum1 = route1.reduce((a, b) => a + b, 0);
      const sum2 = route2.reduce((a, b) => a + b, 0);
      return {
        question: `(${route1.join('+')} ) + (${route2.join('+')})`,
        answer: sum1 + sum2,
        label: '2-train total revenue',
      };
    },
  },

  bankBreak: {
    name: 'Bank Drain',
    description: 'Estimate ORs remaining from bank balance and payout rate',
    generate(difficulty) {
      const bank = pick([2000, 3000, 4000, 5000, 6000, 8000]);
      const payoutPerOR = pick([400, 500, 600, 700, 800, 1000, 1200, 1500]);
      const ors = Math.floor(bank / payoutPerOR);
      return {
        question: `${bank} ÷ ${payoutPerOR}`,
        answer: ors,
        label: `ORs until bank breaks`,
      };
    },
  },
};

export const CALC_CATEGORIES = Object.entries(categories).map(([id, cat]) => ({
  id,
  name: cat.name,
  description: cat.description,
}));

export function generateCalcQuestion(categoryId, difficulty) {
  const cat = categories[categoryId];
  if (!cat) throw new Error(`Unknown category: ${categoryId}`);
  return cat.generate(difficulty);
}

export function generateMixedQuestion(difficulty, selectedCategories) {
  const pool = selectedCategories || Object.keys(categories);
  const catId = pick(pool);
  const q = categories[catId].generate(difficulty);
  return { ...q, category: catId, categoryName: categories[catId].name };
}
