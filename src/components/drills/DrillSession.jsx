import { useState, useRef, useEffect } from 'react';
import DrillQuestion from './DrillQuestion';
import Button from '../shared/Button';
import ProgressBar from '../shared/ProgressBar';
import Card from '../shared/Card';
import { formatTime } from '../../utils/format';
import styles from './DrillSession.module.css';

export default function DrillSession({ session }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef(null);
  const elapsedRef = useRef(null);

  const { phase, currentQuestion, currentIndex, totalQuestions, submitAnswer, nextQuestion, toggleFlag, answers } = session;

  // Elapsed time stopwatch
  useEffect(() => {
    if (paused) {
      clearInterval(elapsedRef.current);
      return;
    }
    elapsedRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(elapsedRef.current);
  }, [paused]);

  useEffect(() => {
    setUserAnswer('');
    setQuestionStartTime(Date.now());
    inputRef.current?.focus();
  }, [currentIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phase !== 'running' || !userAnswer.trim() || paused) return;
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    submitAnswer(userAnswer.trim(), timeSpent);
  };

  const handlePause = () => setPaused(true);
  const handleResume = () => {
    setPaused(false);
    setQuestionStartTime(Date.now() - 0); // reset question timer on resume
    inputRef.current?.focus();
  };

  if (!currentQuestion) return null;

  const lastAnswer = phase === 'reviewing' ? answers[answers.length - 1] : null;

  return (
    <div className={styles.session}>
      <div className={styles.topBar}>
        <div className={styles.timerRow}>
          <span className={styles.elapsed}>{formatTime(elapsed)}</span>
          {phase === 'running' && (
            <button className={styles.pauseBtn} onClick={handlePause} title="Pause">
              ⏸
            </button>
          )}
        </div>
        <ProgressBar value={currentIndex + 1} max={totalQuestions} label={`${currentIndex + 1} / ${totalQuestions}`} />
      </div>

      {paused && (
        <div className={styles.pauseOverlay}>
          <div className={styles.pauseModal}>
            <h3>Paused</h3>
            <p className={styles.pauseTime}>{formatTime(elapsed)} elapsed</p>
            <Button onClick={handleResume}>Resume</Button>
            <Button variant="ghost" onClick={() => session.resetSession()}>Quit Session</Button>
          </div>
        </div>
      )}

      <DrillQuestion question={currentQuestion} />

      {phase === 'running' && !paused && (
        <form onSubmit={handleSubmit} className={styles.answerForm}>
          <div className={styles.inputGroup}>
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your answer..."
              className={styles.input}
              autoFocus
            />
            {currentQuestion.unit && <span className={styles.unit}>{currentQuestion.unit}</span>}
          </div>
          <Button type="submit" disabled={!userAnswer.trim()}>Submit</Button>
        </form>
      )}

      {phase === 'reviewing' && lastAnswer && (
        <Card variant={lastAnswer.isCorrect ? 'success' : 'danger'}>
          <div className={styles.review}>
            <p className={styles.reviewResult}>
              {lastAnswer.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className={styles.correctAnswer}>
              Answer: <strong>{currentQuestion.answer} {currentQuestion.unit || ''}</strong>
            </p>
            {currentQuestion.explanation && (
              <p className={styles.explanation}>{currentQuestion.explanation}</p>
            )}
            <div className={styles.reviewActions}>
              <label className={styles.flagLabel}>
                <input
                  type="checkbox"
                  checked={lastAnswer.flagged || false}
                  onChange={() => toggleFlag(answers.length - 1)}
                />
                Flag for review
              </label>
              <Button onClick={nextQuestion}>
                {currentIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
