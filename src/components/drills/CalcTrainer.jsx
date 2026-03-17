import { useState, useRef, useEffect, useCallback } from 'react';
import { CALC_CATEGORIES, generateMixedQuestion } from '../../generators/calcTrainer';
import { formatTime } from '../../utils/format';
import Button from '../shared/Button';
import Card from '../shared/Card';
import styles from './CalcTrainer.module.css';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function CalcTrainer() {
  const [phase, setPhase] = useState('setup'); // setup | running | done
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedCats, setSelectedCats] = useState(CALC_CATEGORIES.map(c => c.id));
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState([]);
  const [qStart, setQStart] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Stopwatch
  useEffect(() => {
    if (phase !== 'running' || paused) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, paused]);

  const nextQuestion = useCallback(() => {
    const q = generateMixedQuestion(difficulty, selectedCats);
    setQuestion(q);
    setUserAnswer('');
    setQStart(Date.now());
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [difficulty, selectedCats]);

  const start = () => {
    setResults([]);
    setElapsed(0);
    setPhase('running');
    nextQuestion();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    const timeSpent = (Date.now() - qStart) / 1000;
    const userNum = parseFloat(userAnswer);
    const isCorrect = !isNaN(userNum) && Math.abs(userNum - question.answer) <= Math.max(1, Math.abs(question.answer) * 0.02);

    setResults(prev => [...prev, {
      ...question,
      userAnswer: userAnswer.trim(),
      isCorrect,
      timeSpent,
    }]);
    nextQuestion();
  };

  const finish = () => {
    setPhase('done');
  };

  const toggleCat = (id) => {
    setSelectedCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  if (phase === 'setup') {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Calculation Trainer</h2>
        <p className={styles.subtitle}>Quick-fire 18xx arithmetic. No time limit — go as fast as you can.</p>

        <Card>
          <h3 className={styles.sectionTitle}>Difficulty</h3>
          <div className={styles.toggleGroup}>
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                className={`${styles.toggle} ${difficulty === d ? styles.active : ''}`}
                onClick={() => setDifficulty(d)}
              >{d}</button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className={styles.sectionTitle}>
            Categories
            <button className={styles.selectAll} onClick={() =>
              setSelectedCats(selectedCats.length === CALC_CATEGORIES.length ? [] : CALC_CATEGORIES.map(c => c.id))
            }>
              {selectedCats.length === CALC_CATEGORIES.length ? 'Deselect All' : 'Select All'}
            </button>
          </h3>
          <div className={styles.catGrid}>
            {CALC_CATEGORIES.map(cat => (
              <label key={cat.id} className={`${styles.catItem} ${selectedCats.includes(cat.id) ? styles.catSelected : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedCats.includes(cat.id)}
                  onChange={() => toggleCat(cat.id)}
                />
                <div>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={styles.catDesc}>{cat.description}</span>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Button size="lg" onClick={start} disabled={selectedCats.length === 0}>
          Start Training
        </Button>
      </div>
    );
  }

  if (phase === 'done') {
    const correct = results.filter(r => r.isCorrect).length;
    const total = results.length;
    const avgTime = total > 0 ? results.reduce((s, r) => s + r.timeSpent, 0) / total : 0;

    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Results</h2>

        <div className={styles.statsRow}>
          <Card><div className={styles.stat}><span className={styles.statVal}>{correct}/{total}</span><span className={styles.statLbl}>Correct</span></div></Card>
          <Card><div className={styles.stat}><span className={styles.statVal}>{total > 0 ? Math.round(correct / total * 100) : 0}%</span><span className={styles.statLbl}>Accuracy</span></div></Card>
          <Card><div className={styles.stat}><span className={styles.statVal}>{avgTime.toFixed(1)}s</span><span className={styles.statLbl}>Avg Time</span></div></Card>
          <Card><div className={styles.stat}><span className={styles.statVal}>{formatTime(elapsed)}</span><span className={styles.statLbl}>Total</span></div></Card>
        </div>

        <div className={styles.resultList}>
          {results.map((r, i) => (
            <div key={i} className={`${styles.resultRow} ${r.isCorrect ? styles.rowCorrect : styles.rowWrong}`}>
              <span className={styles.resultIcon}>{r.isCorrect ? '✓' : '✗'}</span>
              <span className={styles.resultQ}>{r.question}</span>
              <span className={styles.resultA}>
                {r.isCorrect ? r.answer : <>{r.userAnswer} <span className={styles.correctA}>→ {r.answer}</span></>}
              </span>
              <span className={styles.resultTime}>{r.timeSpent.toFixed(1)}s</span>
            </div>
          ))}
        </div>

        <Button size="lg" onClick={() => setPhase('setup')}>Again</Button>
      </div>
    );
  }

  // Running phase
  return (
    <div className={styles.container}>
      <div className={styles.runHeader}>
        <span className={styles.elapsed}>{formatTime(elapsed)}</span>
        <span className={styles.count}>{results.length} answered</span>
        <Button variant="secondary" size="sm" onClick={() => setPaused(p => !p)}>
          {paused ? '▶ Resume' : '⏸ Pause'}
        </Button>
        <Button variant="danger" size="sm" onClick={finish}>Done</Button>
      </div>

      {paused ? (
        <div className={styles.pauseOverlay}>
          <div className={styles.pauseModal}>
            <h3>Paused</h3>
            <p className={styles.pauseTime}>{formatTime(elapsed)} — {results.length} answered</p>
            <Button onClick={() => { setPaused(false); inputRef.current?.focus(); }}>Resume</Button>
            <Button variant="ghost" onClick={finish}>End Session</Button>
          </div>
        </div>
      ) : (
        question && (
          <>
            <Card className={styles.questionCard}>
              <span className={styles.qLabel}>{question.categoryName}: {question.label}</span>
              <p className={styles.qText}>{question.question}</p>
            </Card>

            <form onSubmit={handleSubmit} className={styles.answerForm}>
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="= ?"
                className={styles.input}
                autoFocus
              />
              <Button type="submit" disabled={!userAnswer.trim()}>→</Button>
            </form>

            {results.length > 0 && (
              <div className={styles.lastResult}>
                {(() => {
                  const last = results[results.length - 1];
                  return (
                    <span className={last.isCorrect ? styles.lastCorrect : styles.lastWrong}>
                      {last.isCorrect ? '✓' : '✗'} {last.question} = {last.answer}
                      {!last.isCorrect && <> (you: {last.userAnswer})</>}
                      <span className={styles.lastTime}> {last.timeSpent.toFixed(1)}s</span>
                    </span>
                  );
                })()}
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
