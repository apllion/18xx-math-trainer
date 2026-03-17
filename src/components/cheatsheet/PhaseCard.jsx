import Card from '../shared/Card';
import styles from './PhaseCard.module.css';

export default function PhaseCard({ item, gameId }) {
  const gameTip = item.gameTips?.[gameId];

  return (
    <Card>
      <h3 className={styles.title}>{item.title}</h3>
      <div className={styles.formula}>{item.formula}</div>
      <p className={styles.note}>{item.note}</p>
      {gameTip && (
        <div className={styles.gameTip}>
          <span className={styles.gameLabel}>{gameId}</span>
          {gameTip}
        </div>
      )}
    </Card>
  );
}
