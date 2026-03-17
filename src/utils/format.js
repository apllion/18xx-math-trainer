export function formatMoney(amount) {
  return `$${Math.round(amount).toLocaleString()}`;
}

export function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
