import Card from '../shared/Card';
import styles from './DrillQuestion.module.css';

export default function DrillQuestion({ question }) {
  return (
    <Card className={styles.questionCard}>
      {question.context && <p className={styles.context}>{question.context}</p>}
      <p className={styles.question}>{question.question}</p>
      {question.hint && <p className={styles.hint}>Hint: {question.hint}</p>}
    </Card>
  );
}
