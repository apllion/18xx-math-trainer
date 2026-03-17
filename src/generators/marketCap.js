import { pick, randInt } from '../utils/random';

const ROUND_PRICES = [50, 60, 70, 80, 90, 100];
const MEDIUM_PRICES = [50, 55, 60, 65, 67, 70, 75, 76, 80, 82, 90, 100, 110, 120];
const HARD_PRICES = [45, 52, 58, 63, 67, 71, 76, 82, 88, 95, 100, 108, 112, 125, 135, 148];

export default function marketCap(gameData, difficulty) {
  const currency = gameData.currency || '$';

  if (difficulty === 'easy') {
    const price = pick(ROUND_PRICES);
    const shares = 10;
    const answer = price * shares;
    return {
      question: `A company's stock price is ${currency}${price}. With ${shares} shares outstanding, what is its market capitalization?`,
      answer,
      unit: currency,
      hint: 'Market cap = stock price x total shares. All companies have 10 shares.',
      explanation: `${currency}${price} x ${shares} shares = ${currency}${answer}. Market capitalization is the total value of all outstanding shares in the company.`,
      context: 'Market cap determines a company\'s rank relative to others and affects end-game scoring. Players\' net worth includes shares valued at market price.',
    };
  }

  if (difficulty === 'medium') {
    const price = pick(MEDIUM_PRICES);
    const shares = 10;
    const answer = price * shares;
    const company = pick(gameData.companies);
    return {
      question: `${company.abbr}'s stock is at ${currency}${price}. What is its market capitalization?`,
      answer,
      unit: currency,
      hint: 'Market cap = stock price x 10 shares. Multiply carefully with non-round numbers.',
      explanation: `${currency}${price} x 10 = ${currency}${answer}. Tip: for numbers like ${price}, think of it as ${Math.floor(price / 10) * 10} x 10 + ${price % 10} x 10 = ${Math.floor(price / 10) * 100} + ${(price % 10) * 10}.`,
      context: `Knowing market cap quickly helps you assess company value during stock rounds. ${company.abbr} has ${company.tokens} token slots on the board.`,
    };
  }

  // Hard: partial float scenario or odd prices
  const price = pick(HARD_PRICES);
  const company = pick(gameData.companies);
  const sharesInMarket = pick([3, 4, 5, 6]);
  const sharesOwned = 10 - sharesInMarket;
  const fullMarketCap = price * 10;
  const playerValue = price * sharesOwned;

  return {
    question: `${company.abbr}'s stock price is ${currency}${price}. Players hold ${sharesOwned} shares and ${sharesInMarket} remain in the bank pool. What is the full market cap, and what is the total player-held value?`,
    answer: fullMarketCap,
    unit: currency,
    hint: `Market cap is always price x 10 shares. Player-held value is price x shares held by players (${sharesOwned}).`,
    explanation: `Full market cap: ${currency}${price} x 10 = ${currency}${fullMarketCap}. Player-held value: ${currency}${price} x ${sharesOwned} = ${currency}${playerValue}. Shares in the bank pool still count for market cap but don't contribute to any player's portfolio.`,
    context: 'In end-game scoring, each player counts the value of shares they personally hold, not the full market cap. Shares in the bank pool or IPO are not counted for anyone.',
  };
}
