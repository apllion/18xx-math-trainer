import { useState, useCallback } from 'react';
import { generateDrill } from '../generators';

// States: setup → running → reviewing → finished
export default function useDrillSession() {
  const [phase, setPhase] = useState('setup');
  const [config, setConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const startSession = useCallback((sessionConfig) => {
    const { game, difficulty, drillTypes, questionCount = 10 } = sessionConfig;
    setConfig(sessionConfig);

    const generated = [];
    for (let i = 0; i < questionCount; i++) {
      const typeIndex = i % drillTypes.length;
      const drill = generateDrill(drillTypes[typeIndex], game, difficulty);
      generated.push(drill);
    }

    setQuestions(generated);
    setCurrentIndex(0);
    setAnswers([]);
    setPhase('running');
  }, []);

  const submitAnswer = useCallback((userAnswer, timeSpent) => {
    const current = questions[currentIndex];
    const isCorrect = checkAnswer(userAnswer, current.answer, current.unit);

    const result = {
      question: current,
      userAnswer,
      isCorrect,
      timeSpent,
    };

    setAnswers((prev) => [...prev, result]);
    setPhase('reviewing');
  }, [currentIndex, questions]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setPhase('finished');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setPhase('running');
    }
  }, [currentIndex, questions.length]);

  const toggleFlag = useCallback((index) => {
    setAnswers((prev) => prev.map((a, i) =>
      i === index ? { ...a, flagged: !a.flagged } : a
    ));
  }, []);

  const resetSession = useCallback(() => {
    setPhase('setup');
    setConfig(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
  }, []);

  return {
    phase,
    config,
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex] || null,
    answers,
    totalQuestions: questions.length,
    startSession,
    submitAnswer,
    nextQuestion,
    toggleFlag,
    resetSession,
  };
}

function checkAnswer(userAnswer, correctAnswer, unit) {
  const userNum = parseFloat(userAnswer);
  const correctNum = parseFloat(correctAnswer);

  if (isNaN(userNum) || isNaN(correctNum)) {
    return String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
  }

  // Allow 2% tolerance for rounding
  const tolerance = Math.max(1, Math.abs(correctNum) * 0.02);
  return Math.abs(userNum - correctNum) <= tolerance;
}
