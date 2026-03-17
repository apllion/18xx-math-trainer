import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import { generateId } from '../../utils/storage';
import Button from '../shared/Button';
import Card from '../shared/Card';
import styles from './PostMortemForm.module.css';

const GAMES = ['1889', '1830', '1846', '1849', '18Chesapeake'];

const EMPTY_FORM = {
  game: '1889',
  date: new Date().toISOString().slice(0, 10),
  players: '',
  result: '',
  inflectionPoint: '',
  trainAnalysis: '',
  stockNotes: '',
  mistakes: '',
  lessons: '',
};

export default function PostMortemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [entries, setEntries] = useLocalStorage('postmortems', []);

  const existing = id ? entries.find(e => e.id === id) : null;
  const [form, setForm] = useState(existing || EMPTY_FORM);

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    if (existing) {
      setEntries(prev => prev.map(e => e.id === id ? { ...form, id } : e));
    } else {
      setEntries(prev => [...prev, { ...form, id: generateId() }]);
    }
    navigate('/postmortem');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{existing ? 'Edit' : 'New'} Post-Mortem</h2>

      <Card>
        <h3 className={styles.sectionTitle}>Game Info</h3>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Game
            <select value={form.game} onChange={update('game')} className={styles.select}>
              {GAMES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          <label className={styles.label}>
            Date
            <input type="date" value={form.date} onChange={update('date')} className={styles.input} />
          </label>
          <label className={styles.label}>
            Players
            <input type="number" min="2" max="6" value={form.players} onChange={update('players')} className={styles.input} placeholder="# players" />
          </label>
          <label className={styles.label}>
            Result
            <input type="text" value={form.result} onChange={update('result')} className={styles.input} placeholder="e.g., 1st place, $2400" />
          </label>
        </div>
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Inflection Point</h3>
        <p className={styles.hint}>What was the key turning point in the game?</p>
        <textarea value={form.inflectionPoint} onChange={update('inflectionPoint')} className={styles.textarea} rows={4} placeholder="Describe the moment that changed the game's direction..." />
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Train Analysis</h3>
        <p className={styles.hint}>How did train purchases and rusting affect the game?</p>
        <textarea value={form.trainAnalysis} onChange={update('trainAnalysis')} className={styles.textarea} rows={4} placeholder="Train timing, rush decisions, rust impact..." />
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Stock Market Notes</h3>
        <p className={styles.hint}>Key stock round decisions and their outcomes.</p>
        <textarea value={form.stockNotes} onChange={update('stockNotes')} className={styles.textarea} rows={4} placeholder="Par choices, dumps, share manipulation..." />
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Mistakes</h3>
        <p className={styles.hint}>What would you do differently?</p>
        <textarea value={form.mistakes} onChange={update('mistakes')} className={styles.textarea} rows={4} placeholder="Errors in judgment, missed opportunities..." />
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Lessons Learned</h3>
        <p className={styles.hint}>Key takeaways for future games.</p>
        <textarea value={form.lessons} onChange={update('lessons')} className={styles.textarea} rows={4} placeholder="Principles to remember, strategies to try..." />
      </Card>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => navigate('/postmortem')}>Cancel</Button>
        <Button onClick={handleSave}>Save Post-Mortem</Button>
      </div>
    </div>
  );
}
