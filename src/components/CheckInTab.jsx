import { useState } from 'react';
import SliderInput from './SliderInput';
import LoadingSpinner from './LoadingSpinner';
import ErrorCard from './ErrorCard';
import Disclaimer from './Disclaimer';
import { callClaude, getCheckInPrompt } from '../api';

const TRAINING_LOADS = ['Rest', 'Light', 'Moderate', 'Heavy'];

function ScoreBadge({ score, status }) {
  const getColor = () => {
    if (score >= 75) return { bg: 'bg-green',       ring: 'ring-green',       glow: '#4CAF82' };
    if (score >= 50) return { bg: 'bg-amber',       ring: 'ring-amber',       glow: '#F5A623' };
    if (score >= 25) return { bg: 'bg-orange-500',  ring: 'ring-orange-500',  glow: '#F97316' };
    return             { bg: 'bg-red',         ring: 'ring-red',         glow: '#E53E3E' };
  };

  const { bg, ring, glow } = getColor();

  return (
    <div className="flex flex-col items-center mb-5">
      <div
        className={`w-28 h-28 rounded-full ${bg} ring-4 ${ring} ring-offset-4 dark:ring-offset-gray-800 flex items-center justify-center mb-3`}
        style={{ boxShadow: `0 0 24px ${glow}44` }}
      >
        <span className="text-4xl font-extrabold text-white">{score}</span>
      </div>
      <span className="text-lg font-bold text-navy dark:text-blue-300 coach:text-xl">{status}</span>
    </div>
  );
}

function CheckInResult({ result }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md mt-4 overflow-hidden">
      {/* Coloured top stripe based on score */}
      <div className={`h-1.5 ${result.score >= 75 ? 'bg-green' : result.score >= 50 ? 'bg-amber' : 'bg-red'}`} />
      <div className="p-5">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 text-center">
          Your Recovery Score
        </h3>
        <ScoreBadge score={result.score} status={result.status} />

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 coach:text-base">Recovery Tips</h4>
          <ul className="space-y-2.5">
            {result.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300 coach:text-base">
                <span className="text-green mt-0.5 flex-shrink-0 font-bold">&#10003;</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {result.seeDoctorFlag && (
          <div className="bg-red-light dark:bg-red-950/40 border border-red rounded-xl p-4 mt-4 flex items-start gap-3">
            <span className="text-red text-xl flex-shrink-0">&#9888;</span>
            <div>
              <p className="text-red font-bold text-sm coach:text-base">See a Doctor</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 coach:text-base">{result.seeDoctorReason}</p>
            </div>
          </div>
        )}
        <Disclaimer />
      </div>
    </div>
  );
}

export default function CheckInTab() {
  const [soreness, setSoreness] = useState(5);
  const [sleep, setSleep]       = useState(5);
  const [load, setLoad]         = useState('Moderate');
  const [area, setArea]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [result, setResult]     = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { systemPrompt, userMessage } = getCheckInPrompt({ soreness, sleep, load, area });
      const data = await callClaude(systemPrompt, userMessage);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-4 transition-colors duration-200">
        <h2 className="text-lg font-bold text-navy dark:text-blue-300 mb-5 coach:text-2xl">How are you feeling today?</h2>

        <SliderInput label="Soreness Level" value={soreness} onChange={setSoreness} />
        <SliderInput label="Sleep Quality"  value={sleep}    onChange={setSleep} />

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">
            Training Load Today
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TRAINING_LOADS.map((option) => (
              <button
                key={option}
                onClick={() => setLoad(option)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors coach:py-3 coach:text-base ${
                  load === option
                    ? 'bg-navy text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">
            Area of Soreness <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g., lower back, left knee..."
            className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 focus:border-transparent coach:text-base coach:py-3"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-navy text-white py-3.5 rounded-xl font-semibold text-base hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm coach:py-5 coach:text-lg"
        >
          {loading ? 'Analyzing...' : 'Get My Recovery Score'}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorCard message={error} onRetry={handleSubmit} />}
      {result && <CheckInResult result={result} />}
    </div>
  );
}
