import { useState } from 'react';
import drillTypes from '../../data/drillTypes';
import Button from '../shared/Button';
import Card from '../shared/Card';
import styles from './DrillSetup.module.css';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function DrillSetup({ selectedGame, onStart }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedTypes, setSelectedTypes] = useState(drillTypes.map(d => d.id));
  const [questionCount, setQuestionCount] = useState(10);

  const toggleType = (id) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    if (selectedTypes.length === 0) return;
    onStart({
      game: selectedGame,
      difficulty,
      drillTypes: selectedTypes,
      questionCount,
    });
  };

  return (
    <div className={styles.setup}>
      <h2 className={styles.heading}>Drill Setup</h2>

      <Card>
        <h3 className={styles.sectionTitle}>Difficulty</h3>
        <div className={styles.toggleGroup}>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className={`${styles.toggle} ${difficulty === d ? styles.active : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Questions: {questionCount}</h3>
        <input
          type="range"
          min="5"
          max="30"
          step="5"
          value={questionCount}
          onChange={e => setQuestionCount(Number(e.target.value))}
          className={styles.slider}
        />
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>
          Drill Types
          <button className={styles.selectAll} onClick={() =>
            setSelectedTypes(selectedTypes.length === drillTypes.length ? [] : drillTypes.map(d => d.id))
          }>
            {selectedTypes.length === drillTypes.length ? 'Deselect All' : 'Select All'}
          </button>
        </h3>
        <div className={styles.typeGrid}>
          {drillTypes.map(dt => (
            <label key={dt.id} className={`${styles.typeItem} ${selectedTypes.includes(dt.id) ? styles.selected : ''}`}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(dt.id)}
                onChange={() => toggleType(dt.id)}
                className={styles.checkbox}
              />
              <span className={styles.typeName}>{dt.name}</span>
              <span className={styles.typeDesc}>{dt.description}</span>
            </label>
          ))}
        </div>
      </Card>

      <Button size="lg" onClick={handleStart} disabled={selectedTypes.length === 0}>
        Start Drill ({selectedTypes.length} types, {questionCount} questions)
      </Button>
    </div>
  );
}
