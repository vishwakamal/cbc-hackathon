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
    <div className="bg-white rounded-xl shadow-sm p-5 mt-4">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
        Icing Timer
      </h4>

      {/* Phase indicator */}
      <div className="flex justify-center mb-4">
        <span
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            phase === 'ON'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-amber-light text-amber'
          }`}
        >
          {phase === 'ON' ? '🧊' : '⏸️'} ICE {phase}
        </span>
      </div>

      {/* Countdown */}
      <div className="text-center mb-4">
        <p className="text-5xl font-mono font-bold text-navy tracking-wider">
          {formatTime(secondsLeft)}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
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
          className="px-6 py-2 rounded-lg font-semibold text-sm bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Cycle count */}
      <p className="text-xs text-gray-400 text-center mt-3">
        Cycles completed: {cycles} &middot; {intervalMinutes} min intervals
      </p>
    </div>
  );
}
