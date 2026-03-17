import { Link } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import Card from '../shared/Card';
import Button from '../shared/Button';
import styles from './PostMortemList.module.css';

export default function PostMortemList() {
  const [entries] = useLocalStorage('postmortems', []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Post-Mortems</h2>
        <Link to="/postmortem/new">
          <Button>+ New</Button>
        </Link>
      </div>

      {entries.length === 0 ? (
        <Card>
          <p className={styles.empty}>No post-mortems yet. Create one after your next game!</p>
        </Card>
      ) : (
        <div className={styles.list}>
          {[...entries].reverse().map(entry => (
            <Link key={entry.id} to={`/postmortem/${entry.id}`}>
              <Card className={styles.entryCard}>
                <div className={styles.entryHeader}>
                  <span className={styles.game}>{entry.game || 'Unknown'}</span>
                  <span className={styles.date}>{entry.date || ''}</span>
                </div>
                <p className={styles.players}>{entry.players || ''} players</p>
                {entry.result && <p className={styles.result}>{entry.result}</p>}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
