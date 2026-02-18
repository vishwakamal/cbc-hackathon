import { useState, useEffect, useRef, useCallback } from 'react';

export default function IcingTimer({ intervalMinutes = 20 }) {
  const [secondsLeft, setSecondsLeft] = useState(intervalMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('ON'); // 'ON' = ice on, 'OFF' = ice off
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  const totalSeconds = intervalMinutes * 60;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Switch phase
            setPhase((p) => {
              if (p === 'ON') return 'OFF';
              setCycles((c) => c + 1);
              return 'ON';
            });
            return totalSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [isRunning, totalSeconds, clearTimer]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('ON');
    setSecondsLeft(totalSeconds);
    setCycles(0);
  };

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mt-4 transition-colors duration-200">
      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 text-center">
        Icing Timer
      </h4>

      {/* Phase indicator */}
      <div className="flex justify-center mb-4">
        <span
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            phase === 'ON'
              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
              : 'bg-amber-light dark:bg-amber-900/30 text-amber'
          }`}
        >
          {phase === 'ON' ? '🧊' : '⏸️'} ICE {phase}
        </span>
      </div>

      {/* Countdown */}
      <div className="text-center mb-4">
        <p className="text-5xl font-mono font-bold text-navy dark:text-blue-300 tracking-wider">
          {formatTime(secondsLeft)}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            phase === 'ON' ? 'bg-blue-500' : 'bg-amber'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-2 rounded-lg font-semibold text-sm text-white transition-colors ${
            isRunning
              ? 'bg-amber hover:bg-yellow-600'
              : 'bg-green hover:bg-emerald-600'
          }`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-lg font-semibold text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Cycle count */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
        Cycles completed: {cycles} &middot; {intervalMinutes} min intervals
      </p>
    </div>
  );
}
