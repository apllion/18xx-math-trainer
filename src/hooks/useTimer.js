import { useState, useRef, useCallback, useEffect } from 'react';

export default function useTimer(initialSeconds = 1200) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    setRemaining((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
        return 0;
      }
      return prev - 1;
    });
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  }, []);

  const reset = useCallback((seconds = initialSeconds) => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setRemaining(seconds);
  }, [initialSeconds]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return { remaining, isRunning, start, pause, reset, isFinished: remaining === 0 };
}
