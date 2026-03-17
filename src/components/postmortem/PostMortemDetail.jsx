import { useParams, useNavigate, Link } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import Card from '../shared/Card';
import Button from '../shared/Button';
import styles from './PostMortemDetail.module.css';

const SECTIONS = [
  { key: 'inflectionPoint', title: 'Inflection Point' },
  { key: 'trainAnalysis', title: 'Train Analysis' },
  { key: 'stockNotes', title: 'Stock Market Notes' },
  { key: 'mistakes', title: 'Mistakes' },
  { key: 'lessons', title: 'Lessons Learned' },
];

export default function PostMortemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entries, setEntries] = useLocalStorage('postmortems', []);
  const entry = entries.find(e => e.id === id);

  if (!entry) {
    return (
      <div className={styles.container}>
        <p>Post-mortem not found.</p>
        <Link to="/postmortem"><Button>Back to List</Button></Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Delete this post-mortem?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
      navigate('/postmortem');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>{entry.game}</h2>
          <p className={styles.meta}>{entry.date} · {entry.players} players · {entry.result}</p>
        </div>
        <div className={styles.actions}>
          <Link to={`/postmortem/${id}/edit`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {SECTIONS.map(({ key, title }) => (
        entry[key] ? (
          <Card key={key}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            <p className={styles.text}>{entry[key]}</p>
          </Card>
        ) : null
      ))}

      <Link to="/postmortem">
        <Button variant="ghost">← Back to List</Button>
      </Link>
    </div>
  );
}
