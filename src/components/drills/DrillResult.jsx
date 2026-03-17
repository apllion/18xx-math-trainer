import { calculateScore } from '../../utils/scoring';
import { formatTime } from '../../utils/format';
import Card from '../shared/Card';
import Button from '../shared/Button';
import styles from './DrillResult.module.css';

export default function DrillResult({ answers, onReset }) {
  const { total, correct, accuracy, avgTime, score } = calculateScore(answers);
  const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);
  const flagged = answers.filter(a => a.flagged);

  return (
    <div className={styles.result}>
      <h2 className={styles.heading}>Session Complete</h2>

      <div className={styles.scoreCard}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreValue}>{score}</span>
          <span className={styles.scoreLabel}>Score</span>
        </div>
      </div>

      <div className={styles.stats}>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{correct}/{total}</span>
            <span className={styles.statLabel}>Correct</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{Math.round(accuracy * 100)}%</span>
            <span className={styles.statLabel}>Accuracy</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{avgTime.toFixed(1)}s</span>
            <span className={styles.statLabel}>Avg Time</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatTime(Math.round(totalTime))}</span>
            <span className={styles.statLabel}>Total Time</span>
          </div>
        </Card>
      </div>

      {flagged.length > 0 && (
        <div className={styles.flaggedSection}>
          <h3 className={styles.flaggedHeading}>Flagged for Review ({flagged.length})</h3>
          {flagged.map((a, i) => (
            <Card key={i} variant="highlighted">
              <p className={styles.flaggedQ}>{a.question.question}</p>
              <p className={styles.flaggedA}>
                Your answer: <strong>{a.userAnswer}</strong> — Correct: <strong>{a.question.answer} {a.question.unit || ''}</strong>
              </p>
              {a.question.explanation && (
                <p className={styles.flaggedExpl}>{a.question.explanation}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className={styles.breakdown}>
        <h3>All Questions</h3>
        {answers.map((a, i) => (
          <div key={i} className={`${styles.answerRow} ${a.isCorrect ? styles.correct : styles.incorrect}`}>
            <span className={styles.answerIcon}>{a.isCorrect ? '✓' : '✗'}</span>
            {a.flagged && <span className={styles.flagIcon}>⚑</span>}
            <span className={styles.answerQuestion}>{a.question.question.slice(0, 80)}...</span>
            <span className={styles.answerTime}>{a.timeSpent.toFixed(1)}s</span>
          </div>
        ))}
      </div>

      <Button size="lg" onClick={onReset}>New Session</Button>
    </div>
  );
}
