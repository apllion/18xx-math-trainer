import styles from './GameSelector.module.css';

const GAMES = ['1889', '1830', '1846', '1849', '18Chesapeake'];

export default function GameSelector({ value, onChange }) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Select game"
    >
      {GAMES.map((game) => (
        <option key={game} value={game}>{game}</option>
      ))}
    </select>
  );
}
