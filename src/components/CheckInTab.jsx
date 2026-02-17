import { useState } from 'react';
import SliderInput from './SliderInput';
import LoadingSpinner from './LoadingSpinner';
import ErrorCard from './ErrorCard';
import Disclaimer from './Disclaimer';
import { callClaude, getCheckInPrompt } from '../api';

const TRAINING_LOADS = ['Rest', 'Light', 'Moderate', 'Heavy'];

function ScoreBadge({ score, status }) {
  const getColor = () => {
    if (score >= 75) return { bg: 'bg-green', ring: 'ring-green' };
    if (score >= 50) return { bg: 'bg-amber', ring: 'ring-amber' };
    if (score >= 25) return { bg: 'bg-orange-500', ring: 'ring-orange-500' };
    return { bg: 'bg-red', ring: 'ring-red' };
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center mb-4">
      <div className={`w-24 h-24 rounded-full ${color.bg} ring-4 ${color.ring} ring-offset-4 flex items-center justify-center mb-3`}>
        <span className="text-3xl font-bold text-white">{score}</span>
      </div>
      <span className="text-lg font-bold text-navy">{status}</span>
    </div>
  );
}

function CheckInResult({ result }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mt-4 animate-in">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">Your Recovery Score</h3>
      <ScoreBadge score={result.score} status={result.status} />
      <div className="border-t border-gray-100 pt-4 mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Recovery Tips</h4>
        <ul className="space-y-2">
          {result.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green mt-0.5">&#10003;</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      {result.seeDoctorFlag && (
        <div className="bg-red-light border border-red rounded-lg p-4 mt-4 flex items-start gap-3">
          <span className="text-red text-xl">&#9888;</span>
          <div>
            <p className="text-red font-bold text-sm">See a Doctor</p>
            <p className="text-sm text-gray-700 mt-1">{result.seeDoctorReason}</p>
          </div>
        </div>
      )}
      <Disclaimer />
    </div>
  );
}

export default function CheckInTab({ apiKey }) {
  const [soreness, setSoreness] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [load, setLoad] = useState('Moderate');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!apiKey) {
      setError('Please enter your Anthropic API key above.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { systemPrompt, userMessage } = getCheckInPrompt({ soreness, sleep, load, area });
      const data = await callClaude(systemPrompt, userMessage, apiKey);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
        <h2 className="text-lg font-bold text-navy mb-4">How are you feeling today?</h2>
        <SliderInput label="Soreness Level" value={soreness} onChange={setSoreness} />
        <SliderInput label="Sleep Quality" value={sleep} onChange={setSleep} />

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Training Load Today</label>
          <div className="grid grid-cols-4 gap-2">
            {TRAINING_LOADS.map((option) => (
              <button
                key={option}
                onClick={() => setLoad(option)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  load === option
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Area of Soreness (optional)</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g., lower back, left knee..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-navy text-white py-3 rounded-xl font-semibold text-base hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
