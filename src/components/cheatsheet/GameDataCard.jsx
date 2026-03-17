import Card from '../shared/Card';
import styles from './GameDataCard.module.css';

export default function GameDataCard({ gameData }) {
  return (
    <div className={styles.container}>
      <Card>
        <h3 className={styles.sectionTitle}>Train Roster</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Train</th>
                <th>Cost</th>
                <th>Qty</th>
                <th>Rusted By</th>
              </tr>
            </thead>
            <tbody>
              {gameData.trains.map(t => (
                <tr key={t.name}>
                  <td className={styles.trainName}>{t.name}</td>
                  <td>{gameData.currency}{t.cost}</td>
                  <td>{t.quantity}</td>
                  <td>{t.rustedBy || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {gameData.parValues && (
        <Card>
          <h3 className={styles.sectionTitle}>Par Values</h3>
          <div className={styles.chipRow}>
            {gameData.parValues.map(p => (
              <span key={p} className={styles.chip}>{gameData.currency}{p}</span>
            ))}
          </div>
          <p className={styles.meta}>Float: {gameData.floatPercent}%{gameData.incrementalCap ? ' (incremental capitalization)' : ''}</p>
        </Card>
      )}

      <Card>
        <h3 className={styles.sectionTitle}>Companies ({gameData.companies.length})</h3>
        <div className={styles.companyGrid}>
          {gameData.companies.map(c => (
            <div key={c.abbr} className={styles.company}>
              <span className={styles.companyAbbr}>{c.abbr}</span>
              <span className={styles.companyName}>{c.name}</span>
              <span className={styles.companyTokens}>{c.tokens} tokens</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Private Companies</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Cost</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {gameData.privates.map(p => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>{gameData.currency}{p.cost}</td>
                  <td>{gameData.currency}{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Token Costs</h3>
        <div className={styles.chipRow}>
          {gameData.tokenCosts.map((c, i) => (
            <span key={i} className={styles.chip}>
              {i === 0 ? 'Home: Free' : `#${i + 1}: ${gameData.currency}${c}`}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Starting Cash</h3>
        <div className={styles.chipRow}>
          {Object.entries(gameData.startingCash).map(([players, cash]) => (
            <span key={players} className={styles.chip}>
              {players}p: {gameData.currency}{cash}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
