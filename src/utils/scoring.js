export function calculateScore(answers) {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);
  const avgTime = total > 0 ? totalTime / total : 0;
  const accuracy = total > 0 ? correct / total : 0;

  // Score: accuracy weighted 70%, speed 30%
  // Speed bonus: faster = higher (baseline 30s per question)
  const speedScore = Math.max(0, 1 - avgTime / 30);
  const score = Math.round((accuracy * 0.7 + speedScore * 0.3) * 100);

  return { total, correct, accuracy, avgTime, score };
}
