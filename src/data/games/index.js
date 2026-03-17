import g1889 from './g1889';
import g1830 from './g1830';
import g1846 from './g1846';
import g1849 from './g1849';
import g18chesapeake from './g18chesapeake';

const games = {
  '1889': g1889,
  '1830': g1830,
  '1846': g1846,
  '1849': g1849,
  '18Chesapeake': g18chesapeake,
};

export default games;

export function getGame(id) {
  return games[id] || g1889;
}

export function getGameList() {
  return Object.values(games).map(({ id, name }) => ({ id, name }));
}
